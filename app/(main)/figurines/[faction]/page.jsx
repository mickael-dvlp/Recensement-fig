"use client";

// ============================================================
// PAGE FACTION — Héros & Guerriers d'une faction
// ============================================================
// Page dynamique accessible depuis /figurines/[faction].
// Affiche la liste des héros puis des guerriers avec :
//   - Compteur +/- pour l'inventaire
//   - Cœur pour marquer comme souhaitée

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Swords } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getInventaireUtilisateur, mettreAJourFigurine } from "@/lib/firestore";
import FACTIONS_DATA from "@/data/factions/index.js";
import FigurineRow from "@/components/figurines/FigurineRow";

export default function PageFaction() {
  const { faction: factionEncodee } = useParams();
  const router = useRouter();
  const { utilisateur } = useAuth();

  const nomFaction = decodeURIComponent(factionEncodee);
  const factionData = FACTIONS_DATA[nomFaction];

  const [inventaire, setInventaire] = useState({});
  const [chargement, setChargement] = useState(true);

  // ---- CHARGEMENT INVENTAIRE ----
  useEffect(() => {
    if (!utilisateur) return;

    async function charger() {
      const inv = await getInventaireUtilisateur(utilisateur.uid);
      setInventaire(inv);
      setChargement(false);
    }

    charger();

    // Recharge si l'utilisateur revient sur l'onglet (ex: retour depuis une autre page)
    window.addEventListener("focus", charger);
    return () => window.removeEventListener("focus", charger);
  }, [utilisateur]);

  // ---- MISE À JOUR FIGURINE ----
  const mettreAJour = useCallback(
    async (figurineId, data) => {
      if (!utilisateur) return;

      // Optimistic update local
      setInventaire((prev) => ({
        ...prev,
        [figurineId]: {
          ...(prev[figurineId] ?? {}),
          ...data,
        },
      }));

      await mettreAJourFigurine(utilisateur.uid, figurineId, data);
    },
    [utilisateur]
  );

  // ---- FACTION INCONNUE ----
  if (!factionData) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center gap-4 px-8">
        <Swords size={40} className="text-[#3A3A3A]" />
        <p className="text-[#6B6B6B] text-center text-sm">
          Faction &quot;{nomFaction}&quot; non encore disponible.
        </p>
        <button
          onClick={() => router.back()}
          className="text-xs text-[#C9A227] underline underline-offset-2"
        >
          Retour
        </button>
      </div>
    );
  }

  const { heros, guerriers } = factionData;

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Ligne dorée */}
      <div className="h-0.5 bg-linear-to-r from-transparent via-[#C9A227] to-transparent" />

      {/* EN-TÊTE */}
      <div className="sticky top-0 z-40 bg-[#0D0D0D] border-b border-[#2A2A2A]">
        <div className="relative pt-6 pb-4 text-center">
          {/* Bouton retour */}
          <button
            onClick={() => router.back()}
            className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[#6B6B6B] hover:text-[#C9A227] transition-colors text-xs"
          >
            <ChevronLeft size={14} />
            Retour à la page Figurine
          </button>

          <h1 className="text-xl font-bold text-[#F5F5F5] uppercase tracking-widest">
            {nomFaction}
          </h1>
          {!chargement && (
            <p className="text-[#6B6B6B] text-xs mt-1">
              {heros.length} héros · {guerriers.length} guerriers
            </p>
          )}
        </div>
      </div>

      {/* CONTENU */}
      <div className="pb-10">
        {chargement ? (
          <div className="flex flex-col gap-2 pt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-12 bg-[#1A1A1A] rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            {/* HÉROS */}
            <div className="pt-6 pb-2">
              <h2 className="text-[#C9A227] text-xs font-bold uppercase tracking-widest mb-3">
                Héros
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {heros.map((fig) => (
                  <FigurineRow
                    key={fig.id}
                    figurine={fig}
                    donneesUtilisateur={inventaire[fig.id]}
                    onMettreAJour={mettreAJour}
                  />
                ))}
              </div>
            </div>

            {/* Séparateur */}
            <div className="h-px bg-[#2A2A2A] my-6" />

            {/* GUERRIERS */}
            <div className="pb-2">
              <h2 className="text-[#C9A227] text-xs font-bold uppercase tracking-widest mb-3">
                Guerriers
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {guerriers.map((fig) => (
                  <FigurineRow
                    key={fig.id}
                    figurine={fig}
                    donneesUtilisateur={inventaire[fig.id]}
                    onMettreAJour={mettreAJour}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
