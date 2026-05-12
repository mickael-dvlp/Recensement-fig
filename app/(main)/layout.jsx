"use client";

// ============================================================
// LAYOUT PRINCIPAL - Pages protégées (utilisateur connecté)
// ============================================================
// Ce layout s'applique à toutes les pages de l'app principale :
// Accueil, Figurines, Projet, Peinture, Profil.
// Il vérifie que l'utilisateur est connecté et affiche la nav.

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import BottomNav from "@/components/navigation/BottomNav";

export default function MainLayout({ children }) {
  const { utilisateur, chargement } = useAuth();
  const router = useRouter();

  // Redirige vers la connexion si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!chargement && !utilisateur) {
      router.replace("/connexion");
    }
  }, [utilisateur, chargement, router]);

  // Écran de chargement pendant la vérification Firebase
  if (chargement) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D0D0D]">
        <div className="w-10 h-10 border-4 border-[#2A2A2A] border-t-[#C9A227] rounded-full animate-spin" />
      </div>
    );
  }

  // Ne rien afficher si non connecté (la redirection est en cours)
  if (!utilisateur) return null;

  return (
    /*
      min-h-screen + flex-col : le conteneur occupe toute la hauteur.
      La nav (sticky bottom-0) reste toujours visible en bas.
      Plus de pb-24 car la nav n'est plus en position fixed.
    */
    <div className="flex flex-col min-h-screen bg-[#0D0D0D]">
      <main className="flex-1 flex justify-center pb-20">
        <div className="w-full page-container">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
