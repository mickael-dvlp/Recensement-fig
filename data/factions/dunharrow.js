// ============================================================
// DUNHARROW — Héros & Guerriers
// ============================================================

const DUNHARROW = {
  nom: "Dunharrow",

  heros: [
    { id: "dun-h-001", nom: "Le Roi des Morts", image: "/images/factions/dunharrow/dun-h-001.avif", lienHero: "Le Roi des Morts" },
    {
      id: "dun-h-002",
      nom: "Héraut des Morts",
      image: "/images/factions/dunharrow/dun-h-002.avif",
      variantesDetaillees: [
        { id: "dun-h-002-m1", nom: "Modèle 1", image: "/images/factions/dunharrow/approfondi/dun-h-002-m1.avif", matiere: null },
        { id: "dun-h-002-m2", nom: "Modèle 2", image: "/images/factions/dunharrow/approfondi/dun-h-002-m2.avif", matiere: null },
      ],
    },
    {
      id: "dun-h-003",
      nom: "Héraut des Morts Translucide",
      image: "/images/factions/dunharrow/dun-h-003.avif",
      variantesDetaillees: [
        { id: "dun-h-003-m1", nom: "Modèle 1", image: "/images/factions/dunharrow/approfondi/dun-h-003-m1.avif", matiere: null },
        { id: "dun-h-003-m2", nom: "Modèle 2", image: "/images/factions/dunharrow/approfondi/dun-h-003-m2.avif", matiere: null },
      ],
    },
  ],

  guerriers: [
    {
      id: "dun-g-001",
      nom: "Guerrier des Morts",
      image: "/images/factions/dunharrow/dun-g-001.avif",
      variantesDetaillees: [
        { id: "dun-g-001-m1", nom: "Modèle 1", image: "/images/factions/dunharrow/approfondi/dun-g-001-m1.avif", matiere: null },
        { id: "dun-g-001-m2", nom: "Modèle 2", image: "/images/factions/dunharrow/approfondi/dun-g-001-m2.avif", matiere: null },
        { id: "dun-g-001-m3", nom: "Modèle 3", image: "/images/factions/dunharrow/approfondi/dun-g-001-m3.avif", matiere: null },
      ],
    },
    {
      id: "dun-g-002",
      nom: "Guerrier des Morts (Bouclier)",
      image: "/images/factions/dunharrow/dun-g-002.avif",
      variantesDetaillees: [
        { id: "dun-g-002-m1", nom: "Modèle 1", image: "/images/factions/dunharrow/approfondi/dun-g-002-m1.avif", matiere: null },
        { id: "dun-g-002-m2", nom: "Modèle 2", image: "/images/factions/dunharrow/approfondi/dun-g-002-m2.avif", matiere: null },
        { id: "dun-g-002-m3", nom: "Modèle 3", image: "/images/factions/dunharrow/approfondi/dun-g-002-m3.avif", matiere: null },
        { id: "dun-g-002-m4", nom: "Modèle 4", image: "/images/factions/dunharrow/approfondi/dun-g-002-m4.avif", matiere: null },
        { id: "dun-g-002-m5", nom: "Modèle 5", image: "/images/factions/dunharrow/approfondi/dun-g-002-m5.avif", matiere: null },
        { id: "dun-g-002-m6", nom: "Modèle 6", image: "/images/factions/dunharrow/approfondi/dun-g-002-m6.avif", matiere: null },
        { id: "dun-g-002-m7", nom: "Modèle 7", image: "/images/factions/dunharrow/approfondi/dun-g-002-m7.avif", matiere: null },
        { id: "dun-g-002-m8", nom: "Modèle 8", image: "/images/factions/dunharrow/approfondi/dun-g-002-m8.avif", matiere: null },
      ],
    },
    { id: "dun-g-003", nom: "Guerrier des Morts (Bannière)",        image: "/images/factions/dunharrow/dun-g-003.avif" },
    {
      id: "dun-g-004",
      nom: "Guerrier des Morts (Lance + Bouclier)",
      image: "/images/factions/dunharrow/dun-g-004.avif",
      variantesDetaillees: [
        { id: "dun-g-004-m1", nom: "Modèle 1", image: "/images/factions/dunharrow/approfondi/dun-g-004-m1.avif", matiere: null },
      ],
    },
    {
      id: "dun-g-005",
      nom: "Guerrier des Morts (Lance)",
      image: "/images/factions/dunharrow/dun-g-005.avif",
      variantesDetaillees: [
        { id: "dun-g-005-m1", nom: "Modèle 1", image: "/images/factions/dunharrow/approfondi/dun-g-005-m1.avif", matiere: null },
        { id: "dun-g-005-m2", nom: "Modèle 2", image: "/images/factions/dunharrow/approfondi/dun-g-005-m2.avif", matiere: null },
        { id: "dun-g-005-m3", nom: "Modèle 3", image: "/images/factions/dunharrow/approfondi/dun-g-005-m3.avif", matiere: null },
        { id: "dun-g-005-m4", nom: "Modèle 4", image: "/images/factions/dunharrow/approfondi/dun-g-005-m4.avif", matiere: null },
      ],
    },
    {
      id: "dun-g-006",
      nom: "Cavalier des Morts",
      image: "/images/factions/dunharrow/dun-g-006.avif",
      variantesDetaillees: [
        { id: "dun-g-006-m1", nom: "Modèle 1", image: "/images/factions/dunharrow/approfondi/dun-g-006-m1.avif", matiere: null },
        { id: "dun-g-006-m2", nom: "Modèle 2", image: "/images/factions/dunharrow/approfondi/dun-g-006-m2.avif", matiere: null },
      ],
    },
    {
      id: "dun-g-007",
      nom: "Guerrier des Morts Translucide",
      image: "/images/factions/dunharrow/dun-g-007.avif",
      variantesDetaillees: [
        { id: "dun-g-007-m1", nom: "Modèle 1", image: "/images/factions/dunharrow/approfondi/dun-g-007-m1.avif", matiere: null },
        { id: "dun-g-007-m2", nom: "Modèle 2", image: "/images/factions/dunharrow/approfondi/dun-g-007-m2.avif", matiere: null },
        { id: "dun-g-007-m3", nom: "Modèle 3", image: "/images/factions/dunharrow/approfondi/dun-g-007-m3.avif", matiere: null },
        { id: "dun-g-007-m4", nom: "Modèle 4", image: "/images/factions/dunharrow/approfondi/dun-g-007-m4.avif", matiere: null },
      ],
    },
    {
      id: "dun-g-008",
      nom: "Guerrier des Morts Translucide (Bouclier)",
      image: "/images/factions/dunharrow/dun-g-008.avif",
      variantesDetaillees: [
        { id: "dun-g-008-m1", nom: "Modèle 1", image: "/images/factions/dunharrow/approfondi/dun-g-008-m1.avif", matiere: null },
        { id: "dun-g-008-m2", nom: "Modèle 2", image: "/images/factions/dunharrow/approfondi/dun-g-008-m2.avif", matiere: null },
        { id: "dun-g-008-m3", nom: "Modèle 3", image: "/images/factions/dunharrow/approfondi/dun-g-008-m3.avif", matiere: null },
      ],
    },
    {
      id: "dun-g-009",
      nom: "Guerrier des Morts Translucide (Lance + Bouclier)",
      image: "/images/factions/dunharrow/dun-g-009.avif",
      variantesDetaillees: [
        { id: "dun-g-009-m1", nom: "Modèle 1", image: "/images/factions/dunharrow/approfondi/dun-g-009-m1.avif", matiere: null },
      ],
    },
    {
      id: "dun-g-010",
      nom: "Guerrier des Morts Translucide (Lance)",
      image: "/images/factions/dunharrow/dun-g-010.avif",
      variantesDetaillees: [
        { id: "dun-g-010-m1", nom: "Modèle 1", image: "/images/factions/dunharrow/approfondi/dun-g-010-m1.avif", matiere: null },
        { id: "dun-g-010-m2", nom: "Modèle 2", image: "/images/factions/dunharrow/approfondi/dun-g-010-m2.avif", matiere: null },
      ],
    },
  ],
};

export default DUNHARROW;
