# Tâches à faire

> Liste des chantiers en cours, triés par priorité (le plus haut = le plus prioritaire).

---

## 🔴 Priorité 1 — Publication sur le Play Store

Branche : `app-store`

### Phase 1 — Rendre l'app PWA installable (code, sur `app-store`)
- [x] `app/manifest.js` — nom, description, icônes, `display: "standalone"`, couleurs (`#0D0D0D`)
- [x] Icônes 192×192, 512×512 + variante "maskable" générées depuis `public/image/logo-source.png` (`public/icons/`)
- [x] Politique de confidentialité / mentions légales en page publique (`/politique-confidentialite`, accessible sans compte) — contenu partagé avec la modale du profil via `components/legal/MentionsLegalesContenu.jsx`
- [x] Service worker minimal (`public/sw.js` + enregistrement dans `app/layout.jsx`) — pas d'offline complet, juste le critère d'installabilité
- [ ] Vérification manifest + service worker dans Chrome DevTools (panneau "Application") une fois déployé — **à faire par toi en prod**, `lighthouse` en CLI n'a plus la catégorie PWA (dépréciée par Google), donc pas automatisable depuis ici

### Phase 2 — Déploiement + génération du projet Android (mix repo/externe)
- [x] `app-store` mergée sur `main`, déployée sur `mesbg-collection-app.com` (expose le manifest)
- [x] Projet Android généré via PWABuilder (pwabuilder.com)
- [x] Clé de signature générée — `signing.keystore` (package `com.mesbg_collection_app.twa`), sauvegardée par l'utilisateur hors du repo

### Phase 3 — Vérification du domaine (code, sur `main`)
- [x] `public/.well-known/assetlinks.json` avec le package name Android + l'empreinte SHA256 de la clé
- [x] Accessibilité en prod vérifiée : `https://mesbg-collection-app.com/.well-known/assetlinks.json` répond 200

### Phase 4 — Google Play Console (entièrement hors repo)
- [ ] Compte développeur Google Play (25$, paiement unique)
- [ ] Fiche store : titre, description, icône, captures d'écran, feature graphic
- [ ] Questionnaire de classification du contenu + formulaire "Sécurité des données"
- [ ] Upload AAB signé → piste de test interne → test → production
