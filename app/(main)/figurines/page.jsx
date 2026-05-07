"use client";

// ============================================================
// PAGE FIGURINES - Inventaire & Souhaitées
// ============================================================
// Liste toutes les figurines du catalogue avec :
//   - Barre de recherche par nom
//   - Filtre : Tout | Inventaire | Souhaitée
//   - Filtre par faction (Homme / Elfe / Nain / Autre / Toutes)
//   - Tri (A-Z, Z-A, Faction)
//   - Chaque carte permet de toggler inventaire/souhaitée
//   - Une modal s'ouvre pour saisir la quantité

import { useEffect, useState, useMemo } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getInventaireUtilisateur } from "@/lib/firestore";
import {
  FACTIONS_BIEN_GROUPES,
  FACTIONS_MAL,
} from "@/data/figurines/index.js";
import FACTIONS_DATA from "@/data/factions/index.js";
import TOUS_LES_HEROS from "@/data/heros/index.js";
import FigurineCard from "@/components/figurines/FigurineCard";
import HeroCard from "@/components/figurines/HeroCard";
import FilterTabs from "@/components/figurines/FilterTabs";
import SearchBar from "@/components/ui/SearchBar";

// Options de tri disponibles
const OPTIONS_TRI = [
  { valeur: "a-z", label: "Nom A → Z" },
  { valeur: "z-a", label: "Nom Z → A" },
];

