import Image from "next/image";
import Link from "next/link";
import { Layers, ScrollText, Palette, Users, ChevronRight } from "lucide-react";
import RedirectSiConnecte from "@/components/RedirectSiConnecte";

export const metadata = {
  title: "MESBG — Gérez votre collection de figurines Middle-Earth",
  description:
    "L'application de référence pour les joueurs de Middle-Earth Strategy Battle Game. Suivez votre inventaire de figurines Games Workshop, créez des mémos de projet, consultez les guides de peinture et comparez votre collection avec vos amis.",
  keywords: [
    "MESBG",
    "Middle-Earth Strategy Battle Game",
    "figurines",
    "inventaire figurines",
    "collection MESBG",
    "Seigneur des Anneaux figurines",
    "The Hobbit figurines",
    "Games Workshop",
    "gestion collection",
    "peinture figurines",
  ],
  alternates: {
    canonical: "/",
  },
};

const FEATURES = [
  {
    Icon: Layers,
    titre: "Inventaire complet",
    texte:
      "Recensez toutes vos figurines possédées et en liste de souhaits, faction par faction. Suivez chaque variante de vos héros.",
  },
  {
    Icon: ScrollText,
    titre: "Mémos de projet",
    texte:
      "Notez vos projets de peinture, vos listes d'armée et vos idées stratégiques. Organisez vos parties à venir.",
  },
  {
    Icon: Palette,
    titre: "Guides de peinture",
    texte:
      "Retrouvez les références de couleurs Army Painter et Vallejo pour chaque figurine MESBG.",
  },
  {
    Icon: Users,
    titre: "Système d'amis",
    texte:
      "Ajoutez vos adversaires et alliés, consultez leurs collections et comparez vos inventaires.",
  },
];

