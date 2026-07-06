# Firestore Rules avancées — Rôles, Custom Claims, Patterns

## Custom Claims Firebase (rôles admin/user)

### Assigner un rôle via Admin SDK

```typescript
// lib/admin/roles.ts — exécuté depuis un endpoint admin protégé
import { adminAuth } from '@/lib/firebase/admin'

export async function setUserRole(uid: string, role: 'admin' | 'editor' | 'user') {
  await adminAuth.setCustomUserClaims(uid, { role })
  // Note : l'utilisateur doit se re-connecter pour que les claims soient mis à jour
}
```

### Rules avec rôles custom claims

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Fonctions helper
    function isAuthenticated() {
      return request.auth != null;
    }

    function getUserRole() {
      return request.auth.token.role;
    }

    function isAdmin() {
      return isAuthenticated() && getUserRole() == 'admin';
    }

    function isEditor() {
      return isAuthenticated() && getUserRole() in ['admin', 'editor'];
    }

    function isOwner(ownerId) {
      return isAuthenticated() && request.auth.uid == ownerId;
    }

    // Profils utilisateurs
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isOwner(userId);
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }

    // Contenus éditoriaux
    match /articles/{articleId} {
      allow read: if isAuthenticated();
      allow create: if isEditor() && validArticle();
      allow update: if isEditor() && (isOwner(resource.data.authorId) || isAdmin());
      allow delete: if isAdmin();
    }

    // Données d'administration — admin seulement
    match /admin/{document=**} {
      allow read, write: if isAdmin();
    }

    // Validation structure article
    function validArticle() {
      let data = request.resource.data;
      return data.keys().hasAll(['title', 'content', 'authorId', 'createdAt'])
        && data.title is string && data.title.size() > 0 && data.title.size() <= 200
        && data.content is string && data.content.size() <= 50000
        && data.authorId == request.auth.uid
        && data.createdAt == request.time;
    }
  }
}
```

---

## Tester les Security Rules avec l'émulateur

```bash
# Démarrer l'émulateur
firebase emulators:start --only firestore

# Exécuter les tests
npx jest --testPathPattern=firestore.rules.test
```

```typescript
// tests/firestore.rules.test.ts
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing'
import { readFileSync } from 'fs'

let testEnv: RulesTestEnvironment

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'test-project',
    firestore: { rules: readFileSync('firestore.rules', 'utf8') },
  })
})

afterEach(async () => testEnv.clearFirestore())
afterAll(async () => testEnv.cleanup())

test('user can read own document', async () => {
  const alice = testEnv.authenticatedContext('alice')
  await assertSucceeds(
    alice.firestore().collection('users').doc('alice').get()
  )
})

test('user cannot read other user document', async () => {
  const alice = testEnv.authenticatedContext('alice')
  await assertFails(
    alice.firestore().collection('users').doc('bob').get()
  )
})

test('unauthenticated user cannot read anything', async () => {
  const unauth = testEnv.unauthenticatedContext()
  await assertFails(
    unauth.firestore().collection('users').doc('alice').get()
  )
})

test('admin can read any user document', async () => {
  const admin = testEnv.authenticatedContext('admin-uid', {
    token: { role: 'admin' },
  })
  await assertSucceeds(
    admin.firestore().collection('users').doc('alice').get()
  )
})
```

---

## Anti-patterns à éviter

```javascript
// ❌ DANGEREUX — accès total
match /{document=**} {
  allow read, write: if request.auth != null;
}

// ❌ DANGEREUX — test mode oublié en production
match /{document=**} {
  allow read, write: if true;
}

// ❌ Validation insuffisante — champs non contrôlés
match /users/{userId} {
  allow write: if request.auth.uid == userId;
  // Un user peut écrire n'importe quel champ, y compris `isAdmin: true`
}

// ✅ Validation stricte des champs autorisés
match /users/{userId} {
  allow write: if request.auth.uid == userId
    && request.resource.data.keys().hasOnly(['displayName', 'photoURL', 'updatedAt']);
}
```

---

## Déployer les rules via CLI (recommandé pour CI/CD)

```bash
# Déployer rules Firestore
firebase deploy --only firestore:rules

# Déployer rules Storage
firebase deploy --only storage

# Déployer les deux
firebase deploy --only firestore:rules,storage
```

Intégrer dans GitHub Actions avant chaque déploiement Vercel.
