"use client";

// ============================================================
// PAGE ACCUEIL - Tableau de bord
// ============================================================
// Affiche un résumé de la collection de l'utilisateur :
//   - Total de figurines possédées
//   - Total souhaitées
//   - Total en projet
//   - Répartition par faction

import { useEffect, useState } from "react";
import Image from "next/image";
import { Shield, ShoppingCart, Sword, Users } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getInventaireUtilisateur } from "@/lib/firestore";
import { FACTIONS_BIEN, FACTIONS_MAL } from "@/data/figurines/index.js";
import { getAllFigurines } from "@/data/factions/index.js";

// Icône placeholder par faction — remplace le SVG par l'icône de la faction souhaitée
const ICONES_FACTION = {};

function IconeFaction({ faction }) {
  const icone = ICONES_FACTION[faction];
  if (icone) return icone;
  // Icône générique par défaut (bouclier)
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

/**
 * Carte de statistique réutilisable — contenu centré
 */
function CarteStatistique({ icone, label, valeur, couleur }) {
  return (
    <div className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 flex flex-col items-center gap-2">
      {/* Icône colorée */}
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center ${couleur}`}
      >
        {icone}
      </div>
      {/* Valeur numérique en grand */}
      <p className="text-2xl font-bold text-[#F5F5F5]">{valeur}</p>
      {/* Label descriptif */}
      <p className="text-[#6B6B6B] text-xs uppercase tracking-wide text-center">
        {label}
      </p>
    </div>
  );
}

export default function PageAccueil() {
  const { utilisateur, profil } = useAuth();

  // Stats calculées depuis l'inventaire Firestore
  const [stats, setStats] = useState({
    totalPossedees: 0,
    totalSouhaitees: 0,
    enProjet: 0,
    parFaction: {},
  });
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    if (!utilisateur) return;

    async function chargerStats() {
      // Récupère toutes les données d'inventaire de l'utilisateur
      const inventaire = await getInventaireUtilisateur(utilisateur.uid);

      let totalPossedees = 0;
      let totalSouhaitees = 0;
      let enProjet = 0;
      const parFaction = {};

      for (const figurine of getAllFigurines()) {
        const donnees = inventaire[figurine.id];
        if (!donnees) continue;

        if (donnees.enInventaire) {
          const qte = donnees.quantiteInventaire || 0;
          totalPossedees += qte;
          // Compte par faction
          parFaction[figurine.faction] =
            (parFaction[figurine.faction] || 0) + qte;
        }
        if (donnees.souhaite) {
          totalSouhaitees += donnees.quantiteSouhaitee || 0;
        }
        if (donnees.enProjet) {
          enProjet += 1;
        }
      }

      setStats({ totalPossedees, totalSouhaitees, enProjet, parFaction });
      setChargement(false);
    }

    chargerStats();
  }, [utilisateur]);

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* BANDEAU CENTRÉ */}
      <div className=" border-b border-[#2A2A2A] flex justify-center">
        <Image
          src="/image/mesbg_header.jpg"
          alt="MESBG Header"
          width={0}
          height={0}
          sizes="50vw"
          className="w-1/2 h-auto"
          priority
        />
      </div>

      {/* CONTENU — 32px de padding gauche/droite */}
      <div className="py-6 flex flex-col gap-6">
        {/* STATISTIQUES PRINCIPALES */}
        <section>
          {chargement ? (
            // Skeleton de chargement
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 h-28 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="flex gap-3">
              <CarteStatistique
                icone={<Shield size={18} className="text-[#22C55E]" />}
                label="Possédées"
                valeur={stats.totalPossedees}
                couleur="bg-[#22C55E]/10"
              />
              <CarteStatistique
                icone={<ShoppingCart size={18} className="text-[#C9A227]" />}
                label="Souhaitées"
                valeur={stats.totalSouhaitees}
                couleur="bg-[#C9A227]/10"
              />
              <CarteStatistique
                icone={<Sword size={18} className="text-blue-400" />}
                label="En projet"
                valeur={stats.enProjet}
                couleur="bg-blue-400/10"
              />
            </div>
          )}
        </section>

        {/* RÉPARTITION PAR FACTION */}
        <section>
          {/* --- BIEN --- */}
          <h2 className="text-[#C9A227] text-2xl font-bold uppercase tracking-widest text-center mb-4">
            Bien
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FACTIONS_BIEN.map((faction) => (
              <div
                key={faction}
                className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 flex flex-col items-center justify-center gap-3 min-h-24"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#6B6B6B] shrink-0">
                    <IconeFaction faction={faction} />
                  </span>
                  <span className="text-[#D4D4D4] text-sm font-bold uppercase tracking-wide text-center">
                    {faction}
                  </span>
                </div>
                <span className="text-[#6B6B6B] text-lg font-semibold">
                  {chargement ? "…" : stats.parFaction[faction] || 0}
                </span>
              </div>
            ))}
          </div>

          {/* Séparateur */}
          <div className="h-0.5 bg-linear-to-r from-transparent via-[#C9A227] to-transparent my-8" />

          {/* --- MAL --- */}
          <h2 className="text-[#C9A227] text-2xl font-bold uppercase tracking-widest text-center mb-4 pt-3">
            Mal
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FACTIONS_MAL.map((faction) => (
              <div
                key={faction}
                className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 flex flex-col items-center justify-center gap-3 min-h-24"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#6B6B6B] shrink-0">
                    <IconeFaction faction={faction} />
                  </span>
                  <span className="text-[#D4D4D4] text-sm font-bold uppercase tracking-wide text-center">
                    {faction}
                  </span>
                </div>
                <span className="text-[#6B6B6B] text-lg font-semibold">
                  {chargement ? "…" : stats.parFaction[faction] || 0}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* PLACEHOLDER RAPPORTS DE BATAILLE (à venir) */}
        <section>
          <h2 className="text-[#C9A227] text-sm font-bold uppercase tracking-widest mb-4">
            Rapports de bataille
          </h2>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] border-dashed rounded-2xl p-6 flex flex-col items-center gap-2">
            <Users size={32} className="text-[#3A3A3A]" />
            <p className="text-[#6B6B6B] text-sm text-center">
              Les rapports de bataille arrivent bientôt !
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
