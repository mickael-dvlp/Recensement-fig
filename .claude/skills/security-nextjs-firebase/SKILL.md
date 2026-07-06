---
name: security-nextjs-firebase
description: >
  Audit, implement, and enforce security best practices for Next.js (App Router) projects
  using Firebase Auth (email/password + Google OAuth), Firestore, Firebase Storage, and
  Vercel deployments. Use this skill whenever the user mentions: security audit, security
  review, auth protection, Firestore rules, environment variables, secrets, RGPD/GDPR,
  file upload security, middleware auth, Server Actions security, API route protection,
  CVE, XSS, CSRF, injection, data leak, or any security-adjacent concern in a
  Next.js + Firebase + Vercel stack. Also trigger when the user asks Claude to "add auth
  checks", "protect a route", "review my rules", or "check my .env".
---

# Security Skill — Next.js + Firebase + Vercel

## Stack cible
- **Frontend/Backend** : Next.js App Router (Server Components, Server Actions, Route Handlers)
- **Auth** : Firebase Auth — email/password + Google OAuth
- **Base de données** : Firestore + Firebase Storage
- **Déploiement** : Vercel
- **Données sensibles** : RGPD, documents utilisateurs

---

## 1. Philosophie de sécurité

Appliquer systématiquement ces 4 principes, dans cet ordre de priorité :

1. **Défense en profondeur** — chaque couche vérifie l'auth indépendamment (middleware ≠ seule protection)
2. **Zero Trust** — ne jamais faire confiance au client, valider tout côté serveur
3. **Moindre privilège** — Firebase rules, IAM, env vars : donner le minimum nécessaire
4. **Fail secure** — en cas d'erreur ou de doute, refuser l'accès

> ⚠️ **CVE-2025-29927** : Une faille critique (CVSS 9.1) permettait de bypasser tout le middleware Next.js via le header `x-middleware-subrequest`. Vercel était protégé automatiquement, mais le middleware ne doit JAMAIS être la seule barrière d'auth. Toujours re-vérifier dans les Server Components et Route Handlers.

---

## 2. Architecture d'authentification Firebase + Next.js

### Pattern recommandé : Session Cookie HttpOnly

```
Client Firebase SDK → signIn → getIdToken()
        ↓
POST /api/auth/session  (Route Handler)
        ↓
Firebase Admin SDK → verifyIdToken() → createSessionCookie()
        ↓
Cookie HttpOnly + Secure + SameSite=Lax (5 jours max)
        ↓
Middleware → vérifie cookie → redirige si absent
        ↓
Server Component / Route Handler → re-vérifie cookie (défense en profondeur)
```

**Pourquoi pas localStorage ?** Exposé aux attaques XSS. Le cookie HttpOnly est inaccessible au JavaScript côté client.

### Implémentation

```typescript
// lib/firebase/admin.ts — initialisation Admin SDK (server-only)
import 'server-only'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const app = getApps().length === 0
  ? initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_ADMIN_SDK!)) })
  : getApps()[0]

export const adminAuth = getAuth(app)
```

```typescript
// app/api/auth/session/route.ts — création de session
import { cookies } from 'next/headers'
import { adminAuth } from '@/lib/firebase/admin'

export async function POST(request: Request) {
  const { idToken } = await request.json()
  
  if (!idToken || typeof idToken !== 'string') {
    return Response.json({ error: 'Invalid token' }, { status: 400 })
  }

  const expiresIn = 60 * 60 * 24 * 5 * 1000 // 5 jours
  
  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn })
    const cookieStore = await cookies()
    cookieStore.set('__session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expiresIn / 1000,
      path: '/',
    })
    return Response.json({ status: 'ok' })
  } catch {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
```

```typescript
// lib/auth/session.ts — helper réutilisable côté serveur
import 'server-only'
import { cookies } from 'next/headers'
import { adminAuth } from '@/lib/firebase/admin'

export async function getVerifiedSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('__session')?.value
  if (!sessionCookie) return null

  try {
    return await adminAuth.verifySessionCookie(sessionCookie, true)
  } catch {
    return null
  }
}
```

```typescript
// middleware.ts — première barrière (UX, pas sécurité seule)
import { NextRequest, NextResponse } from 'next/server'

// Routes publiques — tout le reste est protégé par défaut
const PUBLIC_PATHS = ['/login', '/register', '/api/auth', '/_next', '/favicon.ico']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p))

  if (!isPublic && !request.cookies.get('__session')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

```typescript
// app/dashboard/page.tsx — RE-vérification obligatoire (défense en profondeur)
import { getVerifiedSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await getVerifiedSession()
  if (!session) redirect('/login') // ← toujours, même si middleware existe

  return <div>Bienvenue {session.email}</div>
}
```

---

## 3. Protection des Route Handlers et Server Actions

### Règle absolue : chaque Server Action = endpoint public

```typescript
// ✅ Server Action sécurisée
'use server'
import { getVerifiedSession } from '@/lib/auth/session'
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().max(10000),
})

