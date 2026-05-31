"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Shield, ImageOff, ImageIcon, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getInventaireUtilisateur, getAmis } from "@/lib/firestore";
import { getAllFigurines } from "@/data/factions/index.js";
import { FACTIONS_BIEN, FACTIONS_MAL, FACTIONS_BIEN_GROUPES, FACTIONS_MAL_GROUPES } from "@/data/figurines/index.js";
import TOUS_LES_HEROS from "@/data/heros/index.js";

export default function PageCollectionAmi() {
  const { amiUid } = useParams();
  const { utilisateur } = useAuth();
  const router = useRouter();

  const [profilAmi, setProfilAmi] = useState(null);
  const [inventaire, setInventaire] = useState({});
  const [autorise, setAutorise] = useState(false);
  const [chargement, setChargement] = useState(true);
  const [showImages, setShowImages] = useState(true);
  const [factionsOuvertes, setFactionsOuvertes] = useState(new Set());
  const [erreur, setErreur] = useState(null);

  function toggleFaction(faction) {
    setFactionsOuvertes((prev) => {
      const next = new Set(prev);
      if (next.has(faction)) next.delete(faction);
      else next.add(faction);
      return next;
    });
  }

  useEffect(() => {
    if (!utilisateur || !amiUid) return;

    async function charger() {
      try {
        const amis = await getAmis(utilisateur.uid);
        const relation = amis.find((a) => a.id === amiUid && a.statut === "accepté");
        if (!relation) {
          setAutorise(false);
          setChargement(false);
          return;
        }
        setAutorise(true);
        const inv = await getInventaireUtilisateur(amiUid);
        setProfilAmi({ pseudo: relation.pseudo });
        setInventaire(inv);
        setErreur(null);
      } catch (err) {
        console.error("Erreur chargement collection ami :", err);
        setErreur(err.code === "permission-denied"
          ? "Accès refusé : les règles Firestore bloquent la lecture de l'inventaire."
          : err.message);
      } finally {
        setChargement(false);
      }
    }

    charger();
    window.addEventListener("focus", charger);
    return () => window.removeEventListener("focus", charger);
  }, [utilisateur, amiUid]);

  if (chargement) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-[#2A2A2A] border-t-[#C9A227] rounded-full animate-spin" />
      </div>
    );
  }

  if (!autorise) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-[60vh]">
        <Shield size={40} className="text-[#3A3A3A]" />
        <p className="text-[#6B6B6B] text-sm text-center">
          Tu n'as pas accès à cette collection.
        </p>
        {erreur && (
          <p className="text-red-400 text-xs text-center px-4">{erreur}</p>
        )}
        <button onClick={() => router.push("/amis")} className="text-[#C9A227] text-sm font-semibold hover:underline">
          Retour aux amis
        </button>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-[60vh]">
        <Shield size={40} className="text-[#3A3A3A]" />
        <p className="text-red-400 text-sm text-center px-4">{erreur}</p>
        <button onClick={() => router.push("/amis")} className="text-[#C9A227] text-sm font-semibold hover:underline">
          Retour aux amis
        </button>
      </div>
    );
  }

  // Construire la map faction → figurines avec inventaire (IDs factions, ex: "cth-h-005")
  const toutes = getAllFigurines();
  const factionsData = {};
  toutes.forEach((fig) => {
    const id = fig.inventaireId ?? fig.id;
    const inv = inventaire[id];
    if (inv?.enInventaire && (inv.quantiteInventaire || 0) > 0) {
      if (!factionsData[fig.faction]) factionsData[fig.faction] = [];
      if (!factionsData[fig.faction].some((f) => f.id === id)) {
        factionsData[fig.faction].push({
          id,
          nom: fig.nom,
          image: fig.image,
          quantite: inv.quantiteInventaire || 0,
          peintes: inv.quantitePeinte || 0,
        });
      }
    }
  });

  // Héros ajoutés via /heroes/[hero] (IDs variantes, ex: "bombur-001")
  // Ces IDs ne sont pas dans getAllFigurines(), ils sont gérés séparément.
  const heroesVariantes = [];
  TOUS_LES_HEROS.forEach((hero) => {
    hero.variantes.forEach((variante) => {
      const inv = inventaire[variante.id];
      if (inv?.enInventaire && (inv.quantiteInventaire || 0) > 0) {
        heroesVariantes.push({
          id: variante.id,
          nom: variante.nom,
          image: variante.image,
          quantite: inv.quantiteInventaire || 0,
          peintes: inv.quantitePeinte || 0,
        });
      }
    });
  });
  const totalHeroesVariantes = heroesVariantes.reduce((s, h) => s + h.quantite, 0);
  const peintesHeroesVariantes = heroesVariantes.reduce((s, h) => s + h.peintes, 0);

  const totalBien = FACTIONS_BIEN.reduce(
    (s, f) => s + (factionsData[f]?.reduce((a, fig) => a + fig.quantite, 0) || 0),
    0
  );
  const totalMal = FACTIONS_MAL.reduce(
    (s, f) => s + (factionsData[f]?.reduce((a, fig) => a + fig.quantite, 0) || 0),
    0
  );
  const totalPeintes = Object.values(factionsData).flat().reduce((s, f) => s + f.peintes, 0) + peintesHeroesVariantes;
  const totalGeneral = totalBien + totalMal + totalHeroesVariantes;

  function BlocFactions({ groupes }) {
    return groupes.map((groupe) => {
      const factionsAvecFigs = groupe.factions.filter((f) => factionsData[f]?.length);
      if (factionsAvecFigs.length === 0) return null;
      return (
        <div key={groupe.titre} className="flex flex-col gap-3">
          <h3 className="text-[#6B6B6B] text-[10px] font-bold uppercase tracking-widest">
            {groupe.titre}
          </h3>
          {factionsAvecFigs.map((faction) => {
            const figs = factionsData[faction];
            const totalFaction = figs.reduce((s, f) => s + f.quantite, 0);
            const peintesFaction = figs.reduce((s, f) => s + f.peintes, 0);
            return (
              <div key={faction} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden">
                {/* En-tête faction */}
                <button
                  onClick={() => toggleFaction(faction)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-[#222222] ${factionsOuvertes.has(faction) ? "border-b border-[#2A2A2A]" : ""}`}
                >
                  <ChevronDown
                    size={14}
                    className={`text-[#6B6B6B] shrink-0 transition-transform duration-200 ${factionsOuvertes.has(faction) ? "" : "-rotate-90"}`}
                  />
                  <span className="flex-1 text-[#D4D4D4] text-sm font-bold">{faction}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#C9A227] font-bold text-sm">{totalFaction}</span>
                    {peintesFaction > 0 && (
                      <span className="text-[10px] text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-full px-2 py-0.5 font-semibold">
                        {peintesFaction} peinte{peintesFaction > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </button>

                {/* Liste des figurines */}
                {factionsOuvertes.has(faction) && (
                  <div className="flex flex-col">
                    {figs.map((fig, i) => (
                      <div
                        key={fig.id}
                        className={`flex items-center gap-3 px-4 py-2.5 ${i < figs.length - 1 ? "border-b border-[#1E1E1E]" : ""}`}
                      >
                        {/* Image (conditionnelle) */}
                        {showImages && (
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#0D0D0D] shrink-0 border border-[#2A2A2A]">
                            {fig.image ? (
                              <Image
                                src={fig.image}
                                alt={fig.nom}
                                fill
                                className="object-contain p-0.5"
                                sizes="40px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Shield size={16} className="text-[#3A3A3A]" />
                              </div>
                            )}
                          </div>
                        )}

                        {/* Nom */}
                        <span className="flex-1 text-[#D4D4D4] text-xs leading-tight">{fig.nom}</span>

                        {/* Stats */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[#C9A227] font-bold text-sm">{fig.quantite}</span>
                          {fig.peintes > 0 && (
                            <span className="text-[10px] text-[#22C55E] font-semibold">
                              / {fig.peintes}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    });
  }

  return (
    <div className="flex flex-col gap-6 py-6">
      {/* EN-TÊTE */}
      <div className="flex items-start gap-3">
        <button
          onClick={() => router.push("/amis")}
          className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors shrink-0 mt-1"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-[#F5F5F5] text-xl font-bold">{profilAmi?.pseudo}</h1>
          <div className="flex items-center gap-3 mt-0.5">
            <p className="text-[#6B6B6B] text-xs">
              {totalGeneral} figurine{totalGeneral > 1 ? "s" : ""}
            </p>
            {totalPeintes > 0 && (
              <p className="text-[#22C55E] text-xs font-semibold">
                {totalPeintes} peinte{totalPeintes > 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
        {/* Toggle images */}
        <button
          onClick={() => setShowImages((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 mt-0.5 ${
            showImages
              ? "bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/30"
              : "bg-[#2A2A2A] text-[#6B6B6B] border border-[#2A2A2A] hover:text-[#D4D4D4]"
          }`}
        >
          {showImages ? <ImageIcon size={13} /> : <ImageOff size={13} />}
          Images
        </button>
      </div>

      {totalGeneral === 0 ? (
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] border-dashed rounded-2xl p-10 flex flex-col items-center gap-2">
          <Shield size={36} className="text-[#3A3A3A]" />
          <p className="text-[#6B6B6B] text-sm text-center">Aucune figurine en collection.</p>
        </div>
      ) : (
        <>
          {/* HÉROS (ajoutés via /heroes/[hero]) */}
          {totalHeroesVariantes > 0 && (
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[#C9A227] text-sm font-bold uppercase tracking-widest">Héros</h2>
                <span className="text-[#6B6B6B] text-xs font-semibold">{totalHeroesVariantes} fig.</span>
              </div>
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleFaction("__heroes__")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-[#222222] ${factionsOuvertes.has("__heroes__") ? "border-b border-[#2A2A2A]" : ""}`}
                >
                  <ChevronDown
                    size={14}
                    className={`text-[#6B6B6B] shrink-0 transition-transform duration-200 ${factionsOuvertes.has("__heroes__") ? "" : "-rotate-90"}`}
                  />
                  <span className="flex-1 text-[#D4D4D4] text-sm font-bold">Variantes de héros</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#C9A227] font-bold text-sm">{totalHeroesVariantes}</span>
                    {peintesHeroesVariantes > 0 && (
                      <span className="text-[10px] text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-full px-2 py-0.5 font-semibold">
                        {peintesHeroesVariantes} peinte{peintesHeroesVariantes > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </button>
                {factionsOuvertes.has("__heroes__") && (
                  <div className="flex flex-col">
                    {heroesVariantes.map((fig, i) => (
                      <div
                        key={fig.id}
                        className={`flex items-center gap-3 px-4 py-2.5 ${i < heroesVariantes.length - 1 ? "border-b border-[#1E1E1E]" : ""}`}
                      >
                        {showImages && (
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#0D0D0D] shrink-0 border border-[#2A2A2A]">
                            {fig.image ? (
                              <Image src={fig.image} alt={fig.nom} fill className="object-contain p-0.5" sizes="40px" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Shield size={16} className="text-[#3A3A3A]" />
                              </div>
                            )}
                          </div>
                        )}
                        <span className="flex-1 text-[#D4D4D4] text-xs leading-tight">{fig.nom}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[#C9A227] font-bold text-sm">{fig.quantite}</span>
                          {fig.peintes > 0 && (
                            <span className="text-[10px] text-[#22C55E] font-semibold">/ {fig.peintes}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {totalHeroesVariantes > 0 && (totalBien > 0 || totalMal > 0) && (
            <div className="h-px bg-linear-to-r from-transparent via-[#C9A227] to-transparent" />
          )}

          {/* CAMP DU BIEN */}
          {totalBien > 0 && (
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[#C9A227] text-sm font-bold uppercase tracking-widest">Bien</h2>
                <span className="text-[#6B6B6B] text-xs font-semibold">{totalBien} fig.</span>
              </div>
              <BlocFactions groupes={FACTIONS_BIEN_GROUPES} />
            </section>
          )}

          {totalBien > 0 && totalMal > 0 && (
            <div className="h-px bg-linear-to-r from-transparent via-[#C9A227] to-transparent" />
          )}

          {/* CAMP DU MAL */}
          {totalMal > 0 && (
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[#C9A227] text-sm font-bold uppercase tracking-widest">Mal</h2>
                <span className="text-[#6B6B6B] text-xs font-semibold">{totalMal} fig.</span>
              </div>
              <BlocFactions groupes={FACTIONS_MAL_GROUPES} />
            </section>
          )}
        </>
      )}
    </div>
  );
}
