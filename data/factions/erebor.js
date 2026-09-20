// ============================================================
// EREBOR — Héros & Guerriers
// ============================================================

const EREBOR = {
  nom: "Erebor",

  heros: [
    {
      id: "erb-h-002",
      nom: "Thrór, Roi Sous la Montagne",
      image: "/images/factions/erebor/erb-h-002.avif",
      lienHero: "Thror",
    },
    {
      id: "erb-h-003",
      nom: "Thráin, fils de Thrór",
      image: "/images/factions/erebor/erb-h-003.avif",
      lienHero: "Thrain",
    },
    {
      id: "erb-h-004",
      nom: "Jeune Thorin Écu-de-Chêne",
      image: "/images/factions/erebor/erb-h-004.avif",
      lienHero: "Thorin",
    },
    {
      id: "erb-h-005",
      nom: "Balin le Jeune Nain",
      image: "/images/factions/erebor/erb-h-005.avif",
      lienHero: "Balin",
    },
    {
      id: "erb-h-006",
      nom: "Dwalin le Jeune Nain",
      image: "/images/factions/erebor/erb-h-006.avif",
      lienHero: "Dwalin",
    },
    {
      id: "erb-h-007",
      lienHero: "Roi des Nains",
      nom: "Roi Nain d'Erebor",
      image: "/images/factions/erebor/erb-h-007.avif",
    },
    {
      id: "erb-h-008",
      nom: "Capitaine des Mornes-Martels",
      image: "/images/factions/erebor/erb-h-008.avif",
    },
    {
      id: "erb-h-001",
      nom: "Capitaine d'Erebor",
      image: "/images/factions/erebor/erb-h-001.avif",
    },
  ],

  guerriers: [
    {
      id: "erb-g-001",
      nom: "Morne-Martel",
      image: "/images/factions/erebor/erb-g-001.avif",
      variantesDetaillees: [
        { id: "erb-g-001-m1", nom: "Modèle 1", image: "/images/factions/erebor/approfondi/erb-g-001-m1.avif", matiere: null },
        { id: "erb-g-001-m2", nom: "Modèle 2", image: "/images/factions/erebor/approfondi/erb-g-001-m2.avif", matiere: null },
        { id: "erb-g-001-m3", nom: "Modèle 3", image: "/images/factions/erebor/approfondi/erb-g-001-m3.avif", matiere: null },
        { id: "erb-g-001-m4", nom: "Modèle 4", image: "/images/factions/erebor/approfondi/erb-g-001-m4.avif", matiere: null },
        { id: "erb-g-001-m5", nom: "Modèle 5", image: "/images/factions/erebor/approfondi/erb-g-001-m5.avif", matiere: null },
        { id: "erb-g-001-m6", nom: "Modèle 6", image: "/images/factions/erebor/approfondi/erb-g-001-m6.avif", matiere: null },
        { id: "erb-g-001-m7", nom: "Modèle 7", image: "/images/factions/erebor/approfondi/erb-g-001-m7.avif", matiere: null },
        { id: "erb-g-001-m8", nom: "Modèle 8", image: "/images/factions/erebor/approfondi/erb-g-001-m8.avif", matiere: null },
        { id: "erb-g-001-m9", nom: "Modèle 9", image: "/images/factions/erebor/approfondi/erb-g-001-m9.avif", matiere: null },
      ],
    },
    {
      id: "erb-g-002",
      nom: "Guerrier d'Erebor (Bouclier)",
      image: "/images/factions/erebor/erb-g-002.avif",
      variantesDetaillees: [
        { id: "erb-g-002-m1", nom: "Modèle 1", image: "/images/factions/erebor/approfondi/erb-g-002-m1.avif", matiere: null },
        { id: "erb-g-002-m2", nom: "Modèle 2", image: "/images/factions/erebor/approfondi/erb-g-002-m2.avif", matiere: null },
        { id: "erb-g-002-m3", nom: "Modèle 3", image: "/images/factions/erebor/approfondi/erb-g-002-m3.avif", matiere: null },
        { id: "erb-g-002-m4", nom: "Modèle 4", image: "/images/factions/erebor/approfondi/erb-g-002-m4.avif", matiere: null },
        { id: "erb-g-002-m5", nom: "Modèle 5", image: "/images/factions/erebor/approfondi/erb-g-002-m5.avif", matiere: null },
        { id: "erb-g-002-m6", nom: "Modèle 6", image: "/images/factions/erebor/approfondi/erb-g-002-m6.avif", matiere: null },
      ],
    },
    {
      id: "erb-g-003",
      nom: "Guerrier d'Erebor (Lance)",
      image: "/images/factions/erebor/erb-g-003.avif",
      variantesDetaillees: [
        { id: "erb-g-003-m1", nom: "Modèle 1", image: "/images/factions/erebor/approfondi/erb-g-003-m1.avif", matiere: null },
        { id: "erb-g-003-m2", nom: "Modèle 2", image: "/images/factions/erebor/approfondi/erb-g-003-m2.avif", matiere: null },
        { id: "erb-g-003-m3", nom: "Modèle 3", image: "/images/factions/erebor/approfondi/erb-g-003-m3.avif", matiere: null },
        { id: "erb-g-003-m4", nom: "Modèle 4", image: "/images/factions/erebor/approfondi/erb-g-003-m4.avif", matiere: null },
        { id: "erb-g-003-m5", nom: "Modèle 5", image: "/images/factions/erebor/approfondi/erb-g-003-m5.avif", matiere: null },
        { id: "erb-g-003-m6", nom: "Modèle 6", image: "/images/factions/erebor/approfondi/erb-g-003-m6.avif", matiere: null },
      ],
    },
    {
      id: "erb-g-004",
      nom: "Guerrier d'Erebor (Lance + Bouclier)",
      image: "/images/factions/erebor/erb-g-004.avif",
      // Pas de sculpt distinct connu/visuel officiel pour l'instant — image de remplacement.
      variantesDetaillees: [
        { id: "erb-g-004-m1", nom: "Modèle 1", image: "/images/placeholder-non-officiel.avif", matiere: null },
      ],
    },
  ],
};

export default EREBOR;