export async function createDocument(formData: FormData) {
  // 1. Auth
  const session = await getVerifiedSession()
  if (!session) throw new Error('Unauthorized')

  // 2. Validation Zod
  const parsed = schema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  })
  if (!parsed.success) throw new Error('Invalid input')

  // 3. Authorization — l'utilisateur ne peut créer que ses propres docs
  // (Firestore Admin SDK côté serveur ici)
}
```

**Pièges à éviter dans les Server Actions** :
- Ne jamais capturer de variable d'env secrète dans une closure d'une Server Action exposée au client
- Valider l'ownership des ressources (un user ne peut modifier que ses propres données)
- Rate limiting sur les actions sensibles (voir section 7)

---

## 4. Variables d'environnement — règles strictes

### Séparation client/serveur

```bash
# .env.local — règles absolues

# ✅ OK côté client (valeurs non secrètes uniquement)
NEXT_PUBLIC_FIREBASE_API_KEY="AIza..."          # clé publique Firebase (normale)
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="projet.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="mon-projet"
NEXT_PUBLIC_APP_URL="https://monapp.com"

# ✅ Secrets — JAMAIS de NEXT_PUBLIC_ prefix
FIREBASE_ADMIN_SDK='{"type":"service_account",...}'   # JSON complet du compte de service
FIREBASE_ADMIN_PROJECT_ID="mon-projet"
```

**Audit rapide** — à faire systématiquement :
```bash
# Chercher des secrets exposés dans le bundle client
grep -rE "NEXT_PUBLIC_" .env* | grep -iE "secret|key|token|password|admin|private"

# Vérifier le bundle compilé
grep -rE "sk_|AKIA|eyJ|-----BEGIN" .next/static/ 2>/dev/null
```

### Configuration Vercel

- Marquer tous les secrets comme **Sensitive** (chiffrement au repos)
- Utiliser des valeurs différentes par environnement (Production ≠ Preview)
- Activer **Deployment Protection** sur les Preview deployments
- Ne jamais partager les clés de production en Preview

---

## 5. Firestore Security Rules

### Principes fondamentaux

```javascript
// firestore.rules — structure de base sécurisée

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ❌ Jamais ça en production :
    // match /{document=**} { allow read, write: if true; }

    // Fonctions helper réutilisables
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isAdmin() {
      return isAuthenticated() && request.auth.token.admin == true;
    }

    function isValidTimestamp() {
      return request.resource.data.updatedAt == request.time;
    }

    // Documents utilisateurs
    match /users/{userId} {
      allow read: if isOwner(userId);
      allow create: if isOwner(userId) && isValidUserData();
      allow update: if isOwner(userId) && isValidUserData();
      allow delete: if isAdmin();
    }

    // Documents privés (RGPD — accès strictement limité)
    match /users/{userId}/documents/{docId} {
      allow read, write: if isOwner(userId);
    }

    // Données partagées (lecture authentifiée, écriture owner)
    match /posts/{postId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated()
        && request.resource.data.authorId == request.auth.uid;
      allow update, delete: if isOwner(resource.data.authorId);
    }

    function isValidUserData() {
      let data = request.resource.data;
      return data.keys().hasOnly(['displayName', 'email', 'photoURL', 'updatedAt'])
        && data.displayName is string
        && data.displayName.size() <= 100;
    }
  }
}
```

### ⚠️ Piège Admin SDK

```typescript
// Le Admin SDK BYPASS les Security Rules !
// Si tu utilises le Admin SDK côté serveur (Next.js API routes),
// tu dois enforcer les permissions manuellement dans ton code.

import { adminDb } from '@/lib/firebase/admin'

export async function getUserDoc(session: DecodedIdToken, targetUserId: string) {
  // Vérification manuelle obligatoire avec Admin SDK
  if (session.uid !== targetUserId && !session.admin) {
    throw new Error('Forbidden')
  }
  return adminDb.collection('users').doc(targetUserId).get()
}
```

---

## 6. Firebase Storage Security Rules

```javascript
// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Documents utilisateurs privés
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Validation fichiers uploadés
    match /users/{userId}/documents/{fileName} {
      allow write: if request.auth != null
        && request.auth.uid == userId
        && request.resource.size < 10 * 1024 * 1024        // max 10 MB
        && request.resource.contentType.matches('application/pdf|image/.*');
    }
  }
}
```

**Validation serveur obligatoire en plus des rules** — voir `references/file-upload-security.md`

---

## 7. Headers de sécurité Next.js

```typescript
// next.config.ts
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://apis.google.com",  // Firebase Auth
      "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com",
      "frame-src 'self' https://accounts.google.com",  // OAuth popup
      "img-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline'",
    ].join('; '),
  },
]

export default {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}
```

---

## 8. Rate limiting (Vercel Edge)

```typescript
// middleware.ts — rate limiting sur les routes sensibles
import { NextRequest, NextResponse } from 'next/server'

