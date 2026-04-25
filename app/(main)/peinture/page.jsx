"use client";

// ============================================================
// PAGE PEINTURE - Catalogue des pots de peinture
// ============================================================
// Affiche le catalogue de peintures des 3 marques principales :
//   - Citadel (Games Workshop)
//   - Vallejo
//   - Army Painter
// Filtrable par marque et gamme, avec barre de recherche.
// Les données proviennent des fichiers JSON statiques locaux.

import { useState, useMemo } from "react";
import { Palette } from "lucide-react";
import SearchBar from "@/components/ui/SearchBar";
import citadelData from "@/data/peintures/citadel.json";
import vallejoData from "@/data/peintures/vallejo.json";
import armyPainterData from "@/data/peintures/army-painter.json";

// Fusion de toutes les peintures en une seule liste
const TOUTES_PEINTURES = [...citadelData, ...vallejoData, ...armyPainterData];

// Couleur de badge par marque
const COULEURS_MARQUE = {
  Citadel: "#C9A227", // Doré (Games Workshop)
  Vallejo: "#3B82F6", // Bleu
  "Army Painter": "#22C55E", // Vert
};

/**
 * Composant carte pour un pot de peinture individuel
 */
function CartePeinture({ peinture }) {
  const couleur = COULEURS_MARQUE[peinture.marque] || "#6B6B6B";

  return (
    <div className="flex items-center gap-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-3">
      {/* Cercle de couleur de la peinture */}
      <div
        className="w-12 h-12 rounded-full shrink-0 border-2 border-[#2A2A2A]"
        style={{ backgroundColor: peinture.hex }}
        title={peinture.hex}
      />

      {/* Infos */}
      <div className="flex-1 min-w-0">
        <p className="text-[#F5F5F5] font-semibold text-sm truncate">
          {peinture.nom}
        </p>
        <p className="text-[#6B6B6B] text-xs mt-0.5">{peinture.gamme}</p>
      </div>

      {/* Badge marque coloré */}
      <div
        className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0"
        style={{
          backgroundColor: `${couleur}20`,
          color: couleur,
          border: `1px solid ${couleur}40`,
        }}
      >
        {/* Abréviation pour Army Painter (trop long sinon) */}
        {peinture.marque === "Army Painter" ? "AP" : peinture.marque}
      </div>
    </div>
  );
}

export default function PagePeinture() {
  // Filtre de marque actif
  const [marque, setMarque] = useState("Toutes");
  // Filtre de gamme actif
  const [gamme, setGamme] = useState("Toutes");
  // Recherche textuelle
  const [recherche, setRecherche] = useState("");

  // ---- GAMMES DISPONIBLES SELON LA MARQUE SÉLECTIONNÉE ----
  const gammesDisponibles = useMemo(() => {
    const source =
      marque === "Toutes"
        ? TOUTES_PEINTURES
        : TOUTES_PEINTURES.filter((p) => p.marque === marque);

    // Déduplique et trie les gammes disponibles
    const uniques = Array.from(new Set(source.map((p) => p.gamme))).sort();
    return ["Toutes", ...uniques];
  }, [marque]);

  /** Réinitialise le filtre gamme quand on change de marque */
  function changerMarque(m) {
    setMarque(m);
    setGamme("Toutes");
  }

  // ---- PEINTURES FILTRÉES ET TRIÉES ----
  const peinturesFiltrees = useMemo(() => {
    let liste = TOUTES_PEINTURES;

    if (marque !== "Toutes") {
      liste = liste.filter((p) => p.marque === marque);
    }
    if (gamme !== "Toutes") {
      liste = liste.filter((p) => p.gamme === gamme);
    }
    if (recherche.trim()) {
      const q = recherche.toLowerCase();
      liste = liste.filter(
        (p) =>
          p.nom.toLowerCase().includes(q) ||
          p.gamme.toLowerCase().includes(q) ||
          p.marque.toLowerCase().includes(q),
      );
    }

    // Tri alphabétique par nom
    return [...liste].sort((a, b) => a.nom.localeCompare(b.nom));
  }, [marque, gamme, recherche]);

  // Toutes les marques disponibles
  const MARQUES = ["Toutes", "Citadel", "Vallejo", "Army Painter"];

  return (
    <div className="flex flex-col min-h-screen bg-[#0D0D0D]">
      {/* EN-TÊTE FIXE */}
      <div className="sticky top-0 z-40 bg-[#0D0D0D] border-b border-[#2A2A2A] px-6">
        {/* Ligne décorative dorée */}
        <div className="h-0.5 bg-linear-to-r from-transparent via-[#C9A227] to-transparent" />
        {/* Titre */}
        <div className="pt-6 pb-4 text-center">
          <h1 className="text-2xl font-bold text-[#F5F5F5] uppercase tracking-widest">
            Catalogue Peintures
          </h1>
          <p className="text-[#6B6B6B] text-sm mt-1">
            {TOUTES_PEINTURES.length} couleurs disponibles et plus encore à
            venir !
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="px-6 pb-3">
          <SearchBar
            valeur={recherche}
            onChange={setRecherche}
            placeholder="Rechercher une couleur..."
          />
        </div>

        {/* Filtre par marque */}
        <div className="pb-3">
          <div
            className="flex gap-2 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {MARQUES.map((m) => {
              const couleur = m !== "Toutes" ? COULEURS_MARQUE[m] : "#C9A227";
              const actif = marque === m;
              return (
                <button
                  key={m}
                  onClick={() => changerMarque(m)}
                  className="shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all"
                  style={
                    actif
                      ? { backgroundColor: couleur, color: "#0D0D0D" }
                      : { border: "1px solid #3A3A3A", color: "#6B6B6B" }
                  }
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filtre par gamme */}
        <div className="pb-3">
          <div
            className="flex gap-2 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {gammesDisponibles.map((g) => (
              <button
                key={g}
                onClick={() => setGamme(g)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                  gamme === g
                    ? "border-[#C9A227] text-[#C9A227] bg-[#C9A227]/10"
                    : "border-[#2A2A2A] text-[#6B6B6B] hover:border-[#6B6B6B]"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* LISTE DES PEINTURES */}
      <div className="flex-1 py-3">
        {peinturesFiltrees.length === 0 ? (
          // État vide
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Palette size={40} className="text-[#3A3A3A]" />
            <p className="text-[#6B6B6B] text-sm text-center">
              Aucune peinture trouvée pour &ldquo;{recherche}&rdquo;
            </p>
          </div>
        ) : (
          <>
            {/* Compteur */}
            <p className="text-[#6B6B6B] text-xs mb-3">
              {peinturesFiltrees.length} couleur
              {peinturesFiltrees.length > 1 ? "s" : ""}
            </p>
            {/* Cartes de peintures */}
            <div className="flex flex-col gap-2">
              {peinturesFiltrees.map((peinture) => (
                <CartePeinture key={peinture.id} peinture={peinture} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
