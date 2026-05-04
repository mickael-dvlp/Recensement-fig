# MESBG — Gestionnaire de Collection

Application web de gestion de collection de figurines pour le jeu **Middle-Earth Strategy Battle Game (MESBG)** de Games Workshop.

---

## Fonctionnalités

- **Inventaire** — Suivre les figurines possédées avec leurs quantités
- **Souhaitées** — Marquer les figurines désirées et leur quantité cible
- **Projets de peinture** — Suivre les figurines en cours de peinture
- **Catalogue de peintures** — Référentiel de couleurs Citadel, Vallejo et Army Painter
- **Tableau de bord** — Vue d'ensemble de la collection par faction (Bien / Mal)
- **Factions** — ~50 factions organisées par camp et par thème, avec héros et guerriers
- **Thème** — Mode sombre / mode clair (parchemin)

---

## Stack technique

| Couche            | Technologie                                   |
| ----------------- | --------------------------------------------- |
| Framework         | Next.js (App Router)                          |
| UI                | React 19 + Tailwind CSS 4                     |
| Base de données   | Firebase Firestore                            |
| Authentification  | Firebase Auth (email/password + Google OAuth) |
| Icônes            | Lucide React                                  |
| Police décorative | Uncial Antiqua (Google Fonts)                 |

---

## Structure du projet

```
app/
  (auth)/
    connexion/          Page de connexion
    inscription/        Page d'inscription
  (main)/
    accueil/            Tableau de bord — stats globales et par faction
    figurines/          Inventaire & souhaitées, navigation par faction
      [faction]/        Page détail d'une faction (héros + guerriers)
    peinture/           Catalogue de couleurs (Citadel, Vallejo, Army Painter)
    projet/             Figurines en cours de peinture
    profil/             Paramètres utilisateur, thème, déconnexion

components/
  figurines/            Cartes, filtres, modales liés aux figurines
  navigation/           Barre de navigation bas de page
  ui/                   Composants génériques (SearchBar…)

data/
  factions/             Données statiques des ~50 factions (héros + guerriers)
  figurines/            Listes des factions (Bien / Mal) et des héros individuels
  peintures/            Catalogues JSON des 3 marques de peinture

lib/
  firebase.js           Initialisation Firebase
  firestore.js          Fonctions CRUD Firestore
  auth-context.jsx      Contexte React — état d'authentification
  theme-context.jsx     Contexte React — thème clair/sombre
```

---

## Lancer le projet

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Build de production
npm run build
npm start
```

## Factions disponibles

### Camp du Bien

| Thème                     | Factions                                                                        |
| ------------------------- | ------------------------------------------------------------------------------- |
| Les Compagnies Héroïques  | La Communauté de l'Anneau, La Compagnie de Thorin, Le Conseil Blanc             |
| Les Contrées Oubliées     | La Comté, L'Eriador, Fangorn, Les Monts Brumeux, Le Carrock, Drúadan, Dunharrow |
| Les Royaumes des Hommes   | Númenor, L'Arnor, Le Gondor, Les Fiefs du Gondor, Le Rohan, Dale, Lacville      |
| Les Enclaves Elfiques     | Fondcombe, La Lothlórien, La Forêt Noire                                        |
| Les Forteresses des Nains | Khazad-dûm, Les Monts de Fer, Erebor, Erebor Reconquis, Erebor Restauré         |

### Camp du Mal

Angmar, Barad-Dûr, Brigands de Sharcoûx, Carn-Dûm, Les Chasseurs d'Azog, Les Corsaires d'Umbar, Dol Guldur, Extrême-Harad, Goblinville, Horde Serpent, Isengard, Khand, La Légion d'Azog, La Moria, Mordor, Orientaux, Les Sinistres Habitants de la Forêt Noire, Smaug, Troll des Montagnes
