# CLAUDE.md — App MESBG

Guide de référence pour Claude Code sur ce projet.

---

## Stack technique

- **Framework** : Next.js 14 App Router (`app/` directory)
- **Auth + BDD** : Firebase (Auth, Firestore, Storage)
- **Style** : Tailwind CSS v4
- **Déploiement** : Vercel — domaine `mesbg-collection-app.com`
- **Langue** : Français (variables, commentaires, UI)

---

## Charte graphique

### Palette de couleurs (Tailwind inline ou classes custom)

| Rôle | Valeur | Usage |
|---|---|---|
| Or principal | `#C9A227` | Accents, titres, boutons actifs |
| Or survol | `#E6C25A` | Hover states |
| Noir profond | `#0D0D0D` | Fond de page, `bg-[#0D0D0D]` |
| Fond cartes | `#1A1A1A` | Cards, panels |
| Fond secondaire | `#2A2A2A` | Bordures, séparateurs |
| Bordures | `#3A3A3A` | Bordures interactives |
| Texte secondaire | `#6B6B6B` | Labels, placeholders |
| Texte principal | `#F5F5F5` | Corps de texte |
| Vert inventaire | `#22C55E` | Indicateur "possédé" |
| Rouge souhait | `red-500` | Cœur souhaitées |

### Typographie

- **Titres de page** : `uppercase tracking-widest font-bold text-[#F5F5F5]`
- **Labels de section** : `text-[#C9A227] text-xs font-bold uppercase tracking-widest`
- **Texte secondaire** : `text-[#6B6B6B] text-xs`
- **Police décorative** (titres médiévaux) : `font-elvish` (Uncial Antiqua via CSS variable `--font-elvish`)

### Composants récurrents

- **Ligne dorée décorative** : `<div className="h-0.5 bg-linear-to-r from-transparent via-[#C9A227] to-transparent" />`
- **En-tête sticky** : `sticky top-0 z-40 bg-[#0D0D0D] border-b border-[#2A2A2A]`
- **Carte** : `bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl`
- **Bouton primaire** : fond `#C9A227`, texte `#0D0D0D`
- **Bouton secondaire** : `border border-[#3A3A3A] text-[#6B6B6B] hover:border-[#C9A227] hover:text-[#C9A227]`
- **Badge/pill** : `rounded-full px-2 py-0.5 text-xs font-bold`
- **Skeleton loader** : `bg-[#1A1A1A] rounded-xl animate-pulse`

---

## Architecture Firestore

```
utilisateurs/{uid}
  ├── inventaire/{figurineId}   → { quantiteInventaire, quantitePeinte, souhaite, enInventaire, ... }
  ├── memos/{memoId}            → { titre, texte, type, figurines, ordre, creeLe }
  ├── figurinesCustom/{id}      → { nom, faction, section, imageUrl, creeLe }
  └── amis/{amiUid}             → { statut: "envoyé"|"reçu"|"accepté", pseudo }

pseudos/{pseudo_lowercase}      → { uid, pseudo }
```

### Protocole amis (2 états)
- Expéditeur → `statut: "envoyé"` dans `utilisateurs/monUid/amis/amiUid`
- Destinataire → `statut: "reçu"` dans `utilisateurs/amiUid/amis/monUid`
- Acceptation → les deux passent à `"accepté"`

---

## Hooks partagés

### `useInventaire(uid, opExtra?)`
Charge l'inventaire + rafraîchit au focus de l'onglet. Retourne `{ inventaire, setInventaire, chargement, mettreAJour }`.
- `mettreAJour(figurineId, data)` : mise à jour optimiste avec rollback automatique si Firestore échoue.
- `opExtra` : callback `(uid) => Promise` exécuté en parallèle (ex. charger les figurines custom). Stocké en ref — ne re-déclenche pas l'effet si la référence change.

### `useAuth()`
Retourne `{ utilisateur, profil, chargement, isInvite, nbDemandesAmis, rafraichirProfil, rafraichirDemandesAmis, seConnecter, sInscrire, seDeconnecter, seConnecterAvecGoogle, seConnecterEnInvite, reinitialiserMotDePasse }`.

---

## Conventions de code

- **Pas de commentaires évidents** — seulement si le WHY est non-trivial (contrainte cachée, workaround, invariant subtil).
- **Pas de `mettreAJourFigurine` direct dans les pages** — passer par `mettreAJour` du hook `useInventaire`.
- **Optimistic update** : toujours via `mettreAJour` (déjà dans le hook), jamais à la main.
- **Imports** : pas d'import de `mettreAJourFigurine` dans les pages — c'est le hook qui s'en charge.
- **`Promise.allSettled`** plutôt que `Promise.all` quand une erreur partielle ne doit pas bloquer le reste.
- **Variables en français** : noms de variables, fonctions, composants, commentaires.

---

## Sécurité (Firestore Rules)

- Chaque `allow create/update` sur la sous-collection `amis` a un `hasOnly(["statut","pseudo"])` pour bloquer l'injection de champs arbitraires.
- Jamais de `allow write` générique — toujours décomposer en `create`, `update`, `delete` séparés.
- Les limites (mémos ≤ 100, customs ≤ 200) sont vérifiées à la fois côté client ET dans les règles Firestore.

---

## Structure des dossiers

```
app/
  (main)/           → pages protégées (layout avec nav)
    accueil/
    figurines/
      [faction]/    → page par faction (héros + guerriers)
    heroes/
      [hero]/       → variantes d'un héros
    liste/          → analyseur TTS (army builder)
    peinture/       → catalogue peintures
    projet/         → mémos drag-and-drop
    amis/           → système d'amis
      [amiUid]/     → profil ami (lecture seule)
  (auth)/           → pages connexion/inscription

components/
  figurines/        → FigurineRow, FigurineCard, HeroCard, FilterTabs, CarteAjoutCustom
  navigation/       → BottomNav
  ui/               → SearchBar, PopupEnConstruction

data/
  factions/         → un fichier JS par faction (heros[], guerriers[])
  heros/            → index.js avec toutes les variantes héros
  peintures/        → citadel.json, vallejo.json, army-painter.json
  tts-mapping.json  → correspondance clé TTS → ID figurine

lib/
  firebase.js       → init Firebase
  firestore.js      → toutes les fonctions Firestore
  auth-context.jsx  → AuthProvider + useAuth
  tts-parser.js     → parseTTS, aggregerFigurines, resoudreId
  hooks/
    useInventaire.js
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
