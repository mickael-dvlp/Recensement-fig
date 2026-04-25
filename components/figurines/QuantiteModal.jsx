"use client";

// ============================================================
// MODAL DE QUANTITÉ
// ============================================================
// Fenêtre modale qui s'affiche quand l'utilisateur active
// une figurine (inventaire ou souhaitée) pour saisir la quantité.
// Permet d'incrémenter / décrémenter ou saisir un chiffre direct.

import { X, Minus, Plus } from "lucide-react";

/**
 * @param {string}   titre       - Titre de la modal (ex: "Quantité possédée")
 * @param {number}   quantite    - Quantité actuelle
 * @param {Function} onChangement - Callback quand la quantité change
 * @param {Function} onFermer    - Callback pour fermer la modal
 * @param {Function} onValider   - Callback pour confirmer
 */
export default function QuantiteModal({
  titre,
  quantite,
  onChangement,
  onFermer,
  onValider,
}) {
  /** Incrémente la quantité */
  function incrementer() {
    onChangement(quantite + 1);
  }

  /** Décrémente la quantité (minimum 1) */
  function decrementer() {
    if (quantite > 1) onChangement(quantite - 1);
  }

  /** Gère la saisie directe dans le champ numérique */
  function handleSaisie(valeur) {
    const num = parseInt(valeur, 10);
    if (!isNaN(num) && num >= 1) onChangement(num);
  }

  return (
    /*
      z-[60] : au-dessus de la nav (z-40) et de tout le reste.
      Fond semi-transparent centré sur tout l'écran.
      Clic sur le fond = ferme la modal.
    */
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-60 px-6"
      onClick={onFermer}
    >
      {/*
        Petite fenêtre flottante centrée.
        stopPropagation empêche la fermeture au clic à l'intérieur.
        w-full max-w-[320px] = fenêtre compacte, pas plein écran.
      */}
      <div
        className="w-full max-w-[320px] bg-[#1A1A1A] rounded-2xl border border-[#3A3A3A] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* EN-TÊTE : titre + bouton fermer */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="text-[#F5F5F5] font-bold text-base">{titre}</h3>
          <button
            onClick={onFermer}
            className="text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* SÉPARATEUR */}
        <div className="h-px bg-[#2A2A2A] mx-5" />

        {/* SÉLECTEUR DE QUANTITÉ */}
        <div className="flex items-center justify-center gap-5 px-5 py-6">
          {/* Bouton diminuer */}
          <button
            onClick={decrementer}
            disabled={quantite <= 1}
            className="w-10 h-10 rounded-full bg-[#2A2A2A] border border-[#3A3A3A] flex items-center justify-center text-[#F5F5F5] hover:border-[#C9A227] hover:text-[#C9A227] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Minus size={16} />
          </button>

          {/* Valeur numérique */}
          <input
            type="number"
            value={quantite}
            onChange={(e) => handleSaisie(e.target.value)}
            min={1}
            className="w-16 text-center text-3xl font-bold text-[#C9A227] bg-transparent focus:outline-none border-b-2 border-[#C9A227] pb-1"
          />

          {/* Bouton augmenter */}
          <button
            onClick={incrementer}
            className="w-10 h-10 rounded-full bg-[#2A2A2A] border border-[#3A3A3A] flex items-center justify-center text-[#F5F5F5] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* PIED : bouton Annuler à gauche, Enregistrer à droite */}
        <div className="flex items-center justify-between px-5 pb-5 gap-3">
          <button
            onClick={onFermer}
            className="flex-1 py-2.5 rounded-xl border border-[#3A3A3A] text-[#6B6B6B] hover:text-[#F5F5F5] hover:border-[#6B6B6B] text-sm font-semibold transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onValider}
            className="flex-1 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#E6C25A] text-[#0D0D0D] text-sm font-bold uppercase tracking-wide transition-colors"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