export default function PageLanding() {
  return (
    <>
      <RedirectSiConnecte />

      <div className="min-h-screen bg-[#0D0D0D] flex flex-col">
        {/* ── HEADER ── */}
        <header className="sticky top-0 z-50 bg-[#0D0D0D]/90 backdrop-blur-sm border-b border-[#1A1A1A]">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <span className="text-[#C9A227] font-bold text-xl tracking-[0.2em] uppercase">
              MESBG
            </span>
            <nav className="flex items-center gap-3">
              <Link
                href="/connexion"
                className="text-[#6B6B6B] hover:text-[#F5F5F5] text-sm font-medium transition-colors px-4 py-2"
              >
                Se connecter
              </Link>
              <Link
                href="/inscription"
                className="bg-[#C9A227] hover:bg-[#d4af3a] text-[#0D0D0D] text-sm font-bold px-5 py-2 rounded-full transition-colors"
              >
                Créer un compte
              </Link>
            </nav>
          </div>
        </header>

        {/* ── HERO ── */}
        <section className="relative flex-1 flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden min-h-140">
          {/* Image de fond avec overlay */}
          <div className="absolute inset-0">
            <Image
              src="/image/mesbg_header.jpg"
              alt="Middle-Earth Strategy Battle Game — figurines"
              fill
              className="object-cover object-center"
              priority
              quality={85}
            />
            <div className="absolute inset-0 bg-[#0D0D0D]/70" />
            <div className="absolute inset-0 bg-linear-to-b from-[#0D0D0D]/40 via-transparent to-[#0D0D0D]" />
          </div>

          {/* Ligne dorée déco */}
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#C9A227]/60 to-transparent" />

          <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="h-px w-10 bg-[#C9A227]/50" />
              <span className="text-[#C9A227] text-xs font-bold uppercase tracking-[0.3em]">
                Middle-Earth Strategy Battle Game
              </span>
              <div className="h-px w-10 bg-[#C9A227]/50" />
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-[#F5F5F5] leading-tight">
              Gérez votre collection{" "}
              <span className="text-[#C9A227]">MESBG</span>
            </h1>

            <p className="text-[#A0A0A0] text-base sm:text-lg leading-relaxed max-w-xl">
              Inventaire de figurines, mémos de projet, guides de peinture et
              partage avec vos amis — tout ce dont un joueur MESBG a besoin,
              réuni en une seule application.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
              <Link
                href="/inscription"
                className="flex items-center gap-2 bg-[#C9A227] hover:bg-[#d4af3a] text-[#0D0D0D] font-bold px-8 py-4 rounded-2xl text-sm transition-colors"
              >
                Créer un compte gratuit
                <ChevronRight size={16} />
              </Link>
              <Link
                href="/connexion"
                className="text-[#6B6B6B] hover:text-[#F5F5F5] text-sm font-medium transition-colors px-4 py-4"
              >
                J&apos;ai déjà un compte →
              </Link>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="bg-[#0D0D0D] px-6 py-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F5] mb-3">
                Tout ce qu&apos;il vous faut pour votre armée
              </h2>
              <p className="text-[#6B6B6B] text-sm max-w-lg mx-auto">
                Conçu par des joueurs MESBG, pour des joueurs MESBG.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {FEATURES.map(({ Icon, titre, texte }) => (
                <div
                  key={titre}
                  className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-6 flex flex-col gap-4 hover:border-[#C9A227]/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#C9A227]/10 flex items-center justify-center">
                    <Icon size={20} className="text-[#C9A227]" />
                  </div>
                  <div>
                    <h3 className="text-[#F5F5F5] font-bold text-sm mb-1">
                      {titre}
                    </h3>
                    <p className="text-[#6B6B6B] text-xs leading-relaxed">
                      {texte}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SCREENSHOT / VISUEL ── */}
        <section className="bg-[#080808] border-y border-[#1A1A1A] px-6 py-20">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 flex flex-col gap-5">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F5] leading-snug">
                Des centaines de figurines{" "}
                <span className="text-[#C9A227]">Games Workshop</span>{" "}
                répertoriées
              </h2>
              <p className="text-[#6B6B6B] text-sm leading-relaxed">
                Toutes les factions de Middle-Earth sont disponibles — La
                Communauté de l&apos;Anneau, le Mordor, Rohan, Gondor, les Nains
                d&apos;Erebor et bien plus encore. Ajoutez même vos propres
                figurines personnalisées.
              </p>
              <ul className="flex flex-col gap-2">
                {[
                  "Héros et guerriers par faction",
                  "Variantes de modèles",
                  "Figurines custom avec photo",
                  "Filtre inventaire / souhaitées",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-[#A0A0A0]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 relative rounded-2xl overflow-hidden border border-[#2A2A2A] aspect-video w-full max-w-md">
              <Image
                src="/image/image01.jpg"
                alt="Figurines MESBG — collection et inventaire"
                fill
                className="object-cover"
                quality={80}
              />
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="px-6 py-20 text-center">
          <div className="max-w-lg mx-auto flex flex-col items-center gap-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F5]">
              Prêt à organiser votre armée ?
            </h2>
            <p className="text-[#6B6B6B] text-sm">
              Gratuit, sans publicité. Créez votre compte en quelques secondes.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
              <Link
                href="/inscription"
                className="flex items-center gap-2 bg-[#C9A227] hover:bg-[#d4af3a] text-[#0D0D0D] font-bold px-8 py-4 rounded-2xl text-sm transition-colors w-full sm:w-auto justify-center"
              >
                Créer un compte gratuit
                <ChevronRight size={16} />
              </Link>
              <Link
                href="/connexion"
                className="flex items-center justify-center gap-2 border border-[#2A2A2A] hover:border-[#3A3A3A] text-[#6B6B6B] hover:text-[#F5F5F5] font-medium px-8 py-4 rounded-2xl text-sm transition-colors w-full sm:w-auto"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-[#1A1A1A] px-6 py-8">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[#C9A227] font-bold tracking-[0.2em] uppercase text-sm">
              MESBG
            </span>
            <p className="text-[#3A3A3A] text-xs text-center">
              Application non officielle — Middle-Earth Strategy Battle Game est
              une marque de Games Workshop Ltd.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
