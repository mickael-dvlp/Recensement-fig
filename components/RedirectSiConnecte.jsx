"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

// Enveloppe la page publique : tant que la session Firebase n'est pas résolue,
// ou si une redirection vers /accueil est en cours, on affiche un loader neutre
// à la place — sans ça, la page marketing s'affichait en plein pendant l'instant
// où Firebase vérifie la session, avant d'être brutalement remplacée une fois
// l'utilisateur reconnu (flash particulièrement visible au lancement à froid
// de l'app mobile/PWA).
export default function RedirectSiConnecte({ children }) {
  const { utilisateur, chargement } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!chargement && utilisateur) {
      router.replace("/accueil");
    }
  }, [utilisateur, chargement, router]);

  if (chargement || utilisateur) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D0D0D]">
        <div className="w-10 h-10 border-4 border-[#2A2A2A] border-t-[#C9A227] rounded-full animate-spin" />
      </div>
    );
  }

  return children;
}
