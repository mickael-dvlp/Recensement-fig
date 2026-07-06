# RGPD — Conformité complète Next.js + Firebase

## Obligations légales minimales

| Obligation | Implémentation technique |
|---|---|
| Droit d'accès | Endpoint `/api/user/export` |
| Droit à l'effacement | `deleteUserData(uid)` |
| Portabilité | Export JSON standardisé |
| Minimisation | Ne stocker que les champs nécessaires |
| Consentement | Logger timestamp + version dans Firestore |
| Sécurité | HttpOnly cookies, chiffrement, rules Firestore |

---

## Suppression complète des données utilisateur

```typescript
// lib/gdpr/delete-user.ts
import 'server-only'
import { adminAuth, adminDb, adminStorage } from '@/lib/firebase/admin'

export async function deleteUserData(uid: string): Promise<void> {
  console.log(`[RGPD] Début suppression pour uid: ${uid}`)

  // 1. Supprimer les sous-collections Firestore
  await deleteCollection(`users/${uid}/documents`)
  await deleteCollection(`users/${uid}/activity`)

  // 2. Supprimer le document principal
  await adminDb.collection('users').doc(uid).delete()

  // 3. Supprimer toutes les données partagées de cet user
  const userPosts = await adminDb
    .collection('posts')
    .where('authorId', '==', uid)
    .get()
  const batch = adminDb.batch()
  userPosts.docs.forEach(doc => batch.delete(doc.ref))
  await batch.commit()

  // 4. Supprimer fichiers Firebase Storage
  const bucket = adminStorage.bucket()
  const [files] = await bucket.getFiles({ prefix: `users/${uid}/` })
  await Promise.all(files.map(f => f.delete()))

  // 5. Supprimer le compte Firebase Auth (en dernier)
  await adminAuth.deleteUser(uid)

  // 6. Logger la suppression (pour audit RGPD — sans données perso)
  await adminDb.collection('gdpr_deletions').add({
    deletedAt: new Date().toISOString(),
    // Ne pas stocker l'uid ici (données déjà supprimées)
    status: 'completed',
  })

  console.log(`[RGPD] Suppression complète terminée`)
}

async function deleteCollection(path: string): Promise<void> {
  const collRef = adminDb.collection(path)
  const snapshot = await collRef.get()
  if (snapshot.empty) return

  const batch = adminDb.batch()
  snapshot.docs.forEach(doc => batch.delete(doc.ref))
  await batch.commit()

  // Récursion si >500 documents
  if (snapshot.size >= 500) await deleteCollection(path)
}
```

---

## Export des données (portabilité)

```typescript
// app/api/user/export/route.ts
import { getVerifiedSession } from '@/lib/auth/session'
import { adminDb, adminStorage } from '@/lib/firebase/admin'

export async function GET() {
  const session = await getVerifiedSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const uid = session.uid

  // Collecter toutes les données
  const [userDoc, documents, posts] = await Promise.all([
    adminDb.collection('users').doc(uid).get(),
    adminDb.collection('users').doc(uid).collection('documents').get(),
    adminDb.collection('posts').where('authorId', '==', uid).get(),
  ])

  const exportData = {
    exportedAt: new Date().toISOString(),
    profile: userDoc.data() ?? {},
    documents: documents.docs.map(d => ({ id: d.id, ...d.data() })),
    posts: posts.docs.map(d => ({ id: d.id, ...d.data() })),
  }

  return new Response(JSON.stringify(exportData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="mes-donnees-${uid}.json"`,
    },
  })
}
```

---

## Logging du consentement

```typescript
// lib/gdpr/consent.ts
import { adminDb } from '@/lib/firebase/admin'

export async function logConsent(uid: string, consentType: string, version: string) {
  await adminDb.collection('users').doc(uid).collection('consents').add({
    type: consentType,      // 'marketing', 'analytics', 'terms'
    version,                 // '2025-01-01'
    givenAt: new Date().toISOString(),
    // Ne pas stocker d'infos device ou IP (minimisation)
  })
}

export async function withdrawConsent(uid: string, consentType: string) {
  await adminDb.collection('users').doc(uid).collection('consents').add({
    type: consentType,
    withdrawn: true,
    withdrawnAt: new Date().toISOString(),
  })
}
```

---

## Mentions légales obligatoires

Vérifier que le projet contient :
- [ ] `/privacy` — Politique de confidentialité (durées de conservation, droits)
- [ ] `/terms` — CGU
- [ ] Bandeau de consentement cookies si analytics/tracking
- [ ] Contact DPO ou responsable traitement (email dans la politique)
- [ ] Registre des traitements (document interne, pas en ligne)

---

## Durées de conservation à configurer

```typescript
// Cloud Function ou Cron Vercel — nettoyage automatique
// À déclencher hebdomadairement

const RETENTION_POLICIES = {
  'activity_logs': 90,        // 90 jours
  'gdpr_deletions': 365,      // 1 an (obligation légale)
  'consents': 5 * 365,        // 5 ans (preuve légale)
  'inactive_accounts': 2 * 365, // 2 ans sans connexion
}
```
