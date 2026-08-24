"use client";

import { Ghost } from "lucide-react";

export default function BoutonInvite({ onClick, chargement }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={chargement}
      className="animate-clignoter-rouge flex items-center justify-center gap-3 bg-transparent hover:bg-[#1A1A1A] border border-dashed disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-3.5 rounded-2xl text-sm"
    >
      {chargement ? (
        <div className="w-5 h-5 border-2 border-[#6B6B6B] border-t-transparent rounded-full animate-spin" />
      ) : (
        <><Ghost size={17} /> Continuer en mode invité</>
      )}
    </button>
  );
}
