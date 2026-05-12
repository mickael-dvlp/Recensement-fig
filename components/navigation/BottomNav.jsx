"use client";

// ============================================================
// BARRE DE NAVIGATION INFÉRIEURE - 5 onglets
// ============================================================
// Ce composant affiche la navigation principale en bas de l'écran,
// inspiré des apps mobiles natives.
// Onglets : Accueil | Figurines | Projet | Peinture | Profil

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Shield, Sword, Palette, User } from "lucide-react";
import clsx from "clsx";

// Définition des 5 onglets de navigation
const ONGLETS = [
  { href: "/accueil", label: "Accueil", Icon: Home },
  { href: "/figurines", label: "Figurines", Icon: Shield }, // Bouclier = figurines/armée
  { href: "/projet", label: "Projet", Icon: Sword }, // Épée = projet en cours
  { href: "/peinture", label: "Peinture", Icon: Palette }, // Palette = peintures
  { href: "/profil", label: "Profil", Icon: User },
];

export default function BottomNav() {
  // Récupère le chemin actuel pour surligner l'onglet actif
  const pathname = usePathname();

  // sticky bottom-0 : la nav reste collée en bas du conteneur parent.
  // z-40 : en dessous de la modal (z-[60]) pour ne jamais la masquer.
  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full bg-[#1A1A1A] border-t border-[#2A2A2A] z-40">
      {/* Ligne décorative dorée en haut de la nav */}
      <div className="h-px bg-linear-to-r from-transparent via-[#C9A227] to-transparent" />

      <div className="flex items-center justify-around px-4 py-[14px]">
        {ONGLETS.map(({ href, label, Icon }) => {
          // Vérifie si cet onglet est actif
          const actif = pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                // Styles communs
                "flex flex-col items-center gap-1 px-3 py-0.5 rounded-xl transition-all duration-200 min-w-14",
                // Onglet actif : icône et texte dorés
                actif
                  ? "text-[#C9A227]"
                  : "text-[#6B6B6B] hover:text-[#D4D4D4]",
              )}
            >
              {/* Icône de l'onglet */}
              <Icon size={16} strokeWidth={actif ? 2.5 : 1.5} />

              {/* Label de l'onglet */}
              <span
                className={clsx(
                  "text-[10px] font-semibold uppercase tracking-wider",
                  actif ? "text-[#C9A227]" : "text-[#6B6B6B]",
                )}
              >
                {label}
              </span>

              {/* Point indicateur sous l'onglet actif */}
              {actif && (
                <div className="w-1 h-1 rounded-full bg-[#C9A227] -mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