const RATE_LIMIT_MAP = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMITS: Record<string, { max: number; window: number }> = {
  '/api/auth': { max: 10, window: 60_000 },    // 10 tentatives / minute
  '/api/documents': { max: 50, window: 60_000 }, // 50 req / minute
}

function getRateLimit(pathname: string) {
  return Object.entries(RATE_LIMITS).find(([path]) => pathname.startsWith(path))?.[1]
}

export function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  const pathname = request.nextUrl.pathname
  const limit = getRateLimit(pathname)

  if (limit) {
    const key = `${ip}:${pathname}`
    const now = Date.now()
    const entry = RATE_LIMIT_MAP.get(key)

    if (!entry || now > entry.resetTime) {
      RATE_LIMIT_MAP.set(key, { count: 1, resetTime: now + limit.window })
    } else if (entry.count >= limit.max) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 })
    } else {
      entry.count++
    }
  }

  // ... reste du middleware auth
}
```

---

## 9. RGPD — checklist données personnelles

Quand le projet gère des données RGPD :

- [ ] **Minimisation** : ne stocker dans Firestore que les champs strictement nécessaires
- [ ] **Droit à l'effacement** : implémenter `deleteUserData(uid)` qui purge Firestore + Storage + Firebase Auth
- [ ] **Export des données** : endpoint `/api/user/export` qui retourne toutes les données en JSON
- [ ] **Consentement** : logger le consentement avec timestamp dans Firestore
- [ ] **Logs d'accès** : tracer les accès aux données sensibles (qui, quand, quoi)
- [ ] **Chiffrement** : données médicales ou très sensibles → chiffrer avant stockage Firestore

```typescript
// lib/gdpr/delete-user.ts
import 'server-only'
import { adminAuth, adminDb, adminStorage } from '@/lib/firebase/admin'

export async function deleteUserData(uid: string) {
  const batch = adminDb.batch()

  // 1. Supprimer les documents Firestore
  const userDocs = await adminDb.collection('users').doc(uid).collection('documents').get()
  userDocs.docs.forEach(doc => batch.delete(doc.ref))
  batch.delete(adminDb.collection('users').doc(uid))
  await batch.commit()

  // 2. Supprimer les fichiers Storage
  const [files] = await adminStorage.bucket().getFiles({ prefix: `users/${uid}/` })
  await Promise.all(files.map(f => f.delete()))

  // 3. Supprimer le compte Firebase Auth
  await adminAuth.deleteUser(uid)
}
```

---

## 10. Checklist audit de sécurité

À appliquer à chaque nouveau projet ou avant mise en production.

**Auth & Sessions**
- [ ] Session cookie HttpOnly + Secure + SameSite=Lax
- [ ] Re-vérification auth dans chaque Server Component et Route Handler (pas seulement middleware)
- [ ] Firebase Auth persistence désactivé côté client si session cookie utilisé
- [ ] Déconnexion : cookie supprimé + `revokeRefreshTokens()` côté serveur

**Variables d'environnement**
- [ ] Zéro secret avec prefix `NEXT_PUBLIC_`
- [ ] Secrets marqués "Sensitive" sur Vercel
- [ ] `.env.local` dans `.gitignore`
- [ ] `.env.example` commité (avec valeurs fictives)
- [ ] Valeurs différentes Production / Preview / Development

**Firestore**
- [ ] Rules en mode "locked" par défaut (`allow read, write: if false`)
- [ ] Chaque collection a des rules explicites
- [ ] Validation des données dans les rules (`hasOnly()`, types, tailles)
- [ ] Tests des rules avec le Firebase Emulator
- [ ] Admin SDK : vérifications manuelles des permissions (bypass des rules)

**Next.js App Router**
- [ ] Server Actions : auth + validation Zod + authorization ownership
- [ ] Route Handlers : idem, pas de données exposées sans auth
- [ ] Pas de secrets dans les closures de Server Actions
- [ ] Headers CSP configurés dans `next.config.ts`
- [ ] `import 'server-only'` dans tous les modules serveur sensibles

**Fichiers utilisateurs**
- [ ] Storage Rules : size limit + content-type validation
- [ ] Validation côté serveur avant upload (type MIME réel, pas extension)
- [ ] URLs signées avec expiration pour accès privé (pas URLs publiques)

**Vercel**
- [ ] Deployment Protection activé sur Preview
- [ ] Audit log vérifié régulièrement
- [ ] `next start` version patchée (≥ 15.2.3 pour CVE-2025-29927)

---

## Références détaillées

Pour les sujets complexes, lire les fichiers de référence :

- **Upload de fichiers sécurisé** → `references/file-upload-security.md`
- **Firestore rules avancées (multi-tenant, rôles)** → `references/firestore-rules-advanced.md`
- **RGPD complet** → `references/gdpr-compliance.md`
