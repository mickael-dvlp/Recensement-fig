"use client";

// ============================================================
// PAGE FACTION — Héros & Guerriers d'une faction
// ============================================================

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Swords } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  getInventaireUtilisateur,
  mettreAJourFigurine,
  getFigurinesCustom,
  creerFigurineCustom,
  supprimerFigurineCustom,
} from "@/lib/firestore";
import FACTIONS_DATA from "@/data/factions/index.js";
import FigurineRow from "@/components/figurines/FigurineRow";
import CarteAjoutCustom from "@/components/figurines/CarteAjoutCustom";

export default function PageFaction() {
  const { faction: factionEncodee } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const filtre = searchParams.get("filtre");
  const { utilisateur } = useAuth();

  const nomFaction = decodeURIComponent(factionEncodee);
  const factionData = FACTIONS_DATA[nomFaction];

  const [inventaire, setInventaire] = useState({});
  const [figurinesCustom, setFigurinesCustom] = useState([]);
  const [chargement, setChargement] = useState(true);

  // ---- CHARGEMENT ----
  useEffect(() => {
    if (!utilisateur) return;

    async function charger() {
      const [inv, customs] = await Promise.all([
        getInventaireUtilisateur(utilisateur.uid),
        getFigurinesCustom(utilisateur.uid),
      ]);
      setInventaire(inv);
      setFigurinesCustom(customs.filter((c) => c.faction === nomFaction));
      setChargement(false);
    }

    charger();
    window.addEventListener("focus", charger);
    return () => window.removeEventListener("focus", charger);
  }, [utilisateur, nomFaction]);

  // ---- MISE À JOUR INVENTAIRE ----
  const mettreAJour = useCallback(
    async (figurineId, data) => {
      if (!utilisateur) return;
      setInventaire((prev) => ({
        ...prev,
        [figurineId]: { ...(prev[figurineId] ?? {}), ...data },
      }));
      await mettreAJourFigurine(utilisateur.uid, figurineId, data);
    },
    [utilisateur]
  );

  // ---- AJOUT FIGURINE CUSTOM ----
  const ajouterCustom = useCallback(
    async ({ nom, faction, section, file }) => {
      if (!utilisateur) return;
      const nouvelle = await creerFigurineCustom(utilisateur.uid, { nom, faction, section, file });
      setFigurinesCustom((prev) => [...prev, nouvelle]);
    },
    [utilisateur]
  );

  // ---- SUPPRESSION FIGURINE CUSTOM ----
  const supprimerCustom = useCallback(
    async (id) => {
      if (!utilisateur) return;
      setFigurinesCustom((prev) => prev.filter((c) => c.id !== id));
      setInventaire((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      await supprimerFigurineCustom(utilisateur.uid, id);
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

  function filtrerFigs(liste) {
    if (!filtre) return liste;
    return liste.filter((fig) => {
      const inv = inventaire[fig.inventaireId ?? fig.id];
      if (filtre === "inventaire") return (inv?.quantiteInventaire ?? 0) > 0;
      if (filtre === "souhaite") return inv?.souhaite === true;
      return true;
    });
  }

  function filtrerCustom(section) {
    let liste = figurinesCustom.filter((c) => c.section === section);
    if (!filtre) return liste;
    return liste.filter((c) => {
      const inv = inventaire[c.id];
      if (filtre === "inventaire") return (inv?.quantiteInventaire ?? 0) > 0;
      if (filtre === "souhaite") return inv?.souhaite === true;
      return false;
    });
  }

  const herosFiltres = filtrerFigs(heros);
  const guerriersFiltres = filtrerFigs(guerriers);
  const herosCustomFiltres = filtrerCustom("heros");
  const guerriersCustomFiltres = filtrerCustom("guerriers");

  const totalHeros = herosFiltres.length + herosCustomFiltres.length;
  const totalGuerriers = guerriersFiltres.length + guerriersCustomFiltres.length;

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Ligne dorée */}
      <div className="h-0.5 bg-linear-to-r from-transparent via-[#C9A227] to-transparent" />

      {/* EN-TÊTE */}
      <div className="sticky top-0 z-40 bg-[#0D0D0D] border-b border-[#2A2A2A]">
        <div className="flex items-center gap-2 pt-6 pb-4 px-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-[#6B6B6B] hover:text-[#C9A227] transition-colors shrink-0"
          >
            <ChevronLeft size={18} />
            <span className="hidden sm:inline text-xs">Retour à la page Figurine</span>
          </button>

          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold text-[#F5F5F5] uppercase tracking-widest">
              {nomFaction}
            </h1>
            {!chargement && (
              <p className="text-[#6B6B6B] text-xs mt-1">
                {totalHeros} héros · {totalGuerriers} guerriers
                {filtre && (
                  <span className="ml-2 text-[#C9A227]">
                    — {filtre === "inventaire" ? "Inventaire" : "Souhaitées"}
                  </span>
                )}
              </p>
            )}
          </div>

          <div className="w-4.5 shrink-0" />
        </div>
      </div>

      {/* CONTENU */}
      <div className="pb-10">
        {chargement ? (
          <div className="flex flex-col gap-2 pt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-[#1A1A1A] rounded-xl animate-pulse" />
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
                {herosFiltres.map((fig) => (
                  <FigurineRow
                    key={fig.id}
                    figurine={fig}
                    donneesUtilisateur={inventaire[fig.inventaireId ?? fig.id]}
                    onMettreAJour={mettreAJour}
                  />
                ))}
                {herosCustomFiltres.map((fig) => (
                  <FigurineRow
                    key={fig.id}
                    figurine={{ id: fig.id, nom: fig.nom, image: fig.imageUrl }}
                    donneesUtilisateur={inventaire[fig.id]}
                    onMettreAJour={mettreAJour}
                    onSupprimer={() => supprimerCustom(fig.id)}
                  />
                ))}
                {/* Carte ajout — masquée si un filtre est actif */}
                {!filtre && (
                  <CarteAjoutCustom
                    faction={nomFaction}
                    section="heros"
                    onAjouter={ajouterCustom}
                  />
                )}
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
                {guerriersFiltres.map((fig) => (
                  <FigurineRow
                    key={fig.id}
                    figurine={fig}
                    donneesUtilisateur={inventaire[fig.inventaireId ?? fig.id]}
                    onMettreAJour={mettreAJour}
                  />
                ))}
                {guerriersCustomFiltres.map((fig) => (
                  <FigurineRow
                    key={fig.id}
                    figurine={{ id: fig.id, nom: fig.nom, image: fig.imageUrl }}
                    donneesUtilisateur={inventaire[fig.id]}
                    onMettreAJour={mettreAJour}
                    onSupprimer={() => supprimerCustom(fig.id)}
                  />
                ))}
                {!filtre && (
                  <CarteAjoutCustom
                    faction={nomFaction}
                    section="guerriers"
                    onAjouter={ajouterCustom}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