export default function PageFigurines() {
  const { utilisateur } = useAuth();

  const [inventaireBrut, setInventaireBrut] = useState({});
  const [chargement, setChargement] = useState(true);

  // États de filtre et recherche
  const [recherche, setRecherche] = useState("");
  const [onglet, setOnglet] = useState("tout");
  const [tri, setTri] = useState("a-z");
  const [afficherMenuTri, setAfficherMenuTri] = useState(false);
  const [afficherBien, setAfficherBien] = useState(true);
  const [afficherMal, setAfficherMal] = useState(true);
  const [afficherHeros, setAfficherHeros] = useState(true);

  // ---- CHARGEMENT INITIAL ----
  useEffect(() => {
    if (!utilisateur) return;

    async function charger() {
      const inventaire = await getInventaireUtilisateur(utilisateur.uid);
      setInventaireBrut(inventaire);
      setChargement(false);
    }

    charger();

    window.addEventListener("focus", charger);
    return () => window.removeEventListener("focus", charger);
  }, [utilisateur]);

  // ---- STATS HÉROS ----
  // possedes = nb de variantes avec au moins 1 exemplaire (binaire, pas la somme des quantités)
  const heroesAvecStats = useMemo(() => {
    return TOUS_LES_HEROS.map((hero) => ({
      ...hero,
      possedes: hero.variantes.filter(
        (v) => (inventaireBrut[v.id]?.quantiteInventaire ?? 0) > 0
      ).length,
    }));
  }, [inventaireBrut]);

  // ---- STATS PAR FACTION ----
  const statsParFaction = useMemo(() => {
    const map = {};

    // Figurines des pages de faction (héros + guerriers)
    Object.entries(FACTIONS_DATA).forEach(([nomFaction, data]) => {
      if (!map[nomFaction]) map[nomFaction] = { possedes: 0, souhaites: 0 };
      const toutes = [...(data.heros ?? []), ...(data.guerriers ?? [])];
      toutes.forEach((fig) => {
        const inv = inventaireBrut[fig.id];
        if (inv?.quantiteInventaire > 0) map[nomFaction].possedes += inv.quantiteInventaire;
        if (inv?.souhaite) map[nomFaction].souhaites++;
      });
    });

    return map;
  }, [inventaireBrut]);

  // Filtre une liste plate de noms de factions selon l'onglet et la recherche
  function filtrerFactions(liste) {
    return liste
      .filter((nom) => {
        const stats = statsParFaction[nom] ?? { possedes: 0, souhaites: 0 };
        if (onglet === "inventaire" && stats.possedes === 0) return false;
        if (onglet === "souhaite" && stats.souhaites === 0) return false;
        if (
          recherche.trim() &&
          !nom.toLowerCase().includes(recherche.toLowerCase())
        )
          return false;
        return true;
      })
      .map((nom) => ({
        nom,
        ...(statsParFaction[nom] ?? { possedes: 0, souhaites: 0 }),
      }));
  }

  // Filtre les groupes du Bien et supprime les groupes vides
  function filtrerGroupes(groupes) {
    return groupes
      .map((groupe) => ({
        titre: groupe.titre,
        factions: filtrerFactions(groupe.factions),
      }))
      .filter((groupe) => groupe.factions.length > 0);
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0D0D0D] ">
      {/* EN-TÊTE FIXE */}
      <div className="sticky w-full top-0 z-40 bg-[#0D0D0D] border-b border-[#2A2A2A] px-4">
        {/* Ligne décorative dorée */}
        <div className="h-0.5 bg-linear-to-r from-transparent via-[#C9A227] to-transparent" />
        {/* Titre centré */}
        <div className="pt-6 pb-4 text-center">
          <h1 className="text-2xl font-bold text-[#F5F5F5] uppercase tracking-widest">
            Inventaire & Souhaitées
          </h1>
        </div>

        {/* Barre de recherche */}
        <div className="pb-5">
          <SearchBar
            valeur={recherche}
            onChange={setRecherche}
            placeholder="Rechercher une figurine..."
          />
        </div>

        {/* Onglets Tout / Inventaire / Souhaitée */}
        <div className="pt-4 pb-4">
          <FilterTabs ongletActif={onglet} onChangement={setOnglet} />
        </div>

        {/* Bouton Tri — aligné à droite sur sa propre ligne */}
        <div className="flex justify-end pb-3">
          <div className="relative">
            <button
              onClick={() => setAfficherMenuTri(!afficherMenuTri)}
              className="flex items-center gap-1.5 border border-[#3A3A3A] rounded-full px-4 py-1.5 text-xs text-[#D4D4D4] hover:border-[#C9A227] transition-colors"
            >
              <SlidersHorizontal size={13} />
              Trier
              <ChevronDown
                size={13}
                className={`transition-transform ${afficherMenuTri ? "rotate-180" : ""}`}
              />
            </button>

            {/* Menu déroulant du tri */}
            {afficherMenuTri && (
              <div className="absolute right-0 top-9 bg-[#1A1A1A] border border-[#3A3A3A] rounded-xl shadow-xl z-50 min-w-35 overflow-hidden">
                {OPTIONS_TRI.map(({ valeur, label }) => (
                  <button
                    key={valeur}
                    onClick={() => {
                      setTri(valeur);
                      setAfficherMenuTri(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      tri === valeur
                        ? "text-[#C9A227] bg-[#C9A227]/10"
                        : "text-[#D4D4D4] hover:bg-[#2A2A2A]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* GRILLE DES FACTIONS */}
      <div className="flex-1 px-4">
        {chargement ? (
          // Skeleton de chargement
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 animate-pulse"
              >
                <div className="h-4 bg-[#2A2A2A] rounded w-3/4 mb-3" />
                <div className="h-px bg-[#2A2A2A] mb-3" />
                <div className="h-3 bg-[#2A2A2A] rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          (() => {
            const groupesBien = filtrerGroupes(FACTIONS_BIEN_GROUPES);
            const mal = filtrerFactions(FACTIONS_MAL);
            const total = groupesBien.reduce((acc, g) => acc + g.factions.length, 0) + mal.length;

            if (total === 0)
              return (
                <div className="flex flex-col items-center justify-center py-20 px-8 gap-3">
                  <p className="text-[#3A3A3A] text-5xl">⚔️</p>
                  <p className="text-[#6B6B6B] text-center text-sm">
                    {recherche
                      ? `Aucune faction trouvée pour "${recherche}"`
                      : onglet === "inventaire"
                        ? "Ton inventaire est vide."
                        : onglet === "souhaite"
                          ? "Aucune figurine souhaitée."
                          : "Aucune faction trouvée."}
                  </p>
                </div>
              );

            return (
              <div className="pb-6">
                {/* BIEN */}
                {groupesBien.length > 0 && (
                  <>
                    <div className="flex items-center justify-center gap-3 py-4">
                      <h2 className="text-[#C9A227] text-2xl font-bold uppercase tracking-widest">
                        Bien
                      </h2>
                      <button
                        onClick={() => setAfficherBien(!afficherBien)}
                        className="text-[10px] font-semibold uppercase tracking-wide border border-[#3A3A3A] text-[#6B6B6B] hover:border-[#C9A227] hover:text-[#C9A227] rounded-full px-3 py-1 transition-colors"
                      >
                        {afficherBien ? "Masquer" : "Afficher"}
                      </button>
                    </div>
                    {afficherBien && (
                      <div className="flex flex-col gap-8">
                        {groupesBien.map((groupe) => (
                          <div key={groupe.titre}>
                            <h3
                              className="text-[#C9A227] text-xl tracking-wide mb-3 text-center sm:text-left"
                              style={{ fontFamily: "var(--font-elvish)" }}
                            >
                              {groupe.titre}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                              {groupe.factions.map((faction) => (
                                <FigurineCard
                                  key={faction.nom}
                                  faction={faction}
                                  onglet={onglet}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Séparateur */}
                {groupesBien.length > 0 && mal.length > 0 && (
                  <div className="h-0.5 bg-linear-to-r from-transparent via-[#C9A227] to-transparent mb-6 mt-8" />
                )}

                {/* MAL */}
                {mal.length > 0 && (
                  <>
                    <div className="flex items-center justify-center gap-3 pt-3 pb-4">
                      <h2 className="text-[#C9A227] text-2xl font-bold uppercase tracking-widest">
                        Mal
                      </h2>
                      <button
                        onClick={() => setAfficherMal(!afficherMal)}
                        className="text-[10px] font-semibold uppercase tracking-wide border border-[#3A3A3A] text-[#6B6B6B] hover:border-[#C9A227] hover:text-[#C9A227] rounded-full px-3 py-1 transition-colors"
                      >
                        {afficherMal ? "Masquer" : "Afficher"}
                      </button>
                    </div>
                    {afficherMal && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {mal.map((faction) => (
                          <FigurineCard
                            key={faction.nom}
                            faction={faction}
                            onglet={onglet}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Séparateur */}
                <div className="h-0.5 bg-linear-to-r from-transparent via-[#C9A227] to-transparent mb-6 mt-8" />

                {/* HÉROS */}
                <div className="flex items-center justify-center gap-3 pt-3 pb-4">
                  <h2 className="text-[#C9A227] text-2xl font-bold uppercase tracking-widest">
                    Héros
                  </h2>
                  <button
                    onClick={() => setAfficherHeros(!afficherHeros)}
                    className="text-[10px] font-semibold uppercase tracking-wide border border-[#3A3A3A] text-[#6B6B6B] hover:border-[#C9A227] hover:text-[#C9A227] rounded-full px-3 py-1 transition-colors"
                  >
                    {afficherHeros ? "Masquer" : "Afficher"}
                  </button>
                </div>
                {afficherHeros && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 pb-6">
                    {heroesAvecStats.map((hero) => (
                      <HeroCard key={hero.nom} hero={hero} />
                    ))}
                  </div>
                )}
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
}
