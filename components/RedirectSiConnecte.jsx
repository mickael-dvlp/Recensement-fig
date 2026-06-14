"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function RedirectSiConnecte() {
  const { utilisateur, chargement } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!chargement && utilisateur) {
      router.replace("/accueil");
    }
  }, [utilisateur, chargement, router]);

  return null;
}
