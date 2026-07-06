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
import Link from "next/link";
import { Shield, Heart, Sword, Users } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getInventaireUtilisateur, getFigurinesCustom, getMemos } from "@/lib/firestore";
import { FACTIONS_BIEN, FACTIONS_MAL } from "@/data/figurines/index.js";
import { getAllFigurines } from "@/data/factions/index.js";
import TOUS_LES_HEROS from "@/data/heros/index.js";

const IMAGES_FACTIONS = {
  // Camp du Bien
  "La Communauté de l'Anneau":  "/images/accueil/communaute.avif",
  "La Compagnie de Thorin":     "/images/accueil/compagnie_de_thorin.avif",
  "Le Conseil Blanc":           "/images/accueil/conseil-blanc.avif",
  "La Comté":                   "/images/accueil/comte.avif",
  "L'Eriador":                  "/images/accueil/eriador.avif",
  "Fangorn":                    "/images/accueil/fangorn.avif",
  "Les Monts Brumeux":          "/images/accueil/mont-brumeux.avif",
  "Le Carrock":                 "/images/accueil/carrock.avif",
  "Drúadan":                    "/images/accueil/druadan.avif",
  "Dunharrow":                  "/images/accueil/dunharrow.avif",
  "Númenor":                    "/images/accueil/numenor.avif",
  "L'Arnor":                    "/images/accueil/arnor.avif",
  "Le Gondor":                  "/images/accueil/gondor.avif",
  "Les Fiefs du Gondor":        "/images/accueil/fief-du-gondor.avif",
  "Le Rohan":                   "/images/accueil/rohan.avif",
  "Dale":                       "/images/accueil/dale.avif",
  "Fondcombe":                  "/images/accueil/fondcombe.avif",
  "La Lothlórien":              "/images/accueil/lothlorien.avif",
  "La Forêt Noire":             "/images/accueil/foret-noire.avif",
  "Khazad-dûm":                 "/images/accueil/khazad-dum.avif",
  "Les Monts de Fer":           "/images/accueil/mont-de-fer.avif",
  "Erebor":                     "/images/accueil/erebor.avif",
  "Erebor Reconquis":           "/images/accueil/erebor-reconquis.avif",
  "Erebor Restauré":            "/images/accueil/erebor-restaure.avif",
  // Camp du Mal
  "Barad-Dûr":                              "/images/accueil/barad-dur.avif",
  "Mordor":                                 "/images/accueil/mordor.avif",
  "Angmar":                                 "/images/accueil/angmar.avif",
  "Puissances Obscures de Dol Guldur":      "/images/accueil/dol-guldur.avif",
  "La Légion d'Azog":                       "/images/accueil/legion-d-azog.avif",
  "Les Chasseurs d'Azog":                   "/images/accueil/chasseur-d-azog.avif",
  "Carn-Dûm":                               "/images/accueil/carn-dum.avif",
  "Horde Serpent":                          "/images/accueil/horde-serpent.avif",
  "Extrême-Harad":                          "/images/accueil/extreme-harad.avif",
  "Khand":                                  "/images/accueil/khand.avif",
  "Les Corsaires d'Umbar":                  "/images/accueil/umbar.avif",
  "Isengard":                               "/images/accueil/isengard.avif",
  "Le Pays de Dun":                         "/images/accueil/pays-de-dun.avif",
  "La Moria":                               "/images/accueil/moria.avif",
  "Goblinville":                            "/images/accueil/goblinville.avif",
  "Les Sinistres Habitants de la Forêt Noire": "/images/accueil/sinistres-habitants.avif",
  "Calamité du Nord":                       "/images/accueil/calamite-du-nord.avif",
  "Lacville":                               "/images/accueil/lacville.avif",
  "Brigands de Sharcoûx":                   "/images/accueil/brigand-de-sharcoux.avif",
  "Trolls des Montagnes":                   "/images/accueil/troll-des-montagnes.avif",
  "Orientaux":                              "/images/accueil/orientaux.avif",
};

/**
 * Carte de statistique réutilisable — contenu centré
 */
