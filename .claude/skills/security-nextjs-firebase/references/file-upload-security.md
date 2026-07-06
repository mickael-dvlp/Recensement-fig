# Sécurité des uploads de fichiers — Firebase Storage + Next.js

## Flux recommandé

```
Client → POST /api/upload (Route Handler)
              ↓
         Auth vérifiée (getVerifiedSession)
              ↓
         Validation serveur (type MIME réel, taille, nom)
              ↓
         Upload via Admin SDK → Storage privé
              ↓
         URL signée temporaire retournée
```

**Ne jamais** laisser le client uploader directement vers Firebase Storage sans validation serveur préalable.

---

## Validation serveur complète

```typescript
// app/api/upload/route.ts
import 'server-only'
import { getVerifiedSession } from '@/lib/auth/session'
import { adminStorage } from '@/lib/firebase/admin'
import { v4 as uuidv4 } from 'uuid'

const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

// Signatures de fichiers (magic bytes) pour validation réelle
const MAGIC_BYTES: Record<string, number[][]> = {
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]],          // %PDF
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],                       // JPEG
  'image/png': [[0x89, 0x50, 0x4E, 0x47]],                 // PNG
  'image/webp': [[0x52, 0x49, 0x46, 0x46]],                // RIFF (WebP)
}

function detectMimeType(buffer: Buffer): string | null {
  for (const [mime, signatures] of Object.entries(MAGIC_BYTES)) {
    for (const sig of signatures) {
      if (sig.every((byte, i) => buffer[i] === byte)) return mime
    }
  }
  return null
}

function sanitizeFileName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '_')  // Supprimer les caractères dangereux
    .replace(/\.{2,}/g, '_')             // Prévenir path traversal (..)
    .slice(0, 100)                        // Limiter la longueur
}

export async function POST(request: Request) {
  // 1. Auth
  const session = await getVerifiedSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  // 2. Parse multipart
  const formData = await request.formData()
  const file = formData.get('file') as File | null
  if (!file) return Response.json({ error: 'No file provided' }, { status: 400 })

  // 3. Vérification taille
  if (file.size > MAX_SIZE_BYTES) {
    return Response.json({ error: 'File too large (max 10MB)' }, { status: 413 })
  }

  // 4. Vérification type MIME réel (magic bytes, pas l'extension)
  const buffer = Buffer.from(await file.arrayBuffer())
  const realMime = detectMimeType(buffer)
  if (!realMime || !ALLOWED_MIME_TYPES.includes(realMime)) {
    return Response.json({ error: 'File type not allowed' }, { status: 415 })
  }

  // 5. Nom de fichier sécurisé
  const safeFileName = sanitizeFileName(file.name)
  const storagePath = `users/${session.uid}/documents/${uuidv4()}_${safeFileName}`

  // 6. Upload via Admin SDK
  const bucket = adminStorage.bucket()
  const fileRef = bucket.file(storagePath)
  await fileRef.save(buffer, {
    metadata: {
      contentType: realMime,
      metadata: {
        uploadedBy: session.uid,
        originalName: safeFileName,
        uploadedAt: new Date().toISOString(),
      },
    },
  })

  // 7. URL signée avec expiration (15 minutes)
  const [signedUrl] = await fileRef.getSignedUrl({
    action: 'read',
    expires: Date.now() + 15 * 60 * 1000,
  })

  // 8. Sauvegarder la référence en Firestore
  // await adminDb.collection('users').doc(session.uid).collection('documents').add({...})

  return Response.json({ url: signedUrl, path: storagePath })
}
```

---

## Génération d'URL signée pour accès privé

```typescript
// lib/storage/signed-url.ts
import 'server-only'
import { adminStorage } from '@/lib/firebase/admin'
import { getVerifiedSession } from '@/lib/auth/session'

export async function getSignedDownloadUrl(
  storagePath: string,
  expiresInMinutes = 60
): Promise<string> {
  const session = await getVerifiedSession()
  if (!session) throw new Error('Unauthorized')

  // Vérifier ownership via le path
  if (!storagePath.startsWith(`users/${session.uid}/`)) {
    throw new Error('Forbidden')
  }

  const [url] = await adminStorage.bucket().file(storagePath).getSignedUrl({
    action: 'read',
    expires: Date.now() + expiresInMinutes * 60 * 1000,
  })

  return url
}
```

---

## Quota et protection DDoS upload

```typescript
// Vérifier le quota avant upload (dans le Route Handler)
async function checkUploadQuota(uid: string): Promise<void> {
  const userRef = adminDb.collection('users').doc(uid)
  const userData = (await userRef.get()).data()
  
  const storageUsedBytes = userData?.storageUsedBytes ?? 0
  const MAX_STORAGE_PER_USER = 500 * 1024 * 1024 // 500 MB
  
  if (storageUsedBytes >= MAX_STORAGE_PER_USER) {
    throw new Error('Storage quota exceeded')
  }
}
```
