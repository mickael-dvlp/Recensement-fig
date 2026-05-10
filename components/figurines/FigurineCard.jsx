"use client";

// ============================================================
// COMPOSANT CARTE FACTION
// ============================================================
// Affiche une faction avec :
//   - Son nom
//   - Le nombre de figurines distinctes possédées / ∞

import { useRouter } from "next/navigation";

export default function FigurineCard({ faction, onglet }) {
  const router = useRouter();
  const count = onglet === "souhaite" ? faction.souhaites : faction.possedes;

  function naviguer() {
    const base = `/figurines/${encodeURIComponent(faction.nom)}`;
    const url = onglet !== "tout" ? `${base}?filtre=${onglet}` : base;
    router.push(url);
  }

  return (
    <div
      onClick={naviguer}
      className="flex items-center justify-between w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-4 py-5 cursor-pointer hover:border-[#C9A227] hover:bg-[#1F1F1F] transition-colors"
    >
      <p className="text-[#F5F5F5] font-bold text-base uppercase tracking-wide leading-tight">
        {faction.nom}
      </p>
      <p className="text-[#6B6B6B] text-sm shrink-0 ml-3">
        <span className="text-[#F5F5F5] font-semibold">{count}</span>
        {" / ∞"}
      </p>
    </div>
  );
}
