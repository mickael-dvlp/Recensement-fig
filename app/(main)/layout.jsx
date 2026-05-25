"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import BottomNav from "@/components/navigation/BottomNav";
import { useScrollRestoration } from "@/lib/hooks/useScrollRestoration";
import { AlertTriangle, Trash2 } from "lucide-react";

export default function MainLayout({ children }) {
  const { utilisateur, chargement, profil, isInvite } = useAuth();
  const router = useRouter();
  useScrollRestoration();
  const [popupNettoyage, setPopupNettoyage] = useState(false);

  useEffect(() => {
    if (!chargement && !utilisateur) {
      router.replace("/connexion");
    }
  }, [utilisateur, chargement, router]);

  useEffect(() => {
    if (!isInvite && profil && !profil.nettoyageFait) {
      setPopupNettoyage(true);
    }
  }, [isInvite, profil]);

  if (chargement) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D0D0D]">
        <div className="w-10 h-10 border-4 border-[#2A2A2A] border-t-[#C9A227] rounded-full animate-spin" />
      </div>
    );
  }

  if (!utilisateur) return null;

  const TEXTE_TENGWAR = "yYtTqQnNeEmMaAiIoOlLrRsShHdDbBvVkKwWzZgGfFpP".repeat(8);

  return (
    <div className="flex flex-col min-h-screen bg-[#0D0D0D]">
      <div className="frise-elfique frise-elfique-gauche">
        <span className="frise-elfique-texte">{TEXTE_TENGWAR}</span>
      </div>
      <div className="frise-elfique frise-elfique-droite">
        <span className="frise-elfique-texte">{TEXTE_TENGWAR}</span>
      </div>
      <main className="flex-1 flex justify-center pb-20">
        <div className="w-full page-container">{children}</div>
      </main>
      <BottomNav />

      {/* POPUP NETTOYAGE INVENTAIRE */}
      {popupNettoyage && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 px-4 pb-6 sm:pb-0">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl w-full max-w-sm p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-400/10 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} className="text-orange-400" />
              </div>
              <h3 className="text-[#F5F5F5] font-bold text-base">Maintenance requise</h3>
            </div>

            <p className="text-[#6B6B6B] text-sm leading-relaxed">
              L'application a été mise à jour. Certaines données de votre inventaire peuvent être obsolètes et doivent être nettoyées.
            </p>
            <p className="text-[#6B6B6B] text-sm leading-relaxed">
              Rendez-vous dans <span className="text-[#F5F5F5] font-medium">Profil → Maintenance</span> pour effectuer le nettoyage. Cette opération ne supprime aucune figurine possédée.
            </p>

            <div className="flex gap-3 mt-1">
              <button
                onClick={() => setPopupNettoyage(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#2A2A2A] text-[#6B6B6B] hover:text-[#F5F5F5] hover:border-[#3A3A3A] transition-colors text-sm font-medium"
              >
                Plus tard
              </button>
              <button
                onClick={() => { setPopupNettoyage(false); router.push("/profil"); }}
                className="flex-1 py-2.5 rounded-xl bg-orange-400/10 border border-orange-400/30 text-orange-400 hover:bg-orange-400/20 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <Trash2 size={14} /> Nettoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