function CarteStatistique({ icone, label, valeur, couleur }) {
  return (
    <div className="flex-1 h-28 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
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
  const { utilisateur } = useAuth();

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
      const [inventaire, customs, listeMemos] = await Promise.all([
        getInventaireUtilisateur(utilisateur.uid),
        getFigurinesCustom(utilisateur.uid),
        getMemos(utilisateur.uid),
      ]);

      let totalPossedees = 0;
      let totalSouhaitees = 0;
      const enProjet = listeMemos.length;
      const parFaction = {};

      // Map nom → hero pour lookup rapide des lienHero
      const heroParNom = new Map(TOUS_LES_HEROS.map((h) => [h.nom, h]));
      // Évite le double-comptage dans les totaux (un héros peut apparaître dans plusieurs factions)
      const variantesComptees = new Set();

      for (const figurine of getAllFigurines()) {
        if (figurine.lienHero) {
          // Héro lié à une page héros : compter via les IDs de variantes
          const hero = heroParNom.get(figurine.lienHero);
          if (!hero) continue;
          for (const variante of hero.variantes ?? []) {
            const donnees = inventaire[variante.id];
            if (!donnees) continue;
            if (donnees.enInventaire) {
              const qte = donnees.quantiteInventaire || 0;
              parFaction[figurine.faction] = (parFaction[figurine.faction] || 0) + qte;
              if (!variantesComptees.has(variante.id)) {
                totalPossedees += qte;
                variantesComptees.add(variante.id);
              }
            }
            if (donnees.souhaite && !variantesComptees.has(`${variante.id}_s`)) {
              totalSouhaitees += donnees.quantiteSouhaitee || 0;
              variantesComptees.add(`${variante.id}_s`);
            }
          }
        } else {
          // Figurine classique : utiliser l'ID de l'entrée faction
          const figId = figurine.inventaireId ?? figurine.id;
          const donnees = inventaire[figId];
          if (!donnees) continue;
          if (donnees.enInventaire) {
            const qte = donnees.quantiteInventaire || 0;
            parFaction[figurine.faction] = (parFaction[figurine.faction] || 0) + qte;
            if (!variantesComptees.has(figId)) {
              totalPossedees += qte;
              variantesComptees.add(figId);
            }
          }
          if (donnees.souhaite && !variantesComptees.has(`${figId}_s`)) {
            totalSouhaitees += donnees.quantiteSouhaitee || 0;
            variantesComptees.add(`${figId}_s`);
          }
        }
      }

      // Figurines custom
      for (const fig of customs) {
        const donnees = inventaire[fig.id];
        if (!donnees) continue;
        if (donnees.enInventaire) {
          const qte = donnees.quantiteInventaire || 0;
          totalPossedees += qte;
          parFaction[fig.faction] = (parFaction[fig.faction] || 0) + qte;
        }
        if (donnees.souhaite) {
          totalSouhaitees += donnees.quantiteSouhaitee || 0;
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
          alt="Bannière Middle-Earth Strategy Battle Game"
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
                icone={<Heart size={18} className="text-[#C9A227]" />}
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
            {FACTIONS_BIEN.map((faction) => {
              const img = IMAGES_FACTIONS[faction];
              return (
                <Link
                  key={faction}
                  href={`/figurines/${encodeURIComponent(faction)}`}
                  className="relative overflow-hidden bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 flex flex-col items-center justify-center gap-3 h-28 hover:border-[#C9A227]/50 transition-colors"
                >
                  {img && (
                    <Image
                      src={img}
                      alt=""
                      fill
                      className="object-cover opacity-60"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                  )}
                  <span className="relative text-[#D4D4D4] text-sm font-bold uppercase tracking-wide text-center">
                    {faction}
                  </span>
                  <span className="relative text-[#F5F5F5] text-lg font-semibold text-center">
                    {chargement ? "…" : stats.parFaction[faction] || 0}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Séparateur */}
          <div className="h-0.5 bg-linear-to-r from-transparent via-[#C9A227] to-transparent my-8" />

          {/* --- MAL --- */}
          <h2 className="text-[#C9A227] text-2xl font-bold uppercase tracking-widest text-center mb-4 pt-3">
            Mal
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FACTIONS_MAL.map((faction) => {
              const img = IMAGES_FACTIONS[faction];
              return (
                <Link
                  key={faction}
                  href={`/figurines/${encodeURIComponent(faction)}`}
                  className="relative overflow-hidden bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 flex flex-col items-center justify-center gap-3 h-28 hover:border-[#C9A227]/50 transition-colors"
                >
                  {img && (
                    <Image
                      src={img}
                      alt=""
                      fill
                      className="object-cover opacity-60"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                  )}
                  <span className="relative text-[#D4D4D4] text-sm font-bold uppercase tracking-wide text-center">
                    {faction}
                  </span>
                  <span className="relative text-[#F5F5F5] text-lg font-semibold text-center">
                    {chargement ? "…" : stats.parFaction[faction] || 0}
                  </span>
                </Link>
              );
            })}
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

        {/* AMÉLIORATIONS À VENIR */}
        <section>
          <h2 className="text-[#C9A227] text-sm font-bold uppercase tracking-widest mb-4">
            Améliorations à venir
          </h2>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5 flex flex-col gap-3">
            {[
              "Récapituler les doublons des Héros non nommés et des différentes Bannières",
              "Export de ses figurines Inventaire et/ou Souhaité au format .csv",
              "Rangement des figurines dans un ordre plus logique",
              "Création d'une boite à idée/correction pour signaler les erreurs et améliorer l'utilisation",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#C9A227]/60 shrink-0" />
                <p className="text-[#6B6B6B] text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
