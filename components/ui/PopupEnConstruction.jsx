"use client";

import { useState } from "react";
import { Wrench } from "lucide-react";

export default function PopupEnConstruction() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setVisible(false)}
      />

      {/* Carte */}
      <div
        className="relative w-full max-w-md bg-[#111111] border border-[#1c9ac2]/40 rounded-3xl p-8 flex flex-col items-center gap-5 text-center"
        style={{
          boxShadow:
            "0 0 40px rgba(28, 154, 194, 0.2), 0 25px 50px rgba(0,0,0,0.6)",
        }}
      >
        {/* Icône */}
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1c9ac2]/10 border border-[#1c9ac2]/30">
          <Wrench size={26} className="text-[#1c9ac2]" />
        </div>

        {/* Titre */}
        <h2 className="text-xl font-bold text-[#F5F5F5]">
          Site en cours de création
        </h2>

        {/* Message */}
        <p className="text-[#6B6B6B] text-sm leading-relaxed">
          Cette application est actuellement en cours de développement.
          Certaines fonctionnalités peuvent être incomplètes ou indisponibles.
          <br />
          <br />
          Tu peux tout de même naviguer en{" "}
          <span className="text-[#1c9ac2] font-semibold">mode invité</span> et
          explorer ce qui est déjà disponible.
        </p>

        {/* Bouton */}
        <button
          onClick={() => setVisible(false)}
          className="w-full bg-[#1c9ac2] hover:bg-[#3ab8e0] text-[#0D0D0D] font-bold uppercase tracking-widest py-4 rounded-2xl transition-colors text-sm mt-1"
        >
          Parfait, je regarde juste !
        </button>
      </div>
    </div>
  );
}
