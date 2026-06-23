"use client";

// ============================================================
// BARRE DE NAVIGATION INFÉRIEURE - 5 onglets
// ============================================================
// Ce composant affiche la navigation principale en bas de l'écran,
// inspiré des apps mobiles natives.
// Onglets : Accueil | Figurines | Projet | Peinture | Profil

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Shield, Sword, Palette, User, Swords } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/lib/auth-context";

const ONGLETS = [
  { href: "/accueil", label: "Accueil", Icon: Home },
  { href: "/figurines", label: "Figurines", Icon: Shield },
  { href: "/liste", label: "Listes", Icon: Swords, desktopSeulement: true },
  { href: "/projet", label: "Projet", Icon: Sword },
  { href: "/peinture", label: "Peinture", Icon: Palette },
  { href: "/profil", label: "Profil", Icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { nbDemandesAmis } = useAuth();

  // sticky bottom-0 : la nav reste collée en bas du conteneur parent.
  // z-40 : en dessous de la modal (z-[60]) pour ne jamais la masquer.
  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 w-full bg-[#1A1A1A] border-t border-[#2A2A2A] z-40">
      {/* Ligne décorative dorée en haut de la nav */}
      <div className="h-px bg-linear-to-r from-transparent via-[#C9A227] to-transparent" />

      <div className="flex items-center justify-around px-2 py-3.5">
        {ONGLETS.map(({ href, label, Icon, desktopSeulement }) => {
          const actif = pathname.startsWith(href);
          const badge = href === "/profil" && nbDemandesAmis > 0;

          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex flex-col items-center gap-1 px-2 py-0.5 rounded-xl transition-all duration-200 min-w-10",
                actif ? "text-[#C9A227]" : "text-[#6B6B6B] hover:text-[#D4D4D4]",
                desktopSeulement && "hidden lg:flex",
              )}
            >
              <div className="relative">
                <Icon size={16} strokeWidth={actif ? 2.5 : 1.5} />
                {badge && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-3.5 h-3.5 rounded-full bg-red-500 flex items-center justify-center text-[9px] font-bold text-white px-0.5">
                    {nbDemandesAmis > 9 ? "9+" : nbDemandesAmis}
                  </span>
                )}
              </div>

              <span
                className={clsx(
                  "text-[10px] font-semibold uppercase tracking-wider",
                  actif ? "text-[#C9A227]" : "text-[#6B6B6B]",
                )}
              >
                {label}
              </span>

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
