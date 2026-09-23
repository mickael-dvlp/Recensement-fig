// ============================================================
// LA MORIA — Héros & Guerriers
// ============================================================

const MORIA = {
  nom: "La Moria",

  heros: [
    {
      id: "mri-h-001",
      nom: "Le Balrog",
      image: "/images/factions/moria/mri-h-001.avif",
      lienHero: "Le Balrog",
    },
    {
      id: "mri-h-002",
      nom: "Durbûrz, le Roi Gobelin de la Moria",
      image: "/images/factions/moria/mri-h-002.avif",
      lienHero: "Durburz",
    },
    {
      id: "mri-h-003",
      nom: "Grôblog",
      image: "/images/factions/moria/mri-h-003.avif",
      lienHero: "Groblog",
    },
    {
      id: "mri-h-004",
      nom: "Drûzhag le Belluaire",
      image: "/images/factions/moria/mri-h-004.avif",
      lienHero: "Druzhag",
    },
    {
      id: "mri-h-005",
      nom: "Ashrâk",
      image: "/images/factions/moria/mri-h-005.avif",
      lienHero: "Ashrak",
    },
    {
      id: "mri-h-006",
      nom: "Capitaine Gobelin de la Moria",
      image: "/images/factions/moria/mri-h-006.avif",
    },
    {
      id: "mri-h-007",
      nom: "Capitaine Gobelin de la Moria (Bouclier)",
      image: "/images/factions/moria/mri-h-007.avif",
    },
    {
      id: "mri-h-008",
      nom: "Capitaine Gobelin de la Moria (Arc)",
      image: "/images/factions/moria/mri-h-008.avif",
    },
    {
      id: "mri-h-009",
      nom: "Chaman Gobelin de la Moria",
      image: "/images/factions/moria/mri-h-009.avif",
    },
    {
      id: "mri-h-010",
      nom: "Capitaine des Boucliers Noirs de la Moria",
      image: "/images/factions/moria/mri-h-010.avif",
    },
    {
      id: "mri-h-011",
      nom: "Chaman des Boucliers Noirs de la Moria",
      image: "/images/factions/moria/mri-h-011.avif",
    },
    {
      id: "mri-h-012",
      nom: "Dragon",
      image: "/images/factions/moria/mri-h-012.avif",
    },
    {
      id: "mri-h-013",
      nom: "Wyrm des Cavernes",
      image: "/images/factions/moria/mri-h-013.avif",
    },
    {
      id: "mri-h-014",
      nom: "Le Guetteur de l'Eau",
      image: "/images/factions/moria/mri-h-014.avif",
      lienHero: "Le Guetteur de l'Eau",
    },
  ],

  guerriers: [
    {
      id: "mri-g-001",
      nom: "Guerrier Gobelin de la Moria (Bouclier)",
      image: "/images/factions/moria/mri-g-001.avif",
      variantesDetaillees: [
        { id: "mri-g-001-m1", nom: "Modèle 1", image: "/images/factions/moria/approfondi/mri-g-001-m1.avif", matiere: null },
        { id: "mri-g-001-m2", nom: "Modèle 2", image: "/images/factions/moria/approfondi/mri-g-001-m2.avif", matiere: null },
        { id: "mri-g-001-m3", nom: "Modèle 3", image: "/images/factions/moria/approfondi/mri-g-001-m3.avif", matiere: null },
        { id: "mri-g-001-m4", nom: "Modèle 4", image: "/images/factions/moria/approfondi/mri-g-001-m4.avif", matiere: null },
        { id: "mri-g-001-m5", nom: "Modèle 5", image: "/images/factions/moria/approfondi/mri-g-001-m5.avif", matiere: null },
        { id: "mri-g-001-m6", nom: "Modèle 6", image: "/images/factions/moria/approfondi/mri-g-001-m6.avif", matiere: null },
        { id: "mri-g-001-m7", nom: "Modèle 7", image: "/images/factions/moria/approfondi/mri-g-001-m7.avif", matiere: null },
      ],
    },
    {
      id: "mri-g-002",
      nom: "Guerrier Gobelin de la Moria (Arc Orque)",
      image: "/images/factions/moria/mri-g-002.avif",
      variantesDetaillees: [
        { id: "mri-g-002-m1", nom: "Modèle 1", image: "/images/factions/moria/approfondi/mri-g-002-m1.avif", matiere: null },
        { id: "mri-g-002-m2", nom: "Modèle 2", image: "/images/factions/moria/approfondi/mri-g-002-m2.avif", matiere: null },
        { id: "mri-g-002-m3", nom: "Modèle 3", image: "/images/factions/moria/approfondi/mri-g-002-m3.avif", matiere: null },
        { id: "mri-g-002-m4", nom: "Modèle 4", image: "/images/factions/moria/approfondi/mri-g-002-m4.avif", matiere: null },
        { id: "mri-g-002-m5", nom: "Modèle 5", image: "/images/factions/moria/approfondi/mri-g-002-m5.avif", matiere: null },
        { id: "mri-g-002-m6", nom: "Modèle 6", image: "/images/factions/moria/approfondi/mri-g-002-m6.avif", matiere: null },
        { id: "mri-g-002-m7", nom: "Modèle 7", image: "/images/factions/moria/approfondi/mri-g-002-m7.avif", matiere: null },
        { id: "mri-g-002-m8", nom: "Modèle 8", image: "/images/factions/moria/approfondi/mri-g-002-m8.avif", matiere: null },
      ],
    },
    {
      id: "mri-g-003",
      nom: "Guerrier Gobelin de la Moria (Lance)",
      image: "/images/factions/moria/mri-g-003.avif",
      variantesDetaillees: [
        { id: "mri-g-003-m1", nom: "Modèle 1", image: "/images/factions/moria/approfondi/mri-g-003-m1.avif", matiere: null },
        { id: "mri-g-003-m2", nom: "Modèle 2", image: "/images/factions/moria/approfondi/mri-g-003-m2.avif", matiere: null },
        { id: "mri-g-003-m3", nom: "Modèle 3", image: "/images/factions/moria/approfondi/mri-g-003-m3.avif", matiere: null },
        { id: "mri-g-003-m4", nom: "Modèle 4", image: "/images/factions/moria/approfondi/mri-g-003-m4.avif", matiere: null },
        { id: "mri-g-003-m5", nom: "Modèle 5", image: "/images/factions/moria/approfondi/mri-g-003-m5.avif", matiere: null },
      ],
    },
    {
      id: "mri-g-004",
      nom: "Tambour Gobelin de la Moria",
      image: "/images/factions/moria/mri-g-004.avif",
      variantesDetaillees: [
        { id: "mri-g-004-m1", nom: "Modèle 1", image: "/images/factions/moria/approfondi/mri-g-004-m1.avif", matiere: null },
      ],
    },
    {
      id: "mri-g-012",
      nom: "Batteur de Tambour de la Moria",
      image: "/images/factions/moria/mri-g-012.avif",
      variantesDetaillees: [
        { id: "mri-g-012-m1", nom: "Modèle 1", image: "/images/factions/moria/approfondi/mri-g-012-m1.avif", matiere: null },
        { id: "mri-g-012-m2", nom: "Modèle 2", image: "/images/factions/moria/approfondi/mri-g-012-m2.avif", matiere: null },
      ],
    },
    {
      id: "mri-g-005",
      nom: "Maraudeurs Warg",
      image: "/images/factions/moria/mri-g-005.avif",
    },
    {
      id: "mri-g-006",
      nom: "Trolls des Cavernes",
      image: "/images/factions/moria/mri-g-006.avif",
      variantesDetaillees: [
        { id: "mri-g-006-m1", nom: "Modèle 1", image: "/images/factions/moria/approfondi/mri-g-006-m1.avif", matiere: null },
        { id: "mri-g-006-m2", nom: "Modèle 2", image: "/images/factions/moria/approfondi/mri-g-006-m2.avif", matiere: null },
        { id: "mri-g-006-m3", nom: "Modèle 3", image: "/images/factions/moria/approfondi/mri-g-006-m3.avif", matiere: null },
        { id: "mri-g-006-m4", nom: "Modèle 4", image: "/images/factions/moria/approfondi/mri-g-006-m4.avif", matiere: null },
        { id: "mri-g-006-m5", nom: "Modèle 5", image: "/images/factions/moria/approfondi/mri-g-006-m5.avif", matiere: null },
      ],
    },
    {
      id: "mri-g-007",
      nom: "Bouclier Noir de la Moria",
      image: "/images/factions/moria/mri-g-007.avif",
      variantesDetaillees: [
        { id: "mri-g-007-m1", nom: "Modèle 1", image: "/images/factions/moria/approfondi/mri-g-007-m1.avif", matiere: null },
        { id: "mri-g-007-m2", nom: "Modèle 2", image: "/images/factions/moria/approfondi/mri-g-007-m2.avif", matiere: null },
        { id: "mri-g-007-m3", nom: "Modèle 3", image: "/images/factions/moria/approfondi/mri-g-007-m3.avif", matiere: null },
      ],
    },
    {
      id: "mri-g-008",
      nom: "Batteur Bouclier Noir de la Moria",
      image: "/images/factions/moria/mri-g-008.avif",
      variantesDetaillees: [
        { id: "mri-g-008-m1", nom: "Modèle 1", image: "/images/factions/moria/approfondi/mri-g-008-m1.avif", matiere: null },
        { id: "mri-g-008-m2", nom: "Modèle 2", image: "/images/factions/moria/approfondi/mri-g-008-m2.avif", matiere: null },
      ],
    },
    {
      id: "mri-g-009",
      nom: "Traqueur Gobelin de la Moria",
      image: "/images/factions/moria/mri-g-009.avif",
      variantesDetaillees: [
        { id: "mri-g-009-m1", nom: "Modèle 1", image: "/images/factions/moria/approfondi/mri-g-009-m1.avif", matiere: null },
        { id: "mri-g-009-m2", nom: "Modèle 2", image: "/images/factions/moria/approfondi/mri-g-009-m2.avif", matiere: null },
        { id: "mri-g-009-m3", nom: "Modèle 3", image: "/images/factions/moria/approfondi/mri-g-009-m3.avif", matiere: null },
      ],
    },
    {
      id: "mri-g-010",
      nom: "Nuée de Chauves-souris",
      image: "/images/factions/moria/mri-g-010.avif",
    },
    {
      id: "mri-g-011",
      nom: "Habitant des Ténèbres",
      image: "/images/factions/moria/mri-g-011.avif",
    },
  ],
};

export default MORIA;
