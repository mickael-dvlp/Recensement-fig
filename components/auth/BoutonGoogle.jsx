"use client";

import IconGoogle from "./IconGoogle";

export default function BoutonGoogle({ onClick, chargement }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={chargement}
      className="flex items-center justify-center gap-3 bg-[#1A1A1A] border border-[#2A2A2A] hover:bg-[#252525] disabled:opacity-50 disabled:cursor-not-allowed text-[#D4D4D4] font-semibold py-3.5 rounded-2xl text-sm transition-colors"
    >
      {chargement ? (
        <div className="w-5 h-5 border-2 border-[#D4D4D4] border-t-transparent rounded-full animate-spin" />
      ) : (
        <><IconGoogle /> Continuer avec Google</>
      )}
    </button>
  );
}
