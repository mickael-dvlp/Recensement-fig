import Link from "next/link";

export default function HeroCard({ hero }) {
  const possedes = hero.possedes || 0;
  const pourcentage =
    hero.total > 0 ? Math.round((possedes / hero.total) * 100) : 0;

  return (
    <Link
      href={`/heroes/${encodeURIComponent(hero.nom)}`}
      className="block bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-3 cursor-pointer hover:border-[#C9A227] hover:bg-[#1F1F1F] transition-colors"
    >
      {/* Nom du héros */}
      <p className="text-[#F5F5F5] font-bold text-sm truncate mb-2">
        {hero.nom}
      </p>

      {/* Barre de progression */}
      <div className="h-1 bg-[#2A2A2A] rounded-full mb-1.5">
        <div
          className="h-1 bg-[#C9A227] rounded-full transition-all"
          style={{ width: `${pourcentage}%` }}
        />
      </div>

      {/* Compteur */}
      <div className="flex items-center justify-between">
        <span className="text-[#6B6B6B] text-xs">
          <span className="text-[#F5F5F5] font-semibold">{possedes}</span>
          /{hero.total}
        </span>
      </div>
    </Link>
  );
}
