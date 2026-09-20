// ============================================================
// EREBOR RESTAURÉ — Héros & Guerriers
// ============================================================

const EREBOR_RESTAURE = {
  nom: "Erebor Restauré",

  heros: [
    {
      id: "ers-h-001",
      nom: "Bifur le Nain, Défenseur d'Erebor",
      image: "/images/factions/erebor-restaure/ers-h-001.avif",
      lienHero: "Bifur",
    },
    {
      id: "ers-h-002",
      nom: "Bofur le Nain, Défenseur d'Erebor",
      image: "/images/factions/erebor-restaure/ers-h-002.avif",
      lienHero: "Bofur",
    },
    {
      id: "ers-h-003",
      nom: "Capitaine des Défenseurs d'Erebor (Lance + Bouclier)",
      image: "/images/factions/erebor-restaure/ers-h-003.avif",
    },
    {
      id: "ers-h-004",
      nom: "Capitaine des Défenseurs d'Erebor (Piolet)",
      image: "/images/factions/erebor-restaure/ers-h-004.avif",
    },
    {
      id: "ers-h-005",
      nom: "Dáin Pied-d'Acier, Roi Sous la Montagne",
      image: "/images/factions/erebor-restaure/ers-h-005.avif",
      lienHero: "Dain",
    },
    {
      id: "ers-h-006",
      nom: "Dori le Nain, Défenseur d'Erebor",
      image: "/images/factions/erebor-restaure/ers-h-006.avif",
      lienHero: "Dori",
    },
    {
      id: "ers-h-007",
      nom: "Dwalin le Nain, Défenseur d'Erebor",
      image: "/images/factions/erebor-restaure/ers-h-007.avif",
      lienHero: "Dwalin",
    },
    {
      id: "ers-h-008",
      nom: "Gimli, fils de Glóin",
      image: "/images/factions/erebor-restaure/ers-h-008.avif",
      lienHero: "Gimli",
    },
    {
      id: "ers-h-009",
      nom: "Glóin le Nain, Champion d'Erebor",
      image: "/images/factions/erebor-restaure/ers-h-009.avif",
      lienHero: "Gloin",
    },
    {
      id: "ers-h-010",
      nom: "Nori le Nain, Défenseur d'Erebor",
      image: "/images/factions/erebor-restaure/ers-h-010.avif",
      lienHero: "Nori",
    },
    {
      id: "ers-h-011",
      nom: "Roi Nain d'Erebor",
      lienHero: "Roi des Nains",
      image: "/images/factions/erebor-restaure/ers-h-011.avif",
    },
    {
      id: "ers-h-012",
      nom: "Thorin III Heaume-de-Pierre",
      image: "/images/factions/erebor-restaure/ers-h-012.avif",
      lienHero: "Thorin III",
    },
  ],

  guerriers: [
    {
      id: "ers-g-001",
      nom: "Chevaucheur de Bouquetin (Lance de Guerre)",
      image: "/images/factions/erebor-restaure/ers-g-001.avif",
      variantesDetaillees: [
        { id: "ers-g-001-m1", nom: "Modèle 1", image: "/images/factions/erebor-restaure/approfondi/ers-g-001-m1.avif", matiere: null },
        { id: "ers-g-001-m2", nom: "Modèle 2", image: "/images/factions/erebor-restaure/approfondi/ers-g-001-m2.avif", matiere: null },
        { id: "ers-g-001-m3", nom: "Modèle 3", image: "/images/factions/erebor-restaure/approfondi/ers-g-001-m3.avif", matiere: null },
      ],
    },
    {
      id: "ers-g-002",
      nom: "Chevaucheur de Bouquetin (Piolet)",
      image: "/images/factions/erebor-restaure/ers-g-002.avif",
      // Pas de sculpt distinct connu/visuel officiel pour l'instant — image de remplacement.
      variantesDetaillees: [
        { id: "ers-g-002-m1", nom: "Modèle 1", image: "/images/placeholder-non-officiel.avif", matiere: null },
      ],
    },
    {
      id: "ers-g-003",
      nom: "Guerrier des Monts de Fer (Arbalète)",
      image: "/images/factions/erebor-restaure/ers-g-003.avif",
      variantesDetaillees: [
        { id: "ers-g-003-m1", nom: "Modèle 1", image: "/images/factions/erebor-restaure/approfondi/ers-g-003-m1.avif", matiere: null },
        { id: "ers-g-003-m2", nom: "Modèle 2", image: "/images/factions/erebor-restaure/approfondi/ers-g-003-m2.avif", matiere: null },
        { id: "ers-g-003-m3", nom: "Modèle 3", image: "/images/factions/erebor-restaure/approfondi/ers-g-003-m3.avif", matiere: null },
      ],
    },
    {
      id: "ers-g-004",
      nom: "Guerrier des Monts de Fer (Bannière)",
      image: "/images/factions/erebor-restaure/ers-g-004.avif",
    },
    {
      id: "ers-g-005",
      nom: "Guerrier des Monts de Fer (Bouclier + Bannière)",
      image: "/images/factions/erebor-restaure/ers-g-005.avif",
    },
    {
      id: "ers-g-006",
      nom: "Guerrier des Monts de Fer (Bouclier + Lance)",
      image: "/images/factions/erebor-restaure/ers-g-006.avif",
      variantesDetaillees: [
        { id: "ers-g-006-m1", nom: "Modèle 1", image: "/images/factions/erebor-restaure/approfondi/ers-g-006-m1.avif", matiere: null },
        { id: "ers-g-006-m2", nom: "Modèle 2", image: "/images/factions/erebor-restaure/approfondi/ers-g-006-m2.avif", matiere: null },
        { id: "ers-g-006-m3", nom: "Modèle 3", image: "/images/factions/erebor-restaure/approfondi/ers-g-006-m3.avif", matiere: null },
        { id: "ers-g-006-m4", nom: "Modèle 4", image: "/images/factions/erebor-restaure/approfondi/ers-g-006-m4.avif", matiere: null },
        { id: "ers-g-006-m5", nom: "Modèle 5", image: "/images/factions/erebor-restaure/approfondi/ers-g-006-m5.avif", matiere: null },
        { id: "ers-g-006-m6", nom: "Modèle 6", image: "/images/factions/erebor-restaure/approfondi/ers-g-006-m6.avif", matiere: null },
        { id: "ers-g-006-m7", nom: "Modèle 7", image: "/images/factions/erebor-restaure/approfondi/ers-g-006-m7.avif", matiere: null },
        { id: "ers-g-006-m8", nom: "Modèle 8", image: "/images/factions/erebor-restaure/approfondi/ers-g-006-m8.avif", matiere: null },
        { id: "ers-g-006-m9", nom: "Modèle 9", image: "/images/factions/erebor-restaure/approfondi/ers-g-006-m9.avif", matiere: null },
        { id: "ers-g-006-m10", nom: "Modèle 10", image: "/images/factions/erebor-restaure/approfondi/ers-g-006-m10.avif", matiere: null },
        { id: "ers-g-006-m11", nom: "Modèle 11", image: "/images/factions/erebor-restaure/approfondi/ers-g-006-m11.avif", matiere: null },
        { id: "ers-g-006-m12", nom: "Modèle 12", image: "/images/factions/erebor-restaure/approfondi/ers-g-006-m12.avif", matiere: null },
        { id: "ers-g-006-m13", nom: "Modèle 13", image: "/images/factions/erebor-restaure/approfondi/ers-g-006-m13.avif", matiere: null },
        { id: "ers-g-006-m14", nom: "Modèle 14", image: "/images/factions/erebor-restaure/approfondi/ers-g-006-m14.avif", matiere: null },
        { id: "ers-g-006-m15", nom: "Modèle 15", image: "/images/factions/erebor-restaure/approfondi/ers-g-006-m15.avif", matiere: null },
      ],
    },
    {
      id: "ers-g-007",
      nom: "Guerrier des Monts de Fer (Piolet)",
      image: "/images/factions/erebor-restaure/ers-g-007.avif",
      variantesDetaillees: [
        { id: "ers-g-007-m1", nom: "Modèle 1", image: "/images/factions/erebor-restaure/approfondi/ers-g-007-m1.avif", matiere: null },
        { id: "ers-g-007-m2", nom: "Modèle 2", image: "/images/factions/erebor-restaure/approfondi/ers-g-007-m2.avif", matiere: null },
        { id: "ers-g-007-m3", nom: "Modèle 3", image: "/images/factions/erebor-restaure/approfondi/ers-g-007-m3.avif", matiere: null },
      ],
    },
  ],
};

export default EREBOR_RESTAURE;
