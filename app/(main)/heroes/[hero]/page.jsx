"use client";

// ============================================================
// PAGE HÉROS — Variantes d'un héros
// ============================================================
// Page dynamique accessible depuis /heroes/[hero].
// Affiche toutes les variantes du héros avec :
//   - Compteur +/- pour l'inventaire
//   - Cœur pour marquer comme souhaitée

import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Swords } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import TOUS_LES_HEROS from "@/data/heros/index.js";
import FigurineRow from "@/components/figurines/FigurineRow";
import { useInventaire } from "@/lib/hooks/useInventaire";

export default function PageHero() {
  const { hero: heroEncode } = useParams();
  const router = useRouter();
  const { utilisateur } = useAuth();

  const nomHero = decodeURIComponent(heroEncode);
  const heroData = TOUS_LES_HEROS.find((h) => h.nom === nomHero);

  const { inventaire, chargement, mettreAJour } = useInventaire(utilisateur?.uid);

  // ---- HÉROS INCONNU ----
  if (!heroData) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center gap-4 px-8">
        <Swords size={40} className="text-[#3A3A3A]" />
        <p className="text-[#6B6B6B] text-center text-sm">
          Héros &quot;{nomHero}&quot; non trouvé.
        </p>
        <button
          onClick={() => router.back()}
          className="text-xs text-[#C9A227] underline underline-offset-2"
        >
          Retour
        </button>
      </div>
    );
  }

  const { variantes } = heroData;

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Ligne dorée */}
      <div className="h-0.5 bg-linear-to-r from-transparent via-[#C9A227] to-transparent" />

      {/* EN-TÊTE */}
      <div className="sticky top-0 z-40 bg-[#0D0D0D] border-b border-[#2A2A2A]">
        <div className="relative pt-6 pb-4 px-4 text-center">
          <button
            onClick={() => router.back()}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[#6B6B6B] hover:text-[#C9A227] transition-colors text-xs"
          >
            <ChevronLeft size={14} />
            Retour
          </button>

          <h1 className="text-xl font-bold text-[#F5F5F5] uppercase tracking-widest">
            {nomHero}
          </h1>
          {!chargement && (
            <p className="text-[#6B6B6B] text-xs mt-1">
              {variantes.length} variante{variantes.length > 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {/* CONTENU */}
      <div className="px-4 pb-10">
        {chargement ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 bg-[#1A1A1A] rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {variantes.map((variante) => (
                <FigurineRow
                  key={variante.id}
                  figurine={variante}
                  donneesUtilisateur={inventaire[variante.id]}
                  onMettreAJour={mettreAJour}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
