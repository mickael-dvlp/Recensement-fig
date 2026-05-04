"use client";

// ============================================================
// FIGURINE MODEL CARD — Carte d'une figurine dans une page de faction
// ============================================================
// Affiche une carte avec placeholder image, nom, bouton Ajouter/compteur
// et cœur pour souhaitée. Style inspiré du catalogue officiel GW.

import { Heart, Plus, Minus } from "lucide-react";
import { useState } from "react";

export default function FigurineRow({ figurine, donneesUtilisateur, onMettreAJour }) {
  const quantite = donneesUtilisateur?.quantiteInventaire ?? 0;
  const souhaite = donneesUtilisateur?.souhaite ?? false;
  const [compteurVisible, setCompteurVisible] = useState(quantite > 0);

  async function ajouterAInventaire() {
    setCompteurVisible(true);
    await onMettreAJour(figurine.id, {
      enInventaire: true,
      quantiteInventaire: 1,
    });
  }

  async function modifierQuantite(delta) {
    const nouvelleQuantite = Math.max(0, quantite + delta);
    if (nouvelleQuantite === 0) setCompteurVisible(false);
    await onMettreAJour(figurine.id, {
      enInventaire: nouvelleQuantite > 0,
      quantiteInventaire: nouvelleQuantite,
    });
  }

  async function toggleSouhaite() {
    await onMettreAJour(figurine.id, { souhaite: !souhaite });
  }

  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden flex flex-col hover:border-[#3A3A3A] transition-colors">

      {/* Image placeholder — remplacé par <Image> plus tard */}
      <div className="w-full aspect-square bg-[#0D0D0D] flex items-center justify-center overflow-hidden">
        {figurine.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={figurine.image}
            alt={figurine.nom}
            className="max-w-full max-h-full object-contain p-3"
          />
        ) : (
          <div className="w-12 h-12 rounded-full border border-[#2A2A2A] bg-[#1A1A1A]" />
        )}
      </div>

      {/* Infos */}
      <div className="flex flex-col gap-2 px-2 py-2 flex-1">
        {/* Nom */}
        <p className="text-[#F5F5F5] font-bold text-sm leading-snug text-center">
          {figurine.nom}
        </p>

        {/* Actions : bouton + cœur */}
        <div className="flex items-center gap-2 mt-auto pt-1">
          {compteurVisible ? (
            /* Compteur +/- */
            <div className="flex-1 flex items-center justify-between bg-[#0D0D0D] border border-[#3A3A3A] rounded-full px-3 py-1.5">
              <button
                onClick={() => modifierQuantite(-1)}
                className="text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
                aria-label="Réduire"
              >
                <Minus size={13} />
              </button>
              <span className="text-[#F5F5F5] font-bold text-sm min-w-[20px] text-center">
                {quantite}
              </span>
              <button
                onClick={() => modifierQuantite(1)}
                className="text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
                aria-label="Augmenter"
              >
                <Plus size={13} />
              </button>
            </div>
          ) : (
            /* Bouton Ajouter */
            <button
              onClick={ajouterAInventaire}
              className="flex-1 flex items-center justify-center gap-1.5 border border-[#3A3A3A] rounded-full py-1.5 text-xs text-[#6B6B6B] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors"
            >
              <Plus size={12} />
              Ajouter
            </button>
          )}

          {/* Cœur */}
          <button
            onClick={toggleSouhaite}
            aria-label={souhaite ? "Retirer des souhaités" : "Ajouter aux souhaités"}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-[#2A2A2A] hover:border-[#3A3A3A] transition-colors"
          >
            <Heart
              size={15}
              className={souhaite ? "fill-red-500 text-red-500" : "text-[#3A3A3A] hover:text-[#6B6B6B]"}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
