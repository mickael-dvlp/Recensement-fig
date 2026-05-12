"use client";

import { useEffect, useRef, useState } from "react";
import { GripVertical, Pencil, Trash2, Plus, X, Check } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  getMemos,
  creerMemo,
  supprimerMemo,
  modifierMemo,
  mettreAJourOrdreMemos,
} from "@/lib/firestore";

export default function PageProjet() {
  const { utilisateur } = useAuth();

  const [memos, setMemos] = useState([]);
  const [chargement, setChargement] = useState(true);

  // Modal création
  const [modalOuverte, setModalOuverte] = useState(false);
  const [titreMemo, setTitreMemo] = useState("");
  const [texteMemo, setTexteMemo] = useState("");

  // Modal édition
  const [memoEdite, setMemoEdite] = useState(null);
  const [titreEdit, setTitreEdit] = useState("");
  const [texteEdit, setTexteEdit] = useState("");

  const [enregistrement, setEnregistrement] = useState(false);

  // Confirmation suppression
  const [memoAConfirmer, setMemoAConfirmer] = useState(null);

  // Drag and drop
  const [dragIndex, setDragIndex] = useState(null);
  const listRef = useRef(null);
  const memosRef = useRef(memos);
  const dragStateRef = useRef({ active: false, fromIndex: -1 });

  useEffect(() => { memosRef.current = memos; }, [memos]);

  // ---- CHARGEMENT ----
  useEffect(() => {
    if (!utilisateur) return;

    async function charger() {
      try {
        const listeMemos = await getMemos(utilisateur.uid);
        setMemos(listeMemos);
      } catch (e) {
        console.error("Erreur chargement mémos :", e);
      } finally {
        setChargement(false);
      }
    }

    charger();
  }, [utilisateur]);

  // ---- CRÉER UN MÉMO ----
  async function ajouterMemo() {
    if (!titreMemo.trim() || enregistrement) return;
    setEnregistrement(true);
    try {
      await creerMemo(utilisateur.uid, {
        titre: titreMemo.trim(),
        texte: texteMemo.trim(),
      });
      const listeMemos = await getMemos(utilisateur.uid);
      setMemos(listeMemos);
      fermerModal();
    } finally {
      setEnregistrement(false);
    }
  }

  function fermerModal() {
    setModalOuverte(false);
    setTitreMemo("");
    setTexteMemo("");
  }

  // ---- MODIFIER UN MÉMO ----
  function ouvrirEdition(memo) {
    setMemoEdite(memo);
    setTitreEdit(memo.titre);
    setTexteEdit(memo.texte || "");
  }

  async function sauvegarderModification() {
    if (!titreEdit.trim() || enregistrement) return;
    setEnregistrement(true);
    try {
      await modifierMemo(utilisateur.uid, memoEdite.id, {
        titre: titreEdit.trim(),
        texte: texteEdit.trim(),
      });
      setMemos((prev) =>
        prev.map((m) =>
          m.id === memoEdite.id
            ? { ...m, titre: titreEdit.trim(), texte: texteEdit.trim() }
            : m
        )
      );
      setMemoEdite(null);
    } finally {
      setEnregistrement(false);
    }
  }

  // ---- SUPPRIMER UN MÉMO ----
  async function confirmerSuppression() {
    if (!memoAConfirmer) return;
    await supprimerMemo(utilisateur.uid, memoAConfirmer);
    setMemos((prev) => prev.filter((m) => m.id !== memoAConfirmer));
    setMemoAConfirmer(null);
  }

  // ---- DRAG AND DROP ----
  function startDrag(e, index) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStateRef.current = { active: true, fromIndex: index };
    setDragIndex(index);
  }

  function moveDrag(e) {
    if (!dragStateRef.current.active) return;
    const items = Array.from(listRef.current?.children ?? []);

    for (let i = 0; i < items.length; i++) {
      const rect = items[i].getBoundingClientRect();
      if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
        const overIndex = i;
        if (overIndex !== dragStateRef.current.fromIndex) {
          const from = dragStateRef.current.fromIndex;
          dragStateRef.current.fromIndex = overIndex;
          setDragIndex(overIndex);
          setMemos((prev) => {
            const arr = [...prev];
            const [item] = arr.splice(from, 1);
            arr.splice(overIndex, 0, item);
            return arr;
          });
        }
        break;
      }
    }
  }

  function endDrag() {
    if (!dragStateRef.current.active) return;
    dragStateRef.current.active = false;
    setDragIndex(null);
    mettreAJourOrdreMemos(
      utilisateur.uid,
      memosRef.current.map((m) => m.id)
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] pb-10 px-4 w-full">
      {/* Ligne dorée */}
      <div className="h-0.5 bg-linear-to-r from-transparent via-[#C9A227] to-transparent" />

      {/* EN-TÊTE */}
      <div className="relative pt-6 pb-6 text-center">
        <h1 className="text-2xl font-extrabold text-[#F5F5F5] uppercase tracking-widest">
          Mémos
        </h1>
        <p className="text-[#6B6B6B] text-xs mt-1">
          {chargement
            ? "…"
            : `${memos.length} mémo${memos.length > 1 ? "s" : ""}`}
        </p>

        <button
          onClick={() => setModalOuverte(true)}
          aria-label="Créer un mémo"
          className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#C9A227] flex items-center justify-center hover:bg-[#E6C25A] transition-all"
        >
          <Plus size={20} className="text-[#0D0D0D]" />
        </button>
      </div>

      {/* LISTE MÉMOS */}
      {chargement ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-[#1A1A1A] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : memos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <p className="text-[#3A3A3A] text-sm">Aucun mémo pour l&apos;instant.</p>
          <p className="text-[#C9A227] text-xs">
            Appuie sur + pour créer ton premier mémo.
          </p>
        </div>
      ) : (
        <div ref={listRef} className="flex flex-col gap-3">
          {memos.map((memo, index) => (
            <div
              key={memo.id}
              className={`bg-[#1A1A1A] border rounded-2xl p-4 flex flex-col gap-2 transition-all duration-150 ${
                dragIndex === index
                  ? "border-[#C9A227]/50 opacity-60 scale-[1.01]"
                  : "border-[#2A2A2A]"
              }`}
            >
              <div className="flex items-start gap-2">
                {/* Drag handle */}
                <button
                  onPointerDown={(e) => startDrag(e, index)}
                  onPointerMove={moveDrag}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                  className="shrink-0 mt-0.5 touch-none cursor-grab active:cursor-grabbing text-[#3A3A3A] hover:text-[#6B6B6B] transition-colors"
                  aria-label="Déplacer le mémo"
                >
                  <GripVertical size={16} />
                </button>

                {/* Titre */}
                <p className="flex-1 text-[#F5F5F5] font-bold text-sm leading-snug">
                  {memo.titre}
                </p>

                {/* Bouton édition */}
                <button
                  onClick={() => ouvrirEdition(memo)}
                  aria-label="Modifier le mémo"
                  className="shrink-0 w-7 h-7 rounded-full bg-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:bg-[#C9A227]/20 hover:text-[#C9A227] transition-colors"
                >
                  <Pencil size={12} />
                </button>

                {/* Bouton suppression ou confirmation */}
                {memoAConfirmer === memo.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={confirmerSuppression}
                      aria-label="Confirmer la suppression"
                      className="shrink-0 w-7 h-7 rounded-full bg-red-900/40 flex items-center justify-center text-red-400 hover:bg-red-900/60 transition-colors"
                    >
                      <Check size={12} />
                    </button>
                    <button
                      onClick={() => setMemoAConfirmer(null)}
                      aria-label="Annuler"
                      className="shrink-0 w-7 h-7 rounded-full bg-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setMemoAConfirmer(memo.id)}
                    aria-label="Supprimer le mémo"
                    className="shrink-0 w-7 h-7 rounded-full bg-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:bg-red-900/30 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>

              {memo.texte && (
                <p className="text-[#6B6B6B] text-sm leading-relaxed whitespace-pre-wrap pl-6">
                  {memo.texte}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MODAL CRÉATION */}
      {modalOuverte && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) fermerModal();
          }}
        >
          <div className="w-full max-w-md bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[#F5F5F5] font-bold uppercase tracking-widest text-sm">
                Nouveau mémo
              </h2>
              <button
                onClick={fermerModal}
                className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <input
              type="text"
              value={titreMemo}
              onChange={(e) => setTitreMemo(e.target.value)}
              placeholder="Titre"
              autoFocus
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-[#F5F5F5] text-sm placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#C9A227]/50 transition-colors"
            />

            <textarea
              value={texteMemo}
              onChange={(e) => setTexteMemo(e.target.value)}
              placeholder="Contenu du mémo…"
              rows={4}
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-[#D4D4D4] text-sm placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#C9A227]/50 resize-none transition-colors"
            />

            <button
              onClick={ajouterMemo}
              disabled={!titreMemo.trim() || enregistrement}
              className="w-full py-3 rounded-xl bg-[#C9A227] text-[#0D0D0D] font-bold text-sm uppercase tracking-widest hover:bg-[#E6C25A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {enregistrement ? "Enregistrement…" : "Créer"}
            </button>
          </div>
        </div>
      )}

      {/* MODAL ÉDITION */}
      {memoEdite && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMemoEdite(null);
          }}
        >
          <div className="w-full max-w-md bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[#F5F5F5] font-bold uppercase tracking-widest text-sm">
                Modifier le mémo
              </h2>
              <button
                onClick={() => setMemoEdite(null)}
                className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <input
              type="text"
              value={titreEdit}
              onChange={(e) => setTitreEdit(e.target.value)}
              placeholder="Titre"
              autoFocus
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-[#F5F5F5] text-sm placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#C9A227]/50 transition-colors"
            />

            <textarea
              value={texteEdit}
              onChange={(e) => setTexteEdit(e.target.value)}
              placeholder="Contenu du mémo…"
              rows={4}
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-[#D4D4D4] text-sm placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#C9A227]/50 resize-none transition-colors"
            />

            <button
              onClick={sauvegarderModification}
              disabled={!titreEdit.trim() || enregistrement}
              className="w-full py-3 rounded-xl bg-[#C9A227] text-[#0D0D0D] font-bold text-sm uppercase tracking-widest hover:bg-[#E6C25A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {enregistrement ? "Enregistrement…" : "Sauvegarder"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
