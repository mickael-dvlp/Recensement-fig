"use client";

// ============================================================
// COMPOSANT ONGLETS DE FILTRE
// ============================================================
// Affiche les 3 onglets : Tout | Inventaire | Souhaitée
// Inspiré de l'image de référence (ALL | INVENTORY | WISHLIST)

import clsx from "clsx";

// Définition des onglets avec leur label et leur valeur
const ONGLETS = [
  { valeur: "tout",        label: "Tout"       },
  { valeur: "inventaire",  label: "Inventaire" },
  { valeur: "souhaite",    label: "Souhaitée"  },
];

/**
 * @param {string}   ongletActif  - Onglet actuellement sélectionné ("tout", "inventaire", "souhaite")
 * @param {Function} onChangement - Callback lors du changement d'onglet
 */
export default function FilterTabs({ ongletActif, onChangement }) {
  return (
    <div className="flex items-center bg-[#1A1A1A] rounded-2xl p-1.5 gap-1.5">
      {ONGLETS.map(({ valeur, label }) => {
        const actif = ongletActif === valeur;
        return (
          <button
            key={valeur}
            onClick={() => onChangement(valeur)}
            className={clsx(
              // py-3 pour plus de hauteur, rounded-xl pour suivre le conteneur
              "flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200",
              actif
                ? "bg-[#C9A227] text-[#0D0D0D]"
                : "text-[#6B6B6B] hover:text-[#D4D4D4]"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
