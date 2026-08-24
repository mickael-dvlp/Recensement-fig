"use client";

// ============================================================
// COMPOSANT BARRE DE RECHERCHE
// ============================================================
// Champ de texte à gauche, bouton loupe à droite pour valider.
// Bouton X pour effacer si du texte est saisi.

import { Search, X } from "lucide-react";

/**
 * @param {string}   valeur      - Valeur actuelle du champ
 * @param {Function} onChange    - Callback lors de la saisie
 * @param {string}   placeholder - Texte indicatif
 */
export default function SearchBar({
  valeur,
  onChange,
  placeholder = "Rechercher...",
}) {
  return (
    <div className="flex items-center gap-2">
      {/* Champ de saisie — prend toute la largeur disponible */}
      <div className="relative flex-1">
        <input
          type="text"
          value={valeur}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-12 bg-[#1A1A1A] border border-[#3A3A3A] rounded-2xl pl-5 pr-10 text-[#F5F5F5] placeholder-[#4A4A4A] focus:outline-none focus:border-[#C9A227] transition-colors text-sm"
        />

        {/* Bouton effacer — visible uniquement si du texte est saisi */}
        {valeur && (
          <button
            onClick={() => onChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#C9A227] transition-colors"
            aria-label="Effacer la recherche"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Icône loupe à droite — décorative : la recherche est déjà live, pas de validation nécessaire */}
      <div
        aria-hidden="true"
        className="shrink-0 w-12 h-12 rounded-2xl bg-[#C9A227] flex items-center justify-center"
      >
        <Search size={20} className="text-[#0D0D0D]" />
      </div>
    </div>
  );
}
