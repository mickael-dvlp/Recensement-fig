"use client";

// ============================================================
// CARTE AUTH — carcasse partagée des pages connexion/inscription
// ============================================================
// Particules flottantes + carte deux colonnes (image + formulaire) + branding.
// Les positions des particules varient selon `variante` pour une composition
// légèrement différente entre les deux pages (effet miroir voulu).

import Image from "next/image";

const POSITIONS_PARTICULES = {
  connexion: [
    { classe: "float-a absolute top-1/4 left-1/4 w-72 h-72 rounded-full", opacite: 0.08 },
    { classe: "float-b absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full", opacite: 0.06 },
    { classe: "float-c absolute top-1/2 right-1/3 w-40 h-40 rounded-full", opacite: 0.05 },
  ],
  inscription: [
    { classe: "float-a absolute top-1/3 right-1/4 w-72 h-72 rounded-full", opacite: 0.08 },
    { classe: "float-b absolute bottom-1/3 left-1/4 w-56 h-56 rounded-full", opacite: 0.06 },
    { classe: "float-c absolute top-2/3 right-1/3 w-40 h-40 rounded-full", opacite: 0.05 },
  ],
};

export default function CarteAuth({ variante, sousTitreBranding, titre, description, children }) {
  const particules = POSITIONS_PARTICULES[variante] ?? POSITIONS_PARTICULES.connexion;

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-6">
      {/* ── Particules flottantes ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particules.map((p, i) => (
          <div
            key={i}
            className={p.classe}
            style={{ background: "radial-gradient(circle, #1c9ac2 0%, transparent 70%)", opacity: p.opacite }}
          />
        ))}
      </div>

      {/* ── Carte principale (deux colonnes) ── */}
      <div
        className="animate-fade-slide-up relative w-full max-w-215 bg-[#111111] border border-[#1c9ac2]/30 rounded-3xl overflow-hidden flex min-h-165"
        style={{ boxShadow: "0 0 40px rgba(28, 154, 194, 0.25), 0 0 80px rgba(28, 154, 194, 0.1), 0 25px 50px rgba(0,0,0,0.5)" }}
      >
        {/* ─ Colonne gauche : image ─ */}
        <div className="relative w-[42%] shrink-0 hidden md:block">
          <Image src="/image/image02.jpg" alt="MESBG" fill className="object-cover" priority />
        </div>

        {/* Séparateur vertical */}
        <div className="w-px bg-[#252525] shrink-0" />

        {/* ─ Colonne droite : formulaire ─ */}
        <div className="flex-1 flex flex-col justify-center py-10 gap-6" style={{ paddingLeft: "48px", paddingRight: "48px" }}>
          {/* Branding centré */}
          <div className="flex flex-col items-center gap-1 mb-2">
            <h1 className="text-3xl font-bold text-[#1c9ac2] uppercase tracking-[0.25em]">MESBG</h1>
            <div className="flex items-center gap-2">
              <div className="w-8 h-px bg-[#1c9ac2]/50" />
              <p className="text-[#6B6B6B] text-xs tracking-widest uppercase">{sousTitreBranding}</p>
              <div className="w-8 h-px bg-[#1c9ac2]/50" />
            </div>
          </div>

          {/* Titre */}
          <div>
            <h2 className="text-2xl font-bold text-[#F5F5F5]">{titre}</h2>
            <p className="text-[#6B6B6B] text-sm mt-1">{description}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
