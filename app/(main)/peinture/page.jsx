"use client";

// ============================================================
// PAGE PEINTURE - Catalogue des pots de peinture
// ============================================================

import { useState, useMemo, useEffect, useCallback } from "react";
import { Palette, Heart, Plus, Minus } from "lucide-react";
import SearchBar from "@/components/ui/SearchBar";
import { useAuth } from "@/lib/auth-context";
import { getInventaireUtilisateur, mettreAJourFigurine } from "@/lib/firestore";
import citadelData from "@/data/peintures/citadel.json";
import vallejoData from "@/data/peintures/vallejo.json";
import armyPainterData from "@/data/peintures/army-painter.json";

const TOUTES_PEINTURES = [...citadelData, ...vallejoData, ...armyPainterData];

const COULEURS_MARQUE = {
  Citadel: "#C9A227",
  Vallejo: "#3B82F6",
  "Army Painter": "#22C55E",
};

function CartePeinture({ peinture, donneesUtilisateur, onMettreAJour }) {
  const couleur = COULEURS_MARQUE[peinture.marque] || "#6B6B6B";
  const quantite = donneesUtilisateur?.quantiteInventaire ?? 0;
  const souhaite = donneesUtilisateur?.souhaite ?? false;
  const [compteurVisible, setCompteurVisible] = useState(quantite > 0);

  async function ajouter() {
    setCompteurVisible(true);
    await onMettreAJour(peinture.id, { enInventaire: true, quantiteInventaire: 1 });
  }

  async function modifierQuantite(delta) {
    const nouvelleQuantite = Math.max(0, quantite + delta);
    if (nouvelleQuantite === 0) setCompteurVisible(false);
    await onMettreAJour(peinture.id, {
      enInventaire: nouvelleQuantite > 0,
      quantiteInventaire: nouvelleQuantite,
    });
  }

  async function toggleSouhaite() {
    await onMettreAJour(peinture.id, { souhaite: !souhaite });
  }

  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden flex flex-col hover:border-[#3A3A3A] transition-colors">
      {/* Cercle de couleur */}
      <div className="w-full aspect-4/3 bg-[#0D0D0D] flex items-center justify-center">
        <div
          className="w-3/5 aspect-square rounded-full border-2 border-[#2A2A2A]"
          style={{ backgroundColor: peinture.hex }}
          title={peinture.hex}
        />
      </div>

      {/* Infos + actions */}
      <div className="flex flex-col gap-1.5 px-2 py-3 flex-1">
        <p className="text-[#F5F5F5] font-bold text-xs leading-snug text-center line-clamp-2">
          {peinture.nom}
        </p>

        {/* Badge marque */}
        <div className="flex justify-center">
          <div
            className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase"
            style={{
              backgroundColor: `${couleur}20`,
              color: couleur,
              border: `1px solid ${couleur}40`,
            }}
          >
            {peinture.gamme}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 mt-auto pt-1">
          {compteurVisible ? (
            <div className="flex-1 flex items-center justify-between bg-[#0D0D0D] border border-[#3A3A3A] rounded-full px-2 py-1">
              <button
                onClick={() => modifierQuantite(-1)}
                className="text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
                aria-label="Réduire"
              >
                <Minus size={11} />
              </button>
              <span className="text-[#F5F5F5] font-bold text-xs min-w-4 text-center">
                {quantite}
              </span>
              <button
                onClick={() => modifierQuantite(1)}
                className="text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
                aria-label="Augmenter"
              >
                <Plus size={11} />
              </button>
            </div>
          ) : (
            <button
              onClick={ajouter}
              className="flex-1 flex items-center justify-center gap-1 border border-[#3A3A3A] rounded-full py-1.5 text-xs text-[#6B6B6B] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors"
            >
              <Plus size={12} />
              Ajouter
            </button>
          )}

          <button
            onClick={toggleSouhaite}
            aria-label={souhaite ? "Retirer des souhaités" : "Ajouter aux souhaités"}
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full border border-[#2A2A2A] hover:border-[#3A3A3A] transition-colors"
          >
            <Heart
              size={12}
              className={souhaite ? "fill-red-500 text-red-500" : "text-[#3A3A3A] hover:text-[#6B6B6B]"}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PagePeinture() {
  const { utilisateur } = useAuth();

  const [inventaireBrut, setInventaireBrut] = useState({});
  const [marque, setMarque] = useState("Toutes");
  const [gamme, setGamme] = useState("Toutes");
  const [recherche, setRecherche] = useState("");

  // ---- CHARGEMENT INVENTAIRE ----
  useEffect(() => {
    if (!utilisateur) return;
    async function charger() {
      const inv = await getInventaireUtilisateur(utilisateur.uid);
      setInventaireBrut(inv);
    }
    charger();
    window.addEventListener("focus", charger);
    return () => window.removeEventListener("focus", charger);
  }, [utilisateur]);

  // ---- MISE À JOUR ----
  const mettreAJour = useCallback(
    async (peintureId, data) => {
      if (!utilisateur) return;
      setInventaireBrut((prev) => ({
        ...prev,
        [peintureId]: { ...(prev[peintureId] ?? {}), ...data },
      }));
      await mettreAJourFigurine(utilisateur.uid, peintureId, data);
    },
    [utilisateur]
  );

  // ---- GAMMES DISPONIBLES ----
  const gammesDisponibles = useMemo(() => {
    const source =
      marque === "Toutes"
        ? TOUTES_PEINTURES
        : TOUTES_PEINTURES.filter((p) => p.marque === marque);
    const uniques = Array.from(new Set(source.map((p) => p.gamme))).sort();
    return ["Toutes", ...uniques];
  }, [marque]);

  function changerMarque(m) {
    setMarque(m);
    setGamme("Toutes");
  }

  // ---- PEINTURES FILTRÉES ----
  const peinturesFiltrees = useMemo(() => {
    let liste = TOUTES_PEINTURES;
    if (marque !== "Toutes") liste = liste.filter((p) => p.marque === marque);
    if (gamme !== "Toutes") liste = liste.filter((p) => p.gamme === gamme);
    if (recherche.trim()) {
      const q = recherche.toLowerCase();
      liste = liste.filter(
        (p) =>
          p.nom.toLowerCase().includes(q) ||
          p.gamme.toLowerCase().includes(q) ||
          p.marque.toLowerCase().includes(q)
      );
    }
    return [...liste].sort((a, b) => a.nom.localeCompare(b.nom));
  }, [marque, gamme, recherche]);

  const MARQUES = ["Toutes", "Citadel", "Vallejo", "Army Painter"];

  return (
    <div className="flex flex-col min-h-screen bg-[#0D0D0D]">
      {/* EN-TÊTE FIXE */}
      <div className="sticky top-0 z-40 bg-[#0D0D0D] border-b border-[#2A2A2A] px-6">
        <div className="h-0.5 bg-linear-to-r from-transparent via-[#C9A227] to-transparent" />
        <div className="pt-6 pb-4 text-center">
          <h1 className="text-2xl font-bold text-[#F5F5F5] uppercase tracking-widest">
            Catalogue Peintures
          </h1>
          <p className="text-[#6B6B6B] text-sm mt-1">
            {TOUTES_PEINTURES.length} couleurs disponibles et plus encore à venir !
          </p>
        </div>

        <div className="px-6 pb-3">
          <SearchBar
            valeur={recherche}
            onChange={setRecherche}
            placeholder="Rechercher une couleur..."
          />
        </div>

        {/* Filtre par marque */}
        <div className="pb-3">
          <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
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
          <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
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
      <div className="flex-1 py-3 px-6">
        {peinturesFiltrees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Palette size={40} className="text-[#3A3A3A]" />
            <p className="text-[#6B6B6B] text-sm text-center">
              Aucune peinture trouvée pour &ldquo;{recherche}&rdquo;
            </p>
          </div>
        ) : (
          <>
            <p className="text-[#6B6B6B] text-xs mb-3">
              {peinturesFiltrees.length} couleur{peinturesFiltrees.length > 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {peinturesFiltrees.map((peinture) => (
                <CartePeinture
                  key={peinture.id}
                  peinture={peinture}
                  donneesUtilisateur={inventaireBrut[peinture.id]}
                  onMettreAJour={mettreAJour}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
