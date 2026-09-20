// ============================================================
// CARN-DÛM — Héros & Guerriers
// ============================================================

const CARN_DUM = {
  nom: "Carn-Dûm",

  heros: [
    { id: "crd-h-001", nom: "Aldrac, Chef de Guerre de Carn-Dûm",               image: "/images/factions/carn-dum/crd-h-001.avif", lienHero: "Aldrac" },
    { id: "crd-h-002", nom: "Capitaine de Carn-Dûm",                            image: "/images/factions/carn-dum/crd-h-002.avif" },
    { id: "crd-h-003", nom: "Fráecht, Vassal du Roi-Sorcier",                   image: "/images/factions/carn-dum/crd-h-003.avif", lienHero: "Fraecht" },
  ],

  guerriers: [
    { id: "crd-g-001", nom: "Guerrier de Carn-Dûm",                             image: "/images/factions/carn-dum/crd-g-001.avif" },
    { id: "crd-g-002", nom: "Guerrier de Carn-Dûm (Bannière)",                  image: "/images/factions/carn-dum/crd-g-002.avif" },
    {
      id: "crd-g-003",
      nom: "Guerrier de Carn-Dûm (Lance)",
      image: "/images/factions/carn-dum/crd-g-003.avif",
      variantesDetaillees: [
        { id: "crd-g-003-m1", nom: "Modèle 1", image: "/images/factions/carn-dum/approfondi/crd-g-003-m1.avif", matiere: null },
        { id: "crd-g-003-m2", nom: "Modèle 2", image: "/images/factions/carn-dum/approfondi/crd-g-003-m2.avif", matiere: null },
        { id: "crd-g-003-m3", nom: "Modèle 3", image: "/images/factions/carn-dum/approfondi/crd-g-003-m3.avif", matiere: null },
        { id: "crd-g-003-m4", nom: "Modèle 4", image: "/images/factions/carn-dum/approfondi/crd-g-003-m4.avif", matiere: null },
      ],
    },
  ],
};

export default CARN_DUM;
