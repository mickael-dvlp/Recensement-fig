// ============================================================
// LE PAYS DE DUN — Héros & Guerriers
// ============================================================

const PAYS_DE_DUN = {
  nom: "Le Pays de Dun",

  heros: [
    {
      id: "pdd-h-001",
      nom: "Freca, Seigneur de la Marche de l'Ouest",
      image: "/images/factions/pays-de-dun/pdd-h-001.avif",
      lienHero: "Freca",
    },
    {
      id: "pdd-h-002",
      nom: "Wulf, Grand Seigneur des Tribus des Collines",
      image: "/images/factions/pays-de-dun/pdd-h-002.avif",
      lienHero: "Wulf",
    },

    {
      id: "pdd-h-004",
      nom: "Général Targg",
      image: "/images/factions/pays-de-dun/pdd-h-004.avif",
      lienHero: "Targg",
    },

    {
      id: "pdd-h-006",
      nom: "Seigneur Thorne du Wold",
      image: "/images/factions/pays-de-dun/pdd-h-006.avif",
      lienHero: "Thorne",
    },

    {
      id: "pdd-h-008",
      nom: "Chef des Tribus des Collines (Bouclier Léger)",
      image: "/images/factions/pays-de-dun/pdd-h-008.avif",
    },

    {
      id: "pdd-h-010",
      nom: "Shank",
      image: "/images/factions/pays-de-dun/pdd-h-010.avif",
      lienHero: "Shank",
    },
    {
      id: "pdd-h-011",
      nom: "Wrot",
      image: "/images/factions/pays-de-dun/pdd-h-011.avif",
      lienHero: "Wrot",
    },
    {
      id: "pdd-h-012",
      nom: "Troll des Neiges",
      image: "/images/factions/pays-de-dun/pdd-h-012.avif",
    },
    {
      id: "pdd-h-013",
      nom: "Thrydan, le Fléau des Loups",
      image: "/images/factions/pays-de-dun/pdd-h-013.avif",
      lienHero: "Thrydan le Fléau des Loups",
    },

    {
      id: "pdd-h-014",
      nom: "Chef du Pays de Dun",
      image: "/images/factions/pays-de-dun/pdd-h-014.avif",
    },
    {
      id: "pdd-h-015",
      nom: "Le Prêteur de Serment",
      image: "/images/factions/pays-de-dun/pdd-h-015.avif",
      lienHero: "Le Preteur de Serment",
    },
    {
      id: "pdd-h-016",
      nom: "Gorûlf Peau-De-Fer",
      image: "/images/factions/pays-de-dun/pdd-h-016.avif",
      lienHero: "Gorulf",
    },
    {
      id: "pdd-h-017",
      nom: "Frida Longuelance",
      image: "/images/factions/pays-de-dun/pdd-h-017.avif",
      lienHero: "Frida Longuelance",
    },
  ],

  guerriers: [
    {
      id: "pdd-g-001",
      inventaireId: "roh-g-003",
      nom: "Traître Rohirrim (Cor de Guerre)",
      image: "/images/factions/pays-de-dun/pdd-g-001.avif",
      // Même figurine que "Guerrier du Rohan (Cor de Guerre + Bouclier + Javelot)" dans
      // rohan.js (roh-g-003, propriétaire).
      variantesDetaillees: [
        {
          id: "roh-g-003-m1",
          nom: "Modèle 1",
          image: "/images/factions/pays-de-dun/approfondi/roh-g-003-m1.avif",
          matiere: null,
        },
        {
          id: "roh-g-003-m2",
          nom: "Modèle 2",
          image: "/images/factions/pays-de-dun/approfondi/roh-g-003-m2.avif",
          matiere: null,
        },
      ],
    },
    {
      id: "pdd-g-002",
      inventaireId: "roh-g-004",
      nom: "Traître Rohirrim (Bannière)",
      image: "/images/factions/pays-de-dun/pdd-g-002.avif",
      // Même figurine que "Guerrier du Rohan 1 (Bannière)" dans rohan.js (roh-g-004,
      // propriétaire).
      variantesDetaillees: [
        {
          id: "roh-g-004-m1",
          nom: "Modèle 1",
          image: "/images/factions/pays-de-dun/approfondi/roh-g-004-m1.avif",
          matiere: null,
        },
        {
          id: "roh-g-004-m2",
          nom: "Modèle 2",
          image: "/images/factions/pays-de-dun/approfondi/roh-g-004-m2.avif",
          matiere: null,
        },
        {
          id: "roh-g-004-m3",
          nom: "Modèle 3",
          image: "/images/factions/pays-de-dun/approfondi/roh-g-004-m3.avif",
          matiere: null,
        },
        {
          id: "roh-g-004-m4",
          nom: "Modèle 4",
          image: "/images/factions/pays-de-dun/approfondi/roh-g-004-m4.avif",
          matiere: null,
        },
      ],
    },
    {
      id: "pdd-g-003",
      inventaireId: "roh-g-005",
      nom: "Traître Rohirrim (Bouclier et Javelot)",
      image: "/images/factions/pays-de-dun/pdd-g-003.avif",
      // Même figurine que "Guerrier du Rohan (Bouclier + Javelot)" dans rohan.js
      // (roh-g-005, propriétaire).
      variantesDetaillees: [
        {
          id: "roh-g-005-m1",
          nom: "Modèle 1",
          image: "/images/factions/pays-de-dun/approfondi/roh-g-005-m1.avif",
          matiere: null,
        },
        {
          id: "roh-g-005-m2",
          nom: "Modèle 2",
          image: "/images/factions/pays-de-dun/approfondi/roh-g-005-m2.avif",
          matiere: null,
        },
        {
          id: "roh-g-005-m3",
          nom: "Modèle 3",
          image: "/images/factions/pays-de-dun/approfondi/roh-g-005-m3.avif",
          matiere: null,
        },
        {
          id: "roh-g-005-m4",
          nom: "Modèle 4",
          image: "/images/factions/pays-de-dun/approfondi/roh-g-005-m4.avif",
          matiere: null,
        },
        {
          id: "roh-g-005-m5",
          nom: "Modèle 5",
          image: "/images/factions/pays-de-dun/approfondi/roh-g-005-m5.avif",
          matiere: null,
        },
        {
          id: "roh-g-005-m6",
          nom: "Modèle 6",
          image: "/images/factions/pays-de-dun/approfondi/roh-g-005-m6.avif",
          matiere: null,
        },
        {
          id: "roh-g-005-m7",
          nom: "Modèle 7",
          image: "/images/factions/pays-de-dun/approfondi/roh-g-005-m7.avif",
          matiere: null,
        },
        {
          id: "roh-g-005-m8",
          nom: "Modèle 8",
          image: "/images/factions/pays-de-dun/approfondi/roh-g-005-m8.avif",
          matiere: null,
        },
      ],
    },
    {
      id: "pdd-g-004",
      inventaireId: "roh-g-006",
      nom: "Traître Rohirrim (Arc)",
      image: "/images/factions/pays-de-dun/pdd-g-004.avif",
      // Même figurine que "Guerrier du Rohan (Arc)" dans rohan.js (roh-g-006, propriétaire).
      variantesDetaillees: [
        {
          id: "roh-g-006-m1",
          nom: "Modèle 1",
          image: "/images/factions/pays-de-dun/approfondi/roh-g-006-m1.avif",
          matiere: null,
        },
        {
          id: "roh-g-006-m2",
          nom: "Modèle 2",
          image: "/images/factions/pays-de-dun/approfondi/roh-g-006-m2.avif",
          matiere: null,
        },
        {
          id: "roh-g-006-m3",
          nom: "Modèle 3",
          image: "/images/factions/pays-de-dun/approfondi/roh-g-006-m3.avif",
          matiere: null,
        },
        {
          id: "roh-g-006-m4",
          nom: "Modèle 4",
          image: "/images/factions/pays-de-dun/approfondi/roh-g-006-m4.avif",
          matiere: null,
        },
        {
          id: "roh-g-006-m5",
          nom: "Modèle 5",
          image: "/images/factions/pays-de-dun/approfondi/roh-g-006-m5.avif",
          matiere: null,
        },
        {
          id: "roh-g-006-m6",
          nom: "Modèle 6",
          image: "/images/factions/pays-de-dun/approfondi/roh-g-006-m6.avif",
          matiere: null,
        },
        {
          id: "roh-g-006-m7",
          nom: "Modèle 7",
          image: "/images/factions/pays-de-dun/approfondi/roh-g-006-m7.avif",
          matiere: null,
        },
        {
          id: "roh-g-006-m8",
          nom: "Modèle 8",
          image: "/images/factions/pays-de-dun/approfondi/roh-g-006-m8.avif",
          matiere: null,
        },
      ],
    },
    {
      id: "pdd-g-005",
      inventaireId: "roh-g-007",
      nom: "Traître Rohirrim (Bouclier)",
      image: "/images/factions/pays-de-dun/pdd-g-005.avif",
      // Même figurine que "Guerrier du Rohan (Bouclier)" dans rohan.js (roh-g-007,
      // propriétaire).
      variantesDetaillees: [
        {
          id: "roh-g-007-m1",
          nom: "Modèle 1",
          image: "/images/factions/pays-de-dun/approfondi/roh-g-007-m1.avif",
          matiere: null,
        },
        {
          id: "roh-g-007-m2",
          nom: "Modèle 2",
          image: "/images/factions/pays-de-dun/approfondi/roh-g-007-m2.avif",
          matiere: null,
        },
        {
          id: "roh-g-007-m3",
          nom: "Modèle 3",
          image: "/images/factions/pays-de-dun/approfondi/roh-g-007-m3.avif",
          matiere: null,
        },
        {
          id: "roh-g-007-m4",
          nom: "Modèle 4",
          image: "/images/factions/pays-de-dun/approfondi/roh-g-007-m4.avif",
          matiere: null,
        },
        {
          id: "roh-g-007-m5",
          nom: "Modèle 5",
          image: "/images/factions/pays-de-dun/approfondi/roh-g-007-m5.avif",
          matiere: null,
        },
        {
          id: "roh-g-007-m6",
          nom: "Modèle 6",
          image: "/images/factions/pays-de-dun/approfondi/roh-g-007-m6.avif",
          matiere: null,
        },
        {
          id: "roh-g-007-m7",
          nom: "Modèle 7",
          image: "/images/factions/pays-de-dun/approfondi/roh-g-007-m7.avif",
          matiere: null,
        },
        {
          id: "roh-g-007-m8",
          nom: "Modèle 8",
          image: "/images/factions/pays-de-dun/approfondi/roh-g-007-m8.avif",
          matiere: null,
        },
      ],
    },
    {
      id: "pdd-g-006",
      nom: "Homme des Collines (Bannière 1)",
      image: "/images/factions/pays-de-dun/pdd-g-006.avif",
    },
    {
      id: "pdd-g-025",
      nom: "Homme des Collines (Bannière 2)",
      image: "/images/factions/pays-de-dun/pdd-g-025.avif",
    },
    {
      id: "pdd-g-020",
      nom: "Homme des Collines",
      image: "/images/factions/pays-de-dun/pdd-g-020.avif",
      variantesDetaillees: [
        {
          id: "pdd-g-020-m1",
          nom: "Modèle 1",
          image: "/images/factions/pays-de-dun/approfondi/pdd-g-020-m1.avif",
          matiere: null,
        },
        {
          id: "pdd-g-020-m2",
          nom: "Modèle 2",
          image: "/images/factions/pays-de-dun/approfondi/pdd-g-020-m2.avif",
          matiere: null,
        },
      ],
    },
    {
      id: "pdd-g-007",
      nom: "Homme des Collines (Bouclier Léger et Flambeau)",
      image: "/images/factions/pays-de-dun/pdd-g-007.avif",
      variantesDetaillees: [
        {
          id: "pdd-g-007-m1",
          nom: "Modèle 1",
          image: "/images/factions/pays-de-dun/approfondi/pdd-g-007-m1.avif",
          matiere: null,
        },
      ],
    },
    {
      id: "pdd-g-008",
      nom: "Homme des Collines (Bouclier Léger)",
      image: "/images/factions/pays-de-dun/pdd-g-008.avif",
      variantesDetaillees: [
        {
          id: "pdd-g-008-m1",
          nom: "Modèle 1",
          image: "/images/factions/pays-de-dun/approfondi/pdd-g-008-m1.avif",
          matiere: null,
        },
        {
          id: "pdd-g-008-m2",
          nom: "Modèle 2",
          image: "/images/factions/pays-de-dun/approfondi/pdd-g-008-m2.avif",
          matiere: null,
        },
      ],
    },
    {
      id: "pdd-g-009",
      nom: "Homme des Collines (Flambeau)",
      image: "/images/factions/pays-de-dun/pdd-g-009.avif",
      variantesDetaillees: [
        {
          id: "pdd-g-009-m1",
          nom: "Modèle 1",
          image: "/images/factions/pays-de-dun/approfondi/pdd-g-009-m1.avif",
          matiere: null,
        },
      ],
    },
    {
      id: "pdd-g-010",
      nom: "Homme des Collines (Lance)",
      image: "/images/factions/pays-de-dun/pdd-g-010.avif",
      variantesDetaillees: [
        {
          id: "pdd-g-010-m1",
          nom: "Modèle 1",
          image: "/images/factions/pays-de-dun/approfondi/pdd-g-010-m1.avif",
          matiere: null,
        },
      ],
    },
    {
      id: "pdd-g-011",
      nom: "Homme des Collines (Arme à Deux Mains)",
      image: "/images/factions/pays-de-dun/pdd-g-011.avif",
      variantesDetaillees: [
        {
          id: "pdd-g-011-m1",
          nom: "Modèle 1",
          image: "/images/factions/pays-de-dun/approfondi/pdd-g-011-m1.avif",
          matiere: null,
        },
        {
          id: "pdd-g-011-m2",
          nom: "Modèle 2",
          image: "/images/factions/pays-de-dun/approfondi/pdd-g-011-m2.avif",
          matiere: null,
        },
        {
          id: "pdd-g-011-m3",
          nom: "Modèle 3",
          image: "/images/factions/pays-de-dun/approfondi/pdd-g-011-m3.avif",
          matiere: null,
        },
        {
          id: "pdd-g-011-m4",
          nom: "Modèle 4",
          image: "/images/factions/pays-de-dun/approfondi/pdd-g-011-m4.avif",
          matiere: null,
        },
        {
          id: "pdd-g-011-m5",
          nom: "Modèle 5",
          image: "/images/factions/pays-de-dun/approfondi/pdd-g-011-m5.avif",
          matiere: null,
        },
      ],
    },
    {
      id: "pdd-g-021",
      nom: "Homme des Collines (Arc)",
      image: "/images/factions/pays-de-dun/pdd-g-021.avif",
      variantesDetaillees: [
        {
          id: "pdd-g-021-m1",
          nom: "Modèle 1",
          image: "/images/factions/pays-de-dun/approfondi/pdd-g-021-m1.avif",
          matiere: null,
        },
        {
          id: "pdd-g-021-m2",
          nom: "Modèle 2",
          image: "/images/factions/pays-de-dun/approfondi/pdd-g-021-m2.avif",
          matiere: null,
        },
        {
          id: "pdd-g-021-m3",
          nom: "Modèle 3",
          image: "/images/factions/pays-de-dun/approfondi/pdd-g-021-m3.avif",
          matiere: null,
        },
        {
          id: "pdd-g-021-m4",
          nom: "Modèle 4",
          image: "/images/factions/pays-de-dun/approfondi/pdd-g-021-m4.avif",
          matiere: null,
        },
      ],
    },
    {
      id: "pdd-g-012",
      nom: "Guerrier du Pays de Dun (Bannière)",
      image: "/images/factions/pays-de-dun/pdd-g-012.avif",
    },
    {
      id: "pdd-g-013",
      nom: "Guerrier du Pays de Dun (Arc)",
      image: "/images/factions/pays-de-dun/pdd-g-013.avif",
      variantesDetaillees: [
        {
          id: "pdd-g-013-m1",
          nom: "Modèle 1",
          image: "/images/factions/pays-de-dun/approfondi/pdd-g-013-m1.avif",
          matiere: null,
        },
        {
          id: "pdd-g-013-m2",
          nom: "Modèle 2",
          image: "/images/factions/pays-de-dun/approfondi/pdd-g-013-m2.avif",
          matiere: null,
        },
      ],
    },
    {
      id: "pdd-g-014",
      nom: "Guerrier du Pays de Dun (Bouclier)",
      image: "/images/factions/pays-de-dun/pdd-g-014.avif",
      variantesDetaillees: [
        {
          id: "pdd-g-014-m1",
          nom: "Modèle 1",
          image: "/images/factions/pays-de-dun/approfondi/pdd-g-014-m1.avif",
          matiere: null,
        },
        {
          id: "pdd-g-014-m2",
          nom: "Modèle 2",
          image: "/images/factions/pays-de-dun/approfondi/pdd-g-014-m2.avif",
          matiere: null,
        },
      ],
    },
    {
      id: "pdd-g-015",
      nom: "Guerrier du Pays de Dun (Arme à Deux Mains)",
      image: "/images/factions/pays-de-dun/pdd-g-015.avif",
      variantesDetaillees: [
        {
          id: "pdd-g-015-m1",
          nom: "Modèle 1",
          image: "/images/factions/pays-de-dun/approfondi/pdd-g-015-m1.avif",
          matiere: null,
        },
        {
          id: "pdd-g-015-m2",
          nom: "Modèle 2",
          image: "/images/factions/pays-de-dun/approfondi/pdd-g-015-m2.avif",
          matiere: null,
        },
      ],
    },
    {
      id: "pdd-g-016",
      nom: "Cavalier du Pays de Dun",
      image: "/images/factions/pays-de-dun/pdd-g-016.avif",
      variantesDetaillees: [
        {
          id: "pdd-g-016-m1",
          nom: "Modèle 1",
          image: "/images/factions/pays-de-dun/approfondi/pdd-g-016-m1.avif",
          matiere: null,
        },
        {
          id: "pdd-g-016-m2",
          nom: "Modèle 2",
          image: "/images/factions/pays-de-dun/approfondi/pdd-g-016-m2.avif",
          matiere: null,
        },
      ],
    },
    {
      id: "pdd-g-017",
      nom: "Huscarl du Pays de Dun",
      image: "/images/factions/pays-de-dun/pdd-g-017.avif",
      variantesDetaillees: [
        {
          id: "pdd-g-017-m1",
          nom: "Modèle 1",
          image: "/images/factions/pays-de-dun/approfondi/pdd-g-017-m1.avif",
          matiere: null,
        },
        {
          id: "pdd-g-017-m2",
          nom: "Modèle 2",
          image: "/images/factions/pays-de-dun/approfondi/pdd-g-017-m2.avif",
          matiere: null,
        },
        {
          id: "pdd-g-017-m3",
          nom: "Modèle 3",
          image: "/images/factions/pays-de-dun/approfondi/pdd-g-017-m3.avif",
          matiere: null,
        },
      ],
    },
    {
      id: "pdd-g-018",
      inventaireId: "ise-g-024",
      nom: "Crébain",
      image: "/images/factions/pays-de-dun/pdd-g-018.avif",
      variantesDetaillees: [
        {
          id: "ise-g-024-m1",
          nom: "Modèle 1",
          image: "/images/factions/pays-de-dun/approfondi/ise-g-024-m1.avif",
          matiere: null,
        },
        {
          id: "ise-g-024-m2",
          nom: "Modèle 2",
          image: "/images/factions/pays-de-dun/approfondi/ise-g-024-m2.avif",
          matiere: null,
        },
      ],
    },
  ],
};

export default PAYS_DE_DUN;
