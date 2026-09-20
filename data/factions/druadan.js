// ============================================================
// DRÚADAN — Héros & Guerriers
// ============================================================

const DRUADAN = {
  nom: "Drúadan",

  heros: [
    { id: "dru-h-001", nom: "Ghân-buri-Ghân", image: "/images/factions/druadan/dru-h-001.avif", lienHero: "Ghan-Buri-Ghan" },
  ],

  guerriers: [
    {
      id: "dru-g-001",
      nom: "Guerrier Drúadan",
      image: "/images/factions/druadan/dru-g-001.avif",
      variantesDetaillees: [
        { id: "dru-g-001-m1", nom: "Modèle 1", image: "/images/factions/druadan/approfondi/dru-g-001-m1.avif", matiere: null },
        { id: "dru-g-001-m2", nom: "Modèle 2", image: "/images/factions/druadan/approfondi/dru-g-001-m2.avif", matiere: null },
        { id: "dru-g-001-m3", nom: "Modèle 3", image: "/images/factions/druadan/approfondi/dru-g-001-m3.avif", matiere: null },
      ],
    },
  ],
};

export default DRUADAN;
