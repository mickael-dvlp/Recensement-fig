"use client";

// ============================================================
// PAGE PROJET - Figurines en cours de peinture
// ============================================================
// Affiche toutes les figurines marquées "enProjet" par l'utilisateur.
// L'utilisateur peut retirer une figurine du projet en cliquant sur
// le bouton corbeille.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Sword, Trash2, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getInventaireUtilisateur, mettreAJourFigurine } from "@/lib/firestore";
import { getAllFigurines } from "@/data/factions/index.js";

export default function PageProjet() {
  const { utilisateur } = useAuth();
  const router = useRouter();

  const [enProjet, setEnProjet] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(false);

  // ---- CHARGEMENT ----
  useEffect(() => {
    if (!utilisateur) return;

    async function charger() {
      try {
        const inventaire = await getInventaireUtilisateur(utilisateur.uid);

        const projetFigurines = getAllFigurines()
          .filter((fig) => inventaire[fig.id]?.enProjet)
          .map((fig) => ({ ...fig, utilisateur: inventaire[fig.id] }));

        setEnProjet(projetFigurines);
      } catch (e) {
        console.error("Erreur chargement projet :", e);
        setErreur(true);
      } finally {
        setChargement(false);
      }
    }

    charger();
  }, [utilisateur]);

  /**
   * Retire une figurine du projet en cours
   */
  async function retirerDuProjet(figurineId) {
    if (!utilisateur) return;

    await mettreAJourFigurine(utilisateur.uid, figurineId, { enProjet: false });

    // Mise à jour locale
    setEnProjet((prev) => prev.filter((f) => f.id !== figurineId));
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] pb-10 px-4 w-full">
      {/* Ligne dorée */}
      <div className="h-0.5 bg-linear-to-r from-transparent via-[#C9A227] to-transparent" />

      {/* EN-TÊTE : titre centré + bouton absolu à droite */}
      <div className="relative pt-6 pb-4 text-center">
        <h1 className="text-2xl font-extrabold text-[#F5F5F5] uppercase tracking-widest">
          Projet en cours
        </h1>
        <p className="text-[#6B6B6B] text-xs mt-1">
          {chargement
            ? "…"
            : `${enProjet.length} figurine${enProjet.length > 1 ? "s" : ""} à peindre`}
        </p>

        <button
          onClick={() => router.push("/figurines")}
          aria-label="Ajouter des figurines au projet"
          className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#C9A227] flex items-center justify-center hover:bg-[#E6C25A] transition-all"
        >
          <Plus size={20} className="text-[#0D0D0D]" />
        </button>
      </div>

      {/* CONTENU */}
      <div className="flex-1 py-4">
        {chargement ? (
          // Skeleton de chargement
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-[#1A1A1A] rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : erreur ? (
          // État d'erreur
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-20 h-20 rounded-full bg-[#1A1A1A] border border-red-900/50 flex items-center justify-center">
              <Sword size={36} className="text-red-500/50" />
            </div>
            <div className="text-center">
              <p className="text-[#D4D4D4] font-semibold mb-1">
                Impossible de charger le projet
              </p>
              <p className="text-[#6B6B6B] text-sm">
                Une erreur est survenue. Réessaie dans un instant.
              </p>
            </div>
          </div>
        ) : enProjet.length === 0 ? (
          // État vide
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-20 h-20 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center">
              <Sword size={36} className="text-[#3A3A3A]" />
            </div>
            <div className="text-center">
              <p className="text-[#D4D4D4] font-semibold mb-1">
                Aucun projet en cours
              </p>
              <p className="text-[#6B6B6B] text-sm">
                Ajoute des figurines à peindre depuis l&apos;onglet Figurines.
              </p>
            </div>
          </div>
        ) : (
          // Liste des figurines en projet
          <div className="flex flex-col gap-3">
            {enProjet.map((figurine) => (
              <div
                key={figurine.id}
                className="flex items-center gap-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-3"
              >
                {/* Image de la figurine */}
                <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-[#0D0D0D] border border-[#3A3A3A]">
                  <Image
                    src={figurine.image}
                    alt={figurine.nom}
                    fill
                    className="object-contain p-1"
                  />
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <p className="text-[#F5F5F5] font-bold text-sm truncate">
                    {figurine.nom}
                  </p>
                  <p className="text-[#6B6B6B] text-xs uppercase tracking-wide mt-0.5">
                    {figurine.faction}
                  </p>
                  {/* Badge "En cours" animé */}
                  <div className="inline-flex items-center gap-1 mt-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-2 py-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-blue-400 text-[10px] font-semibold uppercase">
                      En cours
                    </span>
                  </div>
                </div>

                {/* Bouton retirer du projet */}
                <button
                  onClick={() => retirerDuProjet(figurine.id)}
                  aria-label="Retirer du projet"
                  className="w-9 h-9 rounded-full bg-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:bg-red-900/30 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
