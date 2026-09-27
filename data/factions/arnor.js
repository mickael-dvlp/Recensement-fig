// ============================================================
// L'ARNOR — Héros & Guerriers
// ============================================================

const L_ARNOR = {
  nom: "L'Arnor",

  heros: [
    {
      id: "arn-h-001",
      nom: "Arvedui, Dernier Roi d'Arnor",
      image: "/images/factions/arnor/arn-h-001.avif",
      lienHero: "Arvedul",
    },
    {
      id: "arn-h-002",
      nom: "Aranarth, Premier Chef des Dúnedain",
      image: "/images/factions/arnor/arn-h-002.avif",
      lienHero: "Aranarth",
    },
    {
      id: "arn-h-003",
      nom: "Malbeth le Voyant",
      image: "/images/factions/arnor/arn-h-003.avif",
      lienHero: "Malbeth",
    },
    {
      id: "arn-h-004",
      nom: "Argadir, Capitaine d'Arnor",
      image: "/images/factions/arnor/arn-h-004.avif",
      lienHero: "Argadir",
    },
    {
      id: "arn-h-005",
      nom: "Roi des Hommes",
      image: "/images/factions/arnor/arn-h-005.avif",
      lienHero: "Roi des Hommes",
    },
    {
      id: "arn-h-008",
      nom: "Capitaine d'Arnor",
      image: "/images/factions/arnor/arn-h-008.avif",
    },
  ],

  guerriers: [
    {
      id: "arn-g-001",
      nom: "Guerrier d'Arnor",
      image: "/images/factions/arnor/arn-g-001.avif",
      variantesDetaillees: [
        { id: "arn-g-001-m1", nom: "Modèle 1", image: "/images/factions/arnor/approfondi/arn-g-001-m1.avif", matiere: null },
        { id: "arn-g-001-m2", nom: "Modèle 2", image: "/images/factions/arnor/approfondi/arn-g-001-m2.avif", matiere: null },
        { id: "arn-g-001-m3", nom: "Modèle 3", image: "/images/factions/arnor/approfondi/arn-g-001-m3.avif", matiere: null },
      ],
    },
    {
      id: "arn-g-002",
      nom: "Guerrier d'Arnor (Bannière)",
      image: "/images/factions/arnor/arn-g-002.avif",
    },
    {
      id: "arn-g-003",
      nom: "Chevalier d'Arnor",
      image: "/images/factions/arnor/arn-g-003.avif",
      variantesDetaillees: [
        { id: "arn-g-003-m1", nom: "Modèle 1", image: "/images/factions/arnor/approfondi/arn-g-003-m1.avif", matiere: null },
        { id: "arn-g-003-m2", nom: "Modèle 2", image: "/images/factions/arnor/approfondi/arn-g-003-m2.avif", matiere: null },
      ],
    },
    {
      id: "arn-g-004",
      inventaireId: "gon-g-008",
      nom: "Ranger d'Arnor",
      image: "/images/factions/arnor/arn-g-004.avif",
      // Même figurine que "Ranger du Gondor" dans gondor.js (gon-g-008, propriétaire —
      // Fiefs du Gondor pointe déjà vers lui) — mêmes id de variantes.
      variantesDetaillees: [
        { id: "gon-g-008-m1", nom: "Modèle 1", image: "/images/factions/arnor/approfondi/gon-g-008-m1.avif", matiere: null },
        { id: "gon-g-008-m2", nom: "Modèle 2", image: "/images/factions/arnor/approfondi/gon-g-008-m2.avif", matiere: null },
        { id: "gon-g-008-m3", nom: "Modèle 3", image: "/images/factions/arnor/approfondi/gon-g-008-m3.avif", matiere: null },
        { id: "gon-g-008-m4", nom: "Modèle 4", image: "/images/factions/arnor/approfondi/gon-g-008-m4.avif", matiere: null },
        { id: "gon-g-008-m5", nom: "Modèle 5", image: "/images/factions/arnor/approfondi/gon-g-008-m5.avif", matiere: null },
        { id: "gon-g-008-m6", nom: "Modèle 6", image: "/images/factions/arnor/approfondi/gon-g-008-m6.avif", matiere: null },
        { id: "gon-g-008-m7", nom: "Modèle 7", image: "/images/factions/arnor/approfondi/gon-g-008-m7.avif", matiere: null },
        { id: "gon-g-008-m8", nom: "Modèle 8", image: "/images/factions/arnor/approfondi/gon-g-008-m8.avif", matiere: null },
        { id: "gon-g-008-m9", nom: "Modèle 9", image: "/images/factions/arnor/approfondi/gon-g-008-m9.avif", matiere: null },
        { id: "gon-g-008-m10", nom: "Modèle 10", image: "/images/factions/arnor/approfondi/gon-g-008-m10.avif", matiere: null },
        { id: "gon-g-008-m11", nom: "Modèle 11", image: "/images/factions/arnor/approfondi/gon-g-008-m11.avif", matiere: null },
        { id: "gon-g-008-m12", nom: "Modèle 12", image: "/images/factions/arnor/approfondi/gon-g-008-m12.avif", matiere: null },
      ],
    },
    {
      id: "arn-g-005",
      inventaireId: "gon-g-010",
      nom: "Ranger d'Arnor (Cor de Guerre)",
      image: "/images/factions/arnor/arn-g-005.avif",
    },
    {
      id: "arn-g-006",
      inventaireId: "gon-g-009",
      nom: "Ranger d'Arnor (Bannière)",
      image: "/images/factions/arnor/arn-g-006.avif",
    },
    {
      id: "arn-g-007",
      inventaireId: "gon-g-011",
      nom: "Ranger d'Arnor (Lance)",
      image: "/images/factions/arnor/arn-g-007.avif",
      variantesDetaillees: [
        { id: "gon-g-011-m1", nom: "Modèle 1", image: "/images/factions/arnor/approfondi/gon-g-011-m1.avif", matiere: null },
        { id: "gon-g-011-m2", nom: "Modèle 2", image: "/images/factions/arnor/approfondi/gon-g-011-m2.avif", matiere: null },
        { id: "gon-g-011-m3", nom: "Modèle 3", image: "/images/factions/arnor/approfondi/gon-g-011-m3.avif", matiere: null },
        { id: "gon-g-011-m4", nom: "Modèle 4", image: "/images/factions/arnor/approfondi/gon-g-011-m4.avif", matiere: null },
      ],
    },
  ],
};

export default L_ARNOR;
