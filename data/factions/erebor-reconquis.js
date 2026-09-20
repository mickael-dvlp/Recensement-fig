// ============================================================
// EREBOR RECONQUIS — Héros & Guerriers
// ============================================================

const EREBOR_RECONQUIS = {
  nom: "Erebor Reconquis",

  heros: [
    {
      id: "erc-h-001",
      nom: "Balin le Nain, Champion d'Erebor",
      image: "/images/factions/erebor-reconquis/erc-h-001.avif",
      lienHero: "Balin",
    },
    {
      id: "erc-h-002",
      nom: "Bifur le Nain, Champion d'Erebor",
      image: "/images/factions/erebor-reconquis/erc-h-002.avif",
      lienHero: "Bifur",
    },
    {
      id: "erc-h-003",
      nom: "Bofur le Nain, Champion d'Erebor",
      image: "/images/factions/erebor-reconquis/erc-h-003.avif",
      lienHero: "Bofur",
    },
    {
      id: "erc-h-004",
      nom: "Bofur le Nain, Champion d'Erebor (Troll Brute)",
      image: "/images/factions/erebor-reconquis/erc-h-004.avif",
      lienHero: "Bofur",
    },
    {
      id: "erc-h-005",
      nom: "Bombur le Nain, Champion d'Erebor",
      image: "/images/factions/erebor-reconquis/erc-h-005.avif",
      lienHero: "Bombur",
    },
    {
      id: "erc-h-006",
      nom: "Capitaine des Monts de Fer (Lance + Bouclier)",
      image: "/images/factions/erebor-reconquis/erc-h-006.avif",
    },
    {
      id: "erc-h-007",
      nom: "Capitaine des Monts de Fer (Piolet)",
      image: "/images/factions/erebor-reconquis/erc-h-007.avif",
    },
    {
      id: "erc-h-008",
      nom: "Dáin Pied-d'Acier, Seigneur des Monts de Fer",
      image: "/images/factions/erebor-reconquis/erc-h-008.avif",
      lienHero: "Dain",
    },
    {
      id: "erc-h-009",
      nom: "Dori le Nain, Champion d'Erebor",
      image: "/images/factions/erebor-reconquis/erc-h-009.avif",
      lienHero: "Dori",
    },
    {
      id: "erc-h-010",
      nom: "Dwalin le Nain, Champion d'Erebor",
      image: "/images/factions/erebor-reconquis/erc-h-010.avif",
      lienHero: "Dwalin",
    },
    {
      id: "erc-h-011",
      nom: "Fíli le Nain, Champion d'Erebor",
      image: "/images/factions/erebor-reconquis/erc-h-011.avif",
      lienHero: "Fili",
    },
    {
      id: "erc-h-012",
      nom: "Glóin le Nain, Champion d'Erebor",
      image: "/images/factions/erebor-reconquis/erc-h-012.avif",
      lienHero: "Gloin",
    },
    {
      id: "erc-h-013",
      nom: "Kíli le Nain, Champion d'Erebor",
      image: "/images/factions/erebor-reconquis/erc-h-013.avif",
      lienHero: "Kili",
    },
    {
      id: "erc-h-014",
      nom: "Nori le Nain, Champion d'Erebor",
      image: "/images/factions/erebor-reconquis/erc-h-014.avif",
      lienHero: "Nori",
    },
    {
      id: "erc-h-015",
      nom: "Ori le Nain, Champion d'Erebor",
      image: "/images/factions/erebor-reconquis/erc-h-015.avif",
      lienHero: "Ori",
    },
    {
      id: "erc-h-016",
      nom: "Óin le Nain, Champion d'Erebor",
      image: "/images/factions/erebor-reconquis/erc-h-016.avif",
      lienHero: "Oin",
    },
    {
      id: "erc-h-017",
      nom: "Thorin Écu-de-Chêne, Roi sous la Montagne",
      image: "/images/factions/erebor-reconquis/erc-h-017.avif",
      lienHero: "Thorin",
    },
  ],

  guerriers: [
    {
      id: "erc-g-001",
      inventaireId: "ers-g-003",
      nom: "Guerrier des Monts de Fer (Arbalète)",
      image: "/images/factions/erebor-reconquis/erc-g-001.avif",
      // Même figurine que dans erebor-restaure.js (ers-g-003, propriétaire) — mêmes id de variantes.
      variantesDetaillees: [
        { id: "ers-g-003-m1", nom: "Modèle 1", image: "/images/factions/erebor-reconquis/approfondi/ers-g-003-m1.avif", matiere: null },
        { id: "ers-g-003-m2", nom: "Modèle 2", image: "/images/factions/erebor-reconquis/approfondi/ers-g-003-m2.avif", matiere: null },
        { id: "ers-g-003-m3", nom: "Modèle 3", image: "/images/factions/erebor-reconquis/approfondi/ers-g-003-m3.avif", matiere: null },
      ],
    },
    {
      id: "erc-g-002",
      inventaireId: "ers-g-004",
      nom: "Guerrier des Monts de Fer (Bannière)",
      image: "/images/factions/erebor-reconquis/erc-g-002.avif",
    },
    {
      id: "erc-g-003",
      inventaireId: "ers-g-005",
      nom: "Guerrier des Monts de Fer (Bouclier + Bannière)",
      image: "/images/factions/erebor-reconquis/erc-g-003.avif",
    },
    {
      id: "erc-g-004",
      inventaireId: "ers-g-006",
      nom: "Guerrier des Monts de Fer (Bouclier + Lance)",
      image: "/images/factions/erebor-reconquis/erc-g-004.avif",
      variantesDetaillees: [
        { id: "ers-g-006-m1", nom: "Modèle 1", image: "/images/factions/erebor-reconquis/approfondi/ers-g-006-m1.avif", matiere: null },
        { id: "ers-g-006-m2", nom: "Modèle 2", image: "/images/factions/erebor-reconquis/approfondi/ers-g-006-m2.avif", matiere: null },
        { id: "ers-g-006-m3", nom: "Modèle 3", image: "/images/factions/erebor-reconquis/approfondi/ers-g-006-m3.avif", matiere: null },
        { id: "ers-g-006-m4", nom: "Modèle 4", image: "/images/factions/erebor-reconquis/approfondi/ers-g-006-m4.avif", matiere: null },
        { id: "ers-g-006-m5", nom: "Modèle 5", image: "/images/factions/erebor-reconquis/approfondi/ers-g-006-m5.avif", matiere: null },
        { id: "ers-g-006-m6", nom: "Modèle 6", image: "/images/factions/erebor-reconquis/approfondi/ers-g-006-m6.avif", matiere: null },
        { id: "ers-g-006-m7", nom: "Modèle 7", image: "/images/factions/erebor-reconquis/approfondi/ers-g-006-m7.avif", matiere: null },
        { id: "ers-g-006-m8", nom: "Modèle 8", image: "/images/factions/erebor-reconquis/approfondi/ers-g-006-m8.avif", matiere: null },
        { id: "ers-g-006-m9", nom: "Modèle 9", image: "/images/factions/erebor-reconquis/approfondi/ers-g-006-m9.avif", matiere: null },
        { id: "ers-g-006-m10", nom: "Modèle 10", image: "/images/factions/erebor-reconquis/approfondi/ers-g-006-m10.avif", matiere: null },
        { id: "ers-g-006-m11", nom: "Modèle 11", image: "/images/factions/erebor-reconquis/approfondi/ers-g-006-m11.avif", matiere: null },
        { id: "ers-g-006-m12", nom: "Modèle 12", image: "/images/factions/erebor-reconquis/approfondi/ers-g-006-m12.avif", matiere: null },
        { id: "ers-g-006-m13", nom: "Modèle 13", image: "/images/factions/erebor-reconquis/approfondi/ers-g-006-m13.avif", matiere: null },
        { id: "ers-g-006-m14", nom: "Modèle 14", image: "/images/factions/erebor-reconquis/approfondi/ers-g-006-m14.avif", matiere: null },
        { id: "ers-g-006-m15", nom: "Modèle 15", image: "/images/factions/erebor-reconquis/approfondi/ers-g-006-m15.avif", matiere: null },
      ],
    },
    {
      id: "erc-g-005",
      inventaireId: "ers-g-007",
      nom: "Guerrier des Monts de Fer (Piolet)",
      image: "/images/factions/erebor-reconquis/erc-g-005.avif",
      variantesDetaillees: [
        { id: "ers-g-007-m1", nom: "Modèle 1", image: "/images/factions/erebor-reconquis/approfondi/ers-g-007-m1.avif", matiere: null },
        { id: "ers-g-007-m2", nom: "Modèle 2", image: "/images/factions/erebor-reconquis/approfondi/ers-g-007-m2.avif", matiere: null },
        { id: "ers-g-007-m3", nom: "Modèle 3", image: "/images/factions/erebor-reconquis/approfondi/ers-g-007-m3.avif", matiere: null },
      ],
    },
    {
      id: "erc-g-006",
      inventaireId: "ers-g-001",
      nom: "Chevaucheur de Bouquetin (Lance de Guerre)",
      image: "/images/factions/erebor-reconquis/erc-g-006.avif",
      variantesDetaillees: [
        { id: "ers-g-001-m1", nom: "Modèle 1", image: "/images/factions/erebor-reconquis/approfondi/ers-g-001-m1.avif", matiere: null },
        { id: "ers-g-001-m2", nom: "Modèle 2", image: "/images/factions/erebor-reconquis/approfondi/ers-g-001-m2.avif", matiere: null },
        { id: "ers-g-001-m3", nom: "Modèle 3", image: "/images/factions/erebor-reconquis/approfondi/ers-g-001-m3.avif", matiere: null },
      ],
    },
    {
      id: "erc-g-007",
      inventaireId: "ers-g-002",
      nom: "Chevaucheur de Bouquetin (Piolet)",
      image: "/images/factions/erebor-reconquis/erc-g-007.avif",
      variantesDetaillees: [
        { id: "ers-g-002-m1", nom: "Modèle 1", image: "/images/placeholder-non-officiel.avif", matiere: null },
      ],
    },
  ],
};

export default EREBOR_RECONQUIS;
