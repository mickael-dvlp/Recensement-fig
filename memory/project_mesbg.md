---
name: Projet App MESBG
description: Application mobile de gestion de figurines Middle-Earth Strategy Battle Game
type: project
---

Application Next.js + Tailwind + Firebase pour gérer une collection de figurines MESBG.

**Why:** L'utilisateur a plus de 1200 figurines à recenser et veut suivre son inventaire, sa liste de souhaits et ses projets de peinture.

**How to apply:** Garder en tête la volumétrie (350+ figurines statiques à ajouter progressivement), la priorité mobile-first, et le thème visuel noir/or Games Workshop.

## Stack technique
- Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- Firebase Auth + Firestore + Storage
- Lucide React (icônes), clsx (classes conditionnelles)

## Structure des données
- `data/figurines.json` : liste statique des figurines (id, nom, faction, image)
- `data/peintures/citadel.json` + `vallejo.json` + `army-painter.json` : catalogue peintures
- Firestore : `utilisateurs/{uid}` (profil) + `utilisateurs/{uid}/inventaire/{figurineId}` (état par figurine)

## Factions actuelles
Homme, Elfe, Nain, Autre — d'autres factions seront ajoutées plus tard.

## Pages
- `/connexion` et `/inscription` : auth Firebase
- `/accueil` : stats globales (possédées, souhaitées, en projet, par faction)
- `/figurines` : liste complète avec filtres (Tout/Inventaire/Souhaitée), recherche, tri, filtre faction
- `/projet` : figurines marquées "enProjet" (en cours de peinture)
- `/peinture` : catalogue peintures filtrable par marque/gamme/recherche
- `/profil` : infos compte + déconnexion

## À faire (roadmap utilisateur)
- Remplir les 350+ figurines dans figurines.json
- Ajouter les vraies images dans /public/figurines/
- Ajouter toutes les factions MESBG dans types.ts
- Option langue FR/EN dans le profil
- Rapports de bataille sur l'accueil
- Bouton "Ajouter au projet" directement depuis la carte figurine
