// ============================================================
// LE CARROCK — Héros & Guerriers
// ============================================================

const LE_CARROCK = {
  nom: "Le Carrock",

  heros: [
    {
      id: "car-h-001",
      nom: "Beorn",
      image: "/images/factions/carrock/car-h-001.avif",
      lienHero: "Beorn",
    },
    {
      id: "car-h-003",
      nom: "Grimbeorn",
      image: "/images/factions/carrock/car-h-003.avif",
      lienHero: "Grimbeorn",
    },
  ],

  guerriers: [
    {
      id: "car-g-001",
      nom: "Beornide",
      image: "/images/factions/carrock/car-g-001.avif",
      variantesDetaillees: [
        { id: "car-g-001-m1", nom: "Modèle 1", image: "/images/factions/carrock/approfondi/car-g-001-m1.avif", matiere: null },
        { id: "car-g-001-m2", nom: "Modèle 2", image: "/images/factions/carrock/approfondi/car-g-001-m2.avif", matiere: null },
        { id: "car-g-001-m3", nom: "Modèle 3", image: "/images/factions/carrock/approfondi/car-g-001-m3.avif", matiere: null },
      ],
    },
    {
      id: "car-g-002",
      nom: "Beornide (Arc)",
      image: "/images/factions/carrock/car-g-002.avif",
      variantesDetaillees: [
        { id: "car-g-002-m1", nom: "Modèle 1", image: "/images/factions/carrock/approfondi/car-g-002-m1.avif", matiere: null },
        { id: "car-g-002-m2", nom: "Modèle 2", image: "/images/factions/carrock/approfondi/car-g-002-m2.avif", matiere: null },
        { id: "car-g-002-m3", nom: "Modèle 3", image: "/images/factions/carrock/approfondi/car-g-002-m3.avif", matiere: null },
      ],
    },
  ],
};

export default LE_CARROCK;
