// ============================================================
// PAGE PUBLIQUE — Politique de confidentialité / Mentions légales
// ============================================================
// Accessible sans compte (contrairement à la modale du profil) :
// requise pour la fiche Play Store lors de la publication de l'app.

import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import MentionsLegalesContenu from "@/components/legal/MentionsLegalesContenu";

export const metadata = {
  title: "Politique de confidentialité",
  description:
    "Mentions légales et politique de confidentialité de l'application MESBG Collection : données collectées, hébergement, RGPD et propriété intellectuelle.",
  alternates: {
    canonical: "/politique-confidentialite",
  },
};

export default function PagePolitiqueConfidentialite() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col">
      <header className="sticky top-0 z-50 bg-[#0D0D0D]/90 backdrop-blur-sm border-b border-[#1A1A1A]">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link
            href="/"
            className="text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
            aria-label="Retour à l'accueil"
          >
            <ArrowLeft size={20} />
          </Link>
          <span className="text-[#C9A227] font-bold text-lg tracking-[0.2em] uppercase">
            MESBG
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <FileText size={22} className="text-[#C9A227]" />
          <h1 className="text-[#F5F5F5] text-xl font-bold uppercase tracking-widest">
            Mentions légales
          </h1>
        </div>

        <div className="flex flex-col gap-5 text-sm">
          <MentionsLegalesContenu />
        </div>
      </main>
    </div>
  );
}
