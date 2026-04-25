"use client";

// ============================================================
// PAGE PROFIL - Paramètres utilisateur
// ============================================================
// Affiche les informations du compte et permet de :
//   - Se déconnecter
//   - Voir les liens rapides vers les sections
//   - (Plus tard) Changer la langue FR/EN

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  User,
  Shield,
  ShoppingCart,
  Sword,
  ChevronRight,
  Globe,
  Moon,
  Sun,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";

export default function PageProfil() {
  const { utilisateur, profil, seDeconnecter } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [chargementDeconnexion, setChargementDeconnexion] = useState(false);

  /**
   * Déconnecte l'utilisateur et redirige vers la connexion
   */
  async function handleDeconnexion() {
    setChargementDeconnexion(true);
    try {
      await seDeconnecter();
      router.replace("/connexion");
    } catch {
      setChargementDeconnexion(false);
    }
  }

  // Calcul des initiales du pseudo pour l'avatar (ex: "JD" pour "Jean Dupont")
  const pseudo = profil?.pseudo || utilisateur?.displayName || "Utilisateur";
  const initiales = pseudo
    .split(" ")
    .map((mot) => mot[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  return (
    <div className="flex flex-col min-h-screen bg-[#0D0D0D]">
      {/* EN-TÊTE PROFIL */}
      <div className="bg-[#1A1A1A] full-width px-6 pt-0 pb-8 border-b border-[#2A2A2A]">
        <div className="h-0.5 bg-linear-to-r from-transparent via-[#C9A227] to-transparent mb-8" />

        {/* Avatar avec initiales + informations */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-[#C9A227]/10 border-2 border-[#C9A227] flex items-center justify-center">
            <span className="text-[#C9A227] text-2xl font-bold">
              {initiales}
            </span>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-[#F5F5F5]">{pseudo}</h1>
            <p className="text-[#6B6B6B] text-sm">{utilisateur?.email}</p>
          </div>
        </div>
      </div>

      <div className="py-6 flex flex-col gap-5">
        {/* SECTION COMPTE */}
        <section>
          <h2 className="text-[#C9A227] text-xs font-bold uppercase tracking-widest mb-3">
            Mon compte
          </h2>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
            {/* Email */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#2A2A2A]">
              <User size={18} className="text-[#6B6B6B]" />
              <div className="flex-1">
                <p className="text-[#6B6B6B] text-xs">Email</p>
                <p className="text-[#F5F5F5] text-sm font-medium">
                  {utilisateur?.email}
                </p>
              </div>
            </div>

            {/* Date d'inscription */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#2A2A2A]">
              <Shield size={18} className="text-[#6B6B6B]" />
              <div className="flex-1">
                <p className="text-[#6B6B6B] text-xs">Membre depuis</p>
                <p className="text-[#F5F5F5] text-sm font-medium">
                  {profil?.creeLe
                    ? new Date(profil.creeLe).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Langue (à implémenter plus tard) */}
            <div className="flex items-center gap-3 px-4 py-3">
              <Globe size={18} className="text-[#6B6B6B]" />
              <div className="flex-1">
                <p className="text-[#6B6B6B] text-xs">Langue</p>
                <p className="text-[#F5F5F5] text-sm font-medium">
                  {profil?.langue === "en" ? "English" : "Français"}
                </p>
              </div>
              {/* Badge indiquant que cette fonctionnalité arrive bientôt */}
              <span className="text-[10px] bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/30 rounded-full px-2 py-0.5 font-semibold">
                Bientôt
              </span>
            </div>
          </div>
        </section>

        {/* SECTION APPARENCE */}
        <section>
          <h2 className="text-[#C9A227] text-xs font-bold uppercase tracking-widest mb-3">
            Apparence
          </h2>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
            {/*
              Bouton Mode : bascule entre mode sombre et mode clair.
              Le toggle switch indique visuellement le mode actif.
            */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#2A2A2A] transition-colors"
            >
              {/* Icône Lune (sombre) ou Soleil (clair) */}
              {theme === "dark" ? (
                <Moon size={18} className="text-[#6B6B6B]" />
              ) : (
                <Sun size={18} className="text-[#C9A227]" />
              )}

              {/* Label + état actuel */}
              <div className="flex-1 text-left">
                <p className="text-[#D4D4D4] text-sm font-medium">Mode</p>
                <p className="text-[#6B6B6B] text-xs">
                  {theme === "dark" ? "Sombre" : "Clair"}
                </p>
              </div>

              {/*
                Toggle switch visuel.
                Fond doré = mode clair activé, fond gris = mode sombre.
                Le rond blanc glisse de gauche (sombre) à droite (clair).
              */}
              <div
                className="relative w-12 h-6 rounded-full shrink-0 transition-colors duration-300"
                style={{
                  backgroundColor: theme === "light" ? "#C9A227" : "#3A3A3A",
                }}
              >
                <div
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300"
                  style={{
                    transform:
                      theme === "light"
                        ? "translateX(26px)"
                        : "translateX(4px)",
                  }}
                />
              </div>
            </button>
          </div>
        </section>

        {/* SECTION ACCÈS RAPIDE */}
        <section>
          <h2 className="text-[#C9A227] text-xs font-bold uppercase tracking-widest mb-3">
            Accès rapide
          </h2>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
            <button
              onClick={() => router.push("/figurines")}
              className="w-full flex items-center gap-3 px-4 py-3 border-b border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors"
            >
              <Shield size={18} className="text-[#22C55E]" />
              <span className="flex-1 text-left text-[#D4D4D4] text-sm">
                Mon inventaire
              </span>
              <ChevronRight size={16} className="text-[#3A3A3A]" />
            </button>

            <button
              onClick={() => router.push("/figurines")}
              className="w-full flex items-center gap-3 px-4 py-3 border-b border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors"
            >
              <ShoppingCart size={18} className="text-[#C9A227]" />
              <span className="flex-1 text-left text-[#D4D4D4] text-sm">
                Ma liste de souhaits
              </span>
              <ChevronRight size={16} className="text-[#3A3A3A]" />
            </button>

            <button
              onClick={() => router.push("/projet")}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#2A2A2A] transition-colors"
            >
              <Sword size={18} className="text-blue-400" />
              <span className="flex-1 text-left text-[#D4D4D4] text-sm">
                Mon projet en cours
              </span>
              <ChevronRight size={16} className="text-[#3A3A3A]" />
            </button>
          </div>
        </section>

        {/* BOUTON DÉCONNEXION */}
        <button
          onClick={handleDeconnexion}
          disabled={chargementDeconnexion}
          className="flex items-center justify-center gap-2 w-full bg-red-900/20 border border-red-800 hover:bg-red-900/40 disabled:opacity-50 text-red-400 font-bold uppercase tracking-wider py-3 rounded-xl transition-colors"
        >
          {chargementDeconnexion ? (
            <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <LogOut size={18} />
              Se déconnecter
            </>
          )}
        </button>

        {/* Version */}
        <p className="text-center text-[#3A3A3A] text-xs mt-2">
          MESBG Collection v1.0.0
        </p>
      </div>
    </div>
  );
}
