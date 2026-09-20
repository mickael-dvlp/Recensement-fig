// ============================================================
// FIEFS DU GONDOR — Héros & Guerriers
// ============================================================

const FIEFS_DU_GONDOR = {
  nom: "Les Fiefs du Gondor",

  heros: [
    {
      id: "fdg-h-007",
      nom: "Prince Imrahil",
      image: "/images/factions/fiefs-du-gondor/fdg-h-007.avif",
      lienHero: "Imrahil",
    },
    {
      id: "fdg-h-001",
      nom: "Angbor",
      image: "/images/factions/fiefs-du-gondor/fdg-h-001.avif",
      lienHero: "Angbor",
    },

    {
      id: "fdg-h-004",
      nom: "Duinhir",
      image: "/images/factions/fiefs-du-gondor/fdg-h-004.avif",
      lienHero: "Duinhir",
    },
    {
      id: "fdg-h-005",
      nom: "Forlong le Gros",
      image: "/images/factions/fiefs-du-gondor/fdg-h-005.avif",
      lienHero: "Forlong",
    },
    {
      id: "fdg-h-002",
      nom: "Capitaine de Dol Amroth (Monté + Lance de Cavalerie + Bouclier)",
      image: "/images/factions/fiefs-du-gondor/fdg-h-002.avif",
    },
    {
      id: "fdg-h-003",
      nom: "Capitaine de Dol Amroth (Pied)",
      image: "/images/factions/fiefs-du-gondor/fdg-h-003.avif",
    },
  ],

  guerriers: [
    {
      id: "fdg-g-012",
      inventaireId: "gon-g-008",
      nom: "Archer de la Racine Noire",
      image: "/images/factions/fiefs-du-gondor/fdg-g-012.avif",
      // Même figurine que "Ranger du Gondor" (gon-g-008, propriétaire) et "Ranger d'Arnor".
      variantesDetaillees: [
        {
          id: "gon-g-008-m1",
          nom: "Modèle 1",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/gon-g-008-m1.avif",
          matiere: null,
        },
        {
          id: "gon-g-008-m2",
          nom: "Modèle 2",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/gon-g-008-m2.avif",
          matiere: null,
        },
        {
          id: "gon-g-008-m3",
          nom: "Modèle 3",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/gon-g-008-m3.avif",
          matiere: null,
        },
        {
          id: "gon-g-008-m4",
          nom: "Modèle 4",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/gon-g-008-m4.avif",
          matiere: null,
        },
        {
          id: "gon-g-008-m5",
          nom: "Modèle 5",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/gon-g-008-m5.avif",
          matiere: null,
        },
        {
          id: "gon-g-008-m6",
          nom: "Modèle 6",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/gon-g-008-m6.avif",
          matiere: null,
        },
        {
          id: "gon-g-008-m7",
          nom: "Modèle 7",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/gon-g-008-m7.avif",
          matiere: null,
        },
        {
          id: "gon-g-008-m8",
          nom: "Modèle 8",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/gon-g-008-m8.avif",
          matiere: null,
        },
        {
          id: "gon-g-008-m9",
          nom: "Modèle 9",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/gon-g-008-m9.avif",
          matiere: null,
        },
        {
          id: "gon-g-008-m10",
          nom: "Modèle 10",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/gon-g-008-m10.avif",
          matiere: null,
        },
        {
          id: "gon-g-008-m11",
          nom: "Modèle 11",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/gon-g-008-m11.avif",
          matiere: null,
        },
        {
          id: "gon-g-008-m12",
          nom: "Modèle 12",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/gon-g-008-m12.avif",
          matiere: null,
        },
      ],
    },
    {
      id: "fdg-g-001",
      inventaireId: "gon-g-009",
      nom: "Archer de la Racine Noire (Bannière)",
      image: "/images/factions/fiefs-du-gondor/fdg-g-001.avif",
    },
    {
      id: "fdg-g-002",
      inventaireId: "gon-g-010",
      nom: "Archer de la Racine Noire (Cor de Guerre)",
      image: "/images/factions/fiefs-du-gondor/fdg-g-002.avif",
    },
    {
      id: "fdg-g-003",
      inventaireId: "gon-g-011",
      nom: "Archer de la Racine Noire (Lance)",
      image: "/images/factions/fiefs-du-gondor/fdg-g-003.avif",
      variantesDetaillees: [
        {
          id: "gon-g-011-m1",
          nom: "Modèle 1",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/gon-g-011-m1.avif",
          matiere: null,
        },
        {
          id: "gon-g-011-m2",
          nom: "Modèle 2",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/gon-g-011-m2.avif",
          matiere: null,
        },
        {
          id: "gon-g-011-m3",
          nom: "Modèle 3",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/gon-g-011-m3.avif",
          matiere: null,
        },
        {
          id: "gon-g-011-m4",
          nom: "Modèle 4",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/gon-g-011-m4.avif",
          matiere: null,
        },
      ],
    },
    {
      id: "fdg-g-004",
      nom: "Chevalier de Dol Amroth (Bannière)",
      image: "/images/factions/fiefs-du-gondor/fdg-g-004.avif",
      variantesDetaillees: [
        {
          id: "fdg-g-004-m1",
          nom: "Modèle 1",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/fdg-g-004-m1.avif",
          matiere: null,
        },
        {
          id: "fdg-g-004-m2",
          nom: "Modèle 2",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/fdg-g-004-m2.avif",
          matiere: null,
        },
      ],
    },
    {
      id: "fdg-g-005",
      nom: "Chevalier de Dol Amroth (Bouclier)",
      image: "/images/factions/fiefs-du-gondor/fdg-g-005.avif",
      variantesDetaillees: [
        {
          id: "fdg-g-005-m1",
          nom: "Modèle 1",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/fdg-g-005-m1.avif",
          matiere: null,
        },
        {
          id: "fdg-g-005-m2",
          nom: "Modèle 2",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/fdg-g-005-m2.avif",
          matiere: null,
        },
        {
          id: "fdg-g-005-m3",
          nom: "Modèle 3",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/fdg-g-005-m3.avif",
          matiere: null,
        },
        {
          id: "fdg-g-005-m4",
          nom: "Modèle 4",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/fdg-g-005-m4.avif",
          matiere: null,
        },
        {
          id: "fdg-g-005-m5",
          nom: "Modèle 5",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/fdg-g-005-m5.avif",
          matiere: null,
        },
        {
          id: "fdg-g-005-m6",
          nom: "Modèle 6",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/fdg-g-005-m6.avif",
          matiere: null,
        },
      ],
    },
    {
      id: "fdg-g-009",
      nom: "Chevalier de Dol Amroth (Cors de Guerre)",
      image: "/images/factions/fiefs-du-gondor/fdg-g-009.avif",
    },
    {
      id: "fdg-g-006",
      nom: "Chevalier de Dol Amroth (Cheval + Bannière)",
      image: "/images/factions/fiefs-du-gondor/fdg-g-006.avif",
      variantesDetaillees: [
        {
          id: "fdg-g-006-m1",
          nom: "Modèle 1",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/fdg-g-006-m1.avif",
          matiere: null,
        },
        {
          id: "fdg-g-006-m2",
          nom: "Modèle 2",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/fdg-g-006-m2.avif",
          matiere: null,
        },
      ],
    },
    {
      id: "fdg-g-007",
      nom: "Chevalier de Dol Amroth (Cheval + Cors de Guerre)",
      image: "/images/factions/fiefs-du-gondor/fdg-g-007.avif",
    },
    {
      id: "fdg-g-008",
      nom: "Chevalier de Dol Amroth (Cheval + Lance de Cavalerie + Bouclier)",
      image: "/images/factions/fiefs-du-gondor/fdg-g-008.avif",
      variantesDetaillees: [
        {
          id: "fdg-g-008-m1",
          nom: "Modèle 1",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/fdg-g-008-m1.avif",
          matiere: null,
        },
        {
          id: "fdg-g-008-m2",
          nom: "Modèle 2",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/fdg-g-008-m2.avif",
          matiere: null,
        },
        {
          id: "fdg-g-008-m3",
          nom: "Modèle 3",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/fdg-g-008-m3.avif",
          matiere: null,
        },
        {
          id: "fdg-g-008-m4",
          nom: "Modèle 4",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/fdg-g-008-m4.avif",
          matiere: null,
        },
        {
          id: "fdg-g-008-m5",
          nom: "Modèle 5",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/fdg-g-008-m5.avif",
          matiere: null,
        },
        {
          id: "fdg-g-008-m6",
          nom: "Modèle 6",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/fdg-g-008-m6.avif",
          matiere: null,
        },
      ],
    },

    {
      id: "fdg-g-010",
      nom: "Guerrier de Lossarnach",
      image: "/images/factions/fiefs-du-gondor/fdg-g-010.avif",
      variantesDetaillees: [
        {
          id: "fdg-g-010-m1",
          nom: "Modèle 1",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/fdg-g-010-m1.avif",
          matiere: null,
        },
        {
          id: "fdg-g-010-m2",
          nom: "Modèle 2",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/fdg-g-010-m2.avif",
          matiere: null,
        },
        {
          id: "fdg-g-010-m3",
          nom: "Modèle 3",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/fdg-g-010-m3.avif",
          matiere: null,
        },
      ],
    },
    {
      id: "fdg-g-011",
      nom: "Guerrier du Lamedon",
      image: "/images/factions/fiefs-du-gondor/fdg-g-011.avif",
      variantesDetaillees: [
        {
          id: "fdg-g-011-m1",
          nom: "Modèle 1",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/fdg-g-011-m1.avif",
          matiere: null,
        },
        {
          id: "fdg-g-011-m2",
          nom: "Modèle 2",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/fdg-g-011-m2.avif",
          matiere: null,
        },
        {
          id: "fdg-g-011-m3",
          nom: "Modèle 3",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/fdg-g-011-m3.avif",
          matiere: null,
        },
      ],
    },

    {
      id: "fdg-g-013",
      nom: "Piquier de Dol Amroth",
      image: "/images/factions/fiefs-du-gondor/fdg-g-013.avif",
      variantesDetaillees: [
        {
          id: "fdg-g-013-m1",
          nom: "Modèle 1",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/fdg-g-013-m1.avif",
          matiere: null,
        },
        {
          id: "fdg-g-013-m2",
          nom: "Modèle 2",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/fdg-g-013-m2.avif",
          matiere: null,
        },
        {
          id: "fdg-g-013-m3",
          nom: "Modèle 3",
          image:
            "/images/factions/fiefs-du-gondor/approfondi/fdg-g-013-m3.avif",
          matiere: null,
        },
      ],
    },
  ],
};

export default FIEFS_DU_GONDOR;
