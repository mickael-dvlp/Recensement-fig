// ============================================================
// FANGORN — Héros & Guerriers
// ============================================================

const FANGORN = {
  nom: "Fangorn",

  heros: [
    { id: "fan-h-001", nom: "Sylvebarbe", image: "/images/factions/fangorn/fan-h-001.avif", lienHero: "Sylvebarbe" },
    { id: "fan-h-002", nom: "Osdehétu",   image: "/images/factions/fangorn/fan-h-002.avif", lienHero: "Osdehétu" },
    { id: "fan-h-003", nom: "Vifsorbier", image: "/images/factions/fangorn/fan-h-003.avif", lienHero: "Vifsorbier" },
  ],

  guerriers: [
    {
      id: "fan-g-001",
      nom: "Ent",
      image: "/images/factions/fangorn/fan-g-001.avif",
      variantesDetaillees: [
        { id: "fan-g-001-m1", nom: "Modèle 1", image: "/images/factions/fangorn/approfondi/fan-g-001-m1.avif", matiere: null },
        { id: "fan-g-001-m2", nom: "Modèle 2", image: "/images/factions/fangorn/approfondi/fan-g-001-m2.avif", matiere: null },
      ],
    },
  ],
};

export default FANGORN;
