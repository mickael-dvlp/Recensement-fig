"use client";

// ============================================================
// PAGE RACINE - Redirection intelligente
// ============================================================
// Cette page redirige automatiquement vers l'accueil si l'utilisateur
// est connecté, ou vers la page de connexion sinon.

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function PageRacine() {
  const { utilisateur, chargement } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (chargement) return; // Attendre que Firebase vérifie l'auth

    if (utilisateur) {
      // Utilisateur connecté → page d'accueil
      router.replace("/accueil");
    } else {
      // Utilisateur non connecté → page de connexion
      router.replace("/connexion");
    }
  }, [utilisateur, chargement, router]);

  // Écran de chargement pendant la vérification
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0D0D0D]">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner de chargement doré */}
        <div className="w-12 h-12 border-4 border-[#2A2A2A] border-t-[#C9A227] rounded-full animate-spin" />
        <p className="text-[#6B6B6B] text-sm">Chargement...</p>
      </div>
    </div>
  );
}
