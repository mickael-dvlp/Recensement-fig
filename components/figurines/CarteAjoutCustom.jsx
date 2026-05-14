"use client";

import { useState, useRef } from "react";
import { Plus, X, Check, Upload } from "lucide-react";

export default function CarteAjoutCustom({ faction, section, onAjouter }) {
  const [ouvert, setOuvert] = useState(false);
  const [nom, setNom] = useState("");
  const [fichier, setFichier] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  function choisirImage(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFichier(f);
    setPreview(URL.createObjectURL(f));
  }

  function annuler() {
    setOuvert(false);
    setNom("");
    setFichier(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  }

  async function valider() {
    if (!nom.trim() || !fichier || loading) return;
    setLoading(true);
    try {
      await onAjouter({ nom: nom.trim(), faction, section, file: fichier });
      annuler();
    } finally {
      setLoading(false);
    }
  }

  if (!ouvert) {
    return (
      <button
        onClick={() => setOuvert(true)}
        className="bg-[#1A1A1A] border border-dashed border-[#3A3A3A] rounded-2xl flex flex-col items-center justify-center gap-2 p-3 hover:border-[#C9A227]/50 hover:bg-[#1F1F1F] transition-colors"
        style={{ minHeight: "160px" }}
      >
        <Plus size={20} className="text-[#3A3A3A]" />
        <p className="text-[#6B6B6B] text-[10px] text-center leading-snug">
          Envie de rajouter une figurine personnelle ?
        </p>
      </button>
    );
  }

  return (
    <div className="bg-[#1A1A1A] border border-[#C9A227]/30 rounded-2xl flex flex-col gap-2 p-3">
      {/* Zone image */}
      <button
        onClick={() => inputRef.current?.click()}
        className="w-full aspect-square bg-[#0D0D0D] rounded-xl flex items-center justify-center overflow-hidden border border-[#2A2A2A] hover:border-[#C9A227]/40 transition-colors"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="aperçu" className="w-full h-full object-contain p-2" />
        ) : (
          <div className="flex flex-col items-center gap-1">
            <Upload size={18} className="text-[#3A3A3A]" />
            <span className="text-[#3A3A3A] text-[9px]">Choisir une image</span>
          </div>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={choisirImage}
      />

      {/* Nom */}
      <input
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && valider()}
        placeholder="Nom de la figurine"
        className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg px-2 py-1.5 text-[#F5F5F5] text-xs placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#C9A227]/50"
      />

      {/* Actions */}
      <div className="flex gap-1">
        <button
          onClick={valider}
          disabled={!nom.trim() || !fichier || loading}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-full bg-[#C9A227]/20 text-[#C9A227] text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#C9A227]/30 transition-colors"
        >
          <Check size={12} />
          {loading ? "Envoi…" : "Ajouter"}
        </button>
        <button
          onClick={annuler}
          disabled={loading}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2A2A2A] text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}
