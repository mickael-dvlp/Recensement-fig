"use client";

// ============================================================
// FIGURINE MODEL CARD — Carte d'une figurine dans une page de faction
// ============================================================
// Affiche une carte avec placeholder image, nom, bouton Ajouter/compteur
// et cœur pour souhaitée. Style inspiré du catalogue officiel GW.

import { Heart, Plus, Minus, X, Check } from "lucide-react";
import { useState } from "react";

export default function FigurineRow({
  figurine,
  donneesUtilisateur,
  onMettreAJour,
  onSupprimer,
}) {
  const quantite = donneesUtilisateur?.quantiteInventaire ?? 0;
  const souhaite = donneesUtilisateur?.souhaite ?? false;
  const quantitePeinte = donneesUtilisateur?.quantitePeinte ?? 0;
  const quantiteSouhaitee = donneesUtilisateur?.quantiteSouhaitee ?? 0;
  const [compteurVisible, setCompteurVisible] = useState(quantite > 0);
  const [confirmerSuppression, setConfirmerSuppression] = useState(false);

  async function ajouterAInventaire() {
    setCompteurVisible(true);
    await onMettreAJour(figurine.inventaireId ?? figurine.id, {
      enInventaire: true,
      quantiteInventaire: 1,
    });
  }

  async function modifierQuantite(delta) {
    const nouvelleQuantite = Math.max(0, quantite + delta);
    if (nouvelleQuantite === 0) setCompteurVisible(false);
    const updates = {
      enInventaire: nouvelleQuantite > 0,
      quantiteInventaire: nouvelleQuantite,
    };
    if (quantitePeinte > nouvelleQuantite) {
      updates.quantitePeinte = nouvelleQuantite;
    }
    await onMettreAJour(figurine.inventaireId ?? figurine.id, updates);
  }

  async function modifierQuantitePeinte(delta) {
    const nouvelleQuantite = Math.min(
      quantite,
      Math.max(0, quantitePeinte + delta),
    );
    await onMettreAJour(figurine.inventaireId ?? figurine.id, {
      quantitePeinte: nouvelleQuantite,
    });
  }

  async function modifierQuantiteSouhaitee(delta) {
    const nouvelleQuantite = Math.max(1, quantiteSouhaitee + delta);
    await onMettreAJour(figurine.inventaireId ?? figurine.id, {
      quantiteSouhaitee: nouvelleQuantite,
    });
  }

  async function toggleSouhaite() {
    const newSouhaite = !souhaite;
    const updates = { souhaite: newSouhaite };
    if (newSouhaite && quantiteSouhaitee === 0) updates.quantiteSouhaitee = 1;
    if (!newSouhaite) updates.quantiteSouhaitee = 0;
    await onMettreAJour(figurine.inventaireId ?? figurine.id, updates);
  }

  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden flex flex-col hover:border-[#3A3A3A] transition-colors">
      {/* Image */}
      <div className="w-full aspect-square bg-[#0D0D0D] flex items-center justify-center overflow-hidden relative">
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

        {/* Bouton suppression (custom uniquement) */}
        {onSupprimer && (
          confirmerSuppression ? (
            <div className="absolute top-1.5 right-1.5 flex gap-1">
              <button
                onClick={onSupprimer}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-red-900/60 text-red-400 hover:bg-red-900/80 transition-colors"
                aria-label="Confirmer la suppression"
              >
                <Check size={10} />
              </button>
              <button
                onClick={() => setConfirmerSuppression(false)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-[#2A2A2A] text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
                aria-label="Annuler"
              >
                <X size={10} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmerSuppression(true)}
              className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center rounded-full bg-[#1A1A1A]/80 text-[#6B6B6B] hover:text-red-400 hover:bg-red-900/30 transition-colors"
              aria-label="Supprimer la figurine"
            >
              <X size={10} />
            </button>
          )
        )}
      </div>

      {/* Infos */}
      <div className="flex flex-col gap-2 px-2 py-2 flex-1">
        {/* Nom */}
        <p className="text-[#F5F5F5] font-bold text-sm leading-snug text-center">
          {figurine.nom}
        </p>

        {/* Actions : bouton inventaire + cœur */}
        <div className="flex items-center gap-2 mt-auto pt-1">
          {compteurVisible ? (
            <div className="flex-1 flex items-center justify-between bg-[#0D0D0D] border border-[#3A3A3A] rounded-full px-3 py-1.5">
              <button
                onClick={() => modifierQuantite(-1)}
                className="text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
                aria-label="Réduire"
              >
                <Minus size={13} />
              </button>
              <span className="text-[#F5F5F5] font-bold text-sm min-w-5 text-center">
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
            aria-label={
              souhaite ? "Retirer des souhaités" : "Ajouter aux souhaités"
            }
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-[#2A2A2A] hover:border-[#3A3A3A] transition-colors"
          >
            <Heart
              size={15}
              className={
                souhaite
                  ? "fill-red-500 text-red-500"
                  : "text-[#3A3A3A] hover:text-[#6B6B6B]"
              }
            />
          </button>
        </div>

        {/* Compteur quantité souhaitée — visible quand souhaite = true */}
        {souhaite && (
          <div className="flex items-center justify-between mt-1.5 px-1">
            <span className="text-[#6B6B6B] text-[10px]">souhaite</span>
            <div className="flex items-center gap-2 bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-2.5 py-1">
              <button
                onClick={() => modifierQuantiteSouhaitee(-1)}
                className="text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
                aria-label="Réduire souhaitées"
              >
                <Minus size={11} />
              </button>
              <span className="text-red-400 font-bold text-xs min-w-4 text-center">
                {quantiteSouhaitee}
              </span>
              <button
                onClick={() => modifierQuantiteSouhaitee(1)}
                className="text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
                aria-label="Augmenter souhaitées"
              >
                <Plus size={11} />
              </button>
            </div>
          </div>
        )}

        {/* Compteur "dont peint" — visible seulement quand on possède au moins 1 */}
        {quantite > 0 && (
          <div className="flex items-center justify-between mt-1.5 px-1">
            <span className="text-[#6B6B6B] text-[10px]">dont peint</span>
            <div className="flex items-center gap-2 bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-2.5 py-1">
              <button
                onClick={() => modifierQuantitePeinte(-1)}
                className="text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
                aria-label="Réduire peintes"
              >
                <Minus size={11} />
              </button>
              <span className="text-[#C9A227] font-bold text-xs min-w-4 text-center">
                {quantitePeinte}
              </span>
              <button
                onClick={() => modifierQuantitePeinte(1)}
                className="text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
                aria-label="Augmenter peintes"
              >
                <Plus size={11} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
