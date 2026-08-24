"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GripVertical, Pencil, Trash2, Plus, X, Check, Maximize2, Minimize2, Minus } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  getMemos,
  creerMemo,
  supprimerMemo,
  modifierMemo,
  mettreAJourOrdreMemos,
  getInventaireUtilisateur,
} from "@/lib/firestore";
import { getAllFigurines } from "@/data/factions/index.js";
import { FACTIONS_BIEN } from "@/data/figurines/index.js";

// ---- COMPOSANTS PARTAGÉS ----

const TYPES_MEMO = [
  { value: "memo", label: "Mémo" },
  { value: "peinture", label: "Peinture à prioriser" },
  { value: "achat", label: "Figurine à acheter" },
];

function SelecteurType({ valeur, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
      {TYPES_MEMO.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all whitespace-nowrap ${
            valeur === value
              ? "bg-[#C9A227] text-[#0D0D0D]"
              : "border border-[#3A3A3A] text-[#6B6B6B] hover:border-[#6B6B6B]"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function LigneFigurine({ fig, selection, onToggle, onQuantiteChange }) {
  const item = selection.find((f) => f.id === fig.id);
  const selectionne = !!item;

  return (
    <div className="flex items-center gap-2 py-2 border-b border-[#2A2A2A]/50 last:border-0">
      <button
        onClick={() => onToggle(fig)}
        className={`shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          selectionne
            ? "bg-[#C9A227] border-[#C9A227]"
            : "border-[#3A3A3A] hover:border-[#6B6B6B]"
        }`}
        aria-label={selectionne ? "Désélectionner" : "Sélectionner"}
      >
        {selectionne && <Check size={10} className="text-[#0D0D0D]" />}
      </button>
      <span className="flex-1 text-[#D4D4D4] text-sm leading-tight">{fig.nom}</span>
      <span className="hidden sm:block text-[#6B6B6B] text-[10px] truncate max-w-24">{fig.faction}</span>
      {selectionne && (
        <div className="shrink-0 flex items-center gap-1 bg-[#0D0D0D] border border-[#3A3A3A] rounded-full px-2 py-0.5">
          <button
            onClick={() => onQuantiteChange(fig.id, Math.max(1, item.quantite - 1))}
            className="text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
          >
            <Minus size={10} />
          </button>
          <span className="text-[#F5F5F5] font-bold text-xs min-w-4 text-center">
            {item.quantite}
          </span>
          <button
            onClick={() => onQuantiteChange(fig.id, item.quantite + 1)}
            className="text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
          >
            <Plus size={10} />
          </button>
        </div>
      )}
    </div>
  );
}

function ListeFigurines({ liste, selection, onToggle, onQuantiteChange }) {
  const bien = liste.filter((f) => f.camp === "bien");
  const mal = liste.filter((f) => f.camp === "mal");

  if (liste.length === 0) {
    return (
      <p className="text-[#3A3A3A] text-sm text-center py-8">
        Aucune figurine disponible.
      </p>
    );
  }

  return (
    <div className="overflow-y-auto flex-1 min-h-0">
      {bien.length > 0 && (
        <div>
          <p className="text-[#C9A227] text-xs font-bold uppercase tracking-widest py-1.5 sticky top-0 bg-[#1A1A1A] z-10">
            Bien
          </p>
          {bien.map((fig) => (
            <LigneFigurine
              key={fig.id}
              fig={fig}
              selection={selection}
              onToggle={onToggle}
              onQuantiteChange={onQuantiteChange}
            />
          ))}
        </div>
      )}
      {mal.length > 0 && (
        <div className="mt-2">
          <p className="text-[#C9A227] text-xs font-bold uppercase tracking-widest py-1.5 sticky top-0 bg-[#1A1A1A] z-10">
            Mal
          </p>
          {mal.map((fig) => (
            <LigneFigurine
              key={fig.id}
              fig={fig}
              selection={selection}
              onToggle={onToggle}
              onQuantiteChange={onQuantiteChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---- PAGE PRINCIPALE ----

export default function PageProjet() {
  const { utilisateur } = useAuth();

  const [memos, setMemos] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [inventaire, setInventaire] = useState({});

  // Modal création
  const [modalOuverte, setModalOuverte] = useState(false);
  const [titreMemo, setTitreMemo] = useState("");
  const [texteMemo, setTexteMemo] = useState("");
  const [typeMemo, setTypeMemo] = useState("memo");
  const [figurinesSelection, setFigurinesSelection] = useState([]);

  // Modal édition
  const [memoEdite, setMemoEdite] = useState(null);
  const [titreEdit, setTitreEdit] = useState("");
  const [texteEdit, setTexteEdit] = useState("");
  const [typeEdit, setTypeEdit] = useState("memo");
  const [figurinesSelectionEdit, setFigurinesSelectionEdit] = useState([]);

  const [enregistrement, setEnregistrement] = useState(false);
  const [erreurMemo, setErreurMemo] = useState("");
  const [erreurAction, setErreurAction] = useState("");

  // Confirmation suppression
  const [memoAConfirmer, setMemoAConfirmer] = useState(null);

  // Vue agrandie (tablette/ordinateur uniquement)
  const [memoAgrandiId, setMemoAgrandiId] = useState(null);

  // Drag and drop
  const [dragIndex, setDragIndex] = useState(null);
  const listRef = useRef(null);
  const memosRef = useRef(memos);
  const dragStateRef = useRef({ active: false, fromIndex: -1 });
  const dragRafRef = useRef(null);

  useEffect(() => { memosRef.current = memos; }, [memos]);

  // ---- CHARGEMENT ----
  useEffect(() => {
    if (!utilisateur) return;

    async function charger() {
      try {
        const [listeMemos, inv] = await Promise.all([
          getMemos(utilisateur.uid),
          getInventaireUtilisateur(utilisateur.uid),
        ]);
        setMemos(listeMemos);
        setInventaire(inv);
      } catch (e) {
        console.error("Erreur chargement mémos :", e);
      } finally {
        setChargement(false);
      }
    }

    charger();
  }, [utilisateur]);

  // ---- FIGURINES DISPONIBLES ----
  const figurinesDisponibles = useMemo(() => {
    const toutes = getAllFigurines()
      .map((fig) => ({
        id: fig.inventaireId ?? fig.id,
        nom: fig.nom,
        faction: fig.faction,
        camp: FACTIONS_BIEN.includes(fig.faction) ? "bien" : "mal",
        inv: inventaire[fig.inventaireId ?? fig.id],
      }))
      .filter((fig, index, arr) => arr.findIndex((f) => f.id === fig.id) === index)
      .sort((a, b) => {
        if (a.camp !== b.camp) return a.camp === "bien" ? -1 : 1;
        return a.nom.localeCompare(b.nom, "fr");
      });

    const peinture = toutes
      .filter(
        (f) =>
          f.inv?.enInventaire &&
          (f.inv.quantiteInventaire || 0) - (f.inv.quantitePeinte || 0) > 0
      )
      .map((f) => ({
        ...f,
        quantiteDefaut:
          (f.inv.quantiteInventaire || 0) - (f.inv.quantitePeinte || 0),
      }));

    const achat = toutes
      .filter((f) => f.inv?.souhaite === true)
      .map((f) => ({ ...f, quantiteDefaut: f.inv.quantiteSouhaitee || 1 }));

    return { peinture, achat };
  }, [inventaire]);

  // ---- SÉLECTION FIGURINES ----
  function toggleFigurine(fig, setSelection) {
    setSelection((prev) => {
      const exists = prev.find((f) => f.id === fig.id);
      if (exists) return prev.filter((f) => f.id !== fig.id);
      return [
        ...prev,
        {
          id: fig.id,
          nom: fig.nom,
          faction: fig.faction,
          camp: fig.camp,
          quantite: fig.quantiteDefaut ?? 1,
        },
      ];
    });
  }

  function updateQuantite(figId, quantite, setSelection) {
    setSelection((prev) =>
      prev.map((f) => (f.id === figId ? { ...f, quantite } : f))
    );
  }

  // ---- CRÉER UN MÉMO ----
  // fermerSiVide : utilisé par le clic sur le fond de la modale (sauvegarde silencieuse
  // seulement s'il y a du contenu, sinon ferme sans rien créer). Le bouton "Créer" force
  // toujours la création, même vide ("Sans Nom").
  async function ajouterMemo({ fermerSiVide = false } = {}) {
    if (enregistrement) return;
    const titre = titreMemo.trim() || "Sans Nom";
    const texte = typeMemo === "memo" ? texteMemo.trim() : "";
    const figurines = typeMemo !== "memo" ? figurinesSelection : [];
    if (fermerSiVide && !titreMemo.trim() && !texte && figurines.length === 0) {
      fermerModal();
      return;
    }
    setEnregistrement(true);
    setErreurMemo("");
    try {
      const newId = await creerMemo(utilisateur.uid, {
        titre,
        texte,
        type: typeMemo,
        figurines,
      });
      setMemos((prev) => [
        ...prev,
        { id: newId, titre, texte, type: typeMemo, figurines, ordre: -Date.now() },
      ]);
      fermerModal();
    } catch (err) {
      if (err.message === "limite_memos_atteinte") {
        setErreurMemo(`Limite de ${100} mémos atteinte.`);
      }
    } finally {
      setEnregistrement(false);
    }
  }

  function fermerModal() {
    setModalOuverte(false);
    setTitreMemo("");
    setTexteMemo("");
    setTypeMemo("memo");
    setFigurinesSelection([]);
    setErreurMemo("");
  }

  // ---- MODIFIER UN MÉMO ----
  function ouvrirEdition(memo) {
    setMemoEdite(memo);
    setTitreEdit(memo.titre);
    setTexteEdit(memo.texte || "");
    setTypeEdit(memo.type || "memo");
    setFigurinesSelectionEdit(memo.figurines || []);
  }

  async function sauvegarderModification() {
    if (!titreEdit.trim() || enregistrement) return;
    setEnregistrement(true);
    const updateData = {
      titre: titreEdit.trim(),
      texte: typeEdit === "memo" ? texteEdit.trim() : "",
      type: typeEdit,
      figurines: typeEdit !== "memo" ? figurinesSelectionEdit : [],
    };
    try {
      await modifierMemo(utilisateur.uid, memoEdite.id, updateData);
      setMemos((prev) =>
        prev.map((m) =>
          m.id === memoEdite.id ? { ...m, ...updateData } : m
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
    const id = memoAConfirmer;
    setErreurAction("");
    try {
      await supprimerMemo(utilisateur.uid, id);
      setMemos((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Erreur suppression mémo :", err);
      setErreurAction("Impossible de supprimer ce mémo. Réessaie.");
    } finally {
      setMemoAConfirmer(null);
    }
  }

  // ---- DRAG AND DROP ----
  function startDrag(e, index) {
    // Capturer le pointeur sur le conteneur pour continuer à recevoir les événements
    // même si la souris/le doigt sort des limites du div (sinon le drag se "bloque").
    listRef.current?.setPointerCapture(e.pointerId);
    dragStateRef.current = { active: true, fromIndex: index };
    setDragIndex(index);
  }

  // Throttlé via requestAnimationFrame : pointermove peut se déclencher bien plus vite
  // que le taux de rafraîchissement, et chaque appel force un reflow (getBoundingClientRect).
  function moveDrag(e) {
    if (!dragStateRef.current.active || dragRafRef.current) return;
    const clientY = e.clientY;
    dragRafRef.current = requestAnimationFrame(() => {
      dragRafRef.current = null;
      if (!dragStateRef.current.active) return;
      const items = Array.from(listRef.current?.children ?? []);
      for (let i = 0; i < items.length; i++) {
        const rect = items[i].getBoundingClientRect();
        if (clientY >= rect.top && clientY <= rect.bottom) {
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
    });
  }

  function endDrag() {
    if (!dragStateRef.current.active) return;
    dragStateRef.current.active = false;
    if (dragRafRef.current) {
      cancelAnimationFrame(dragRafRef.current);
      dragRafRef.current = null;
    }
    setDragIndex(null);
    mettreAJourOrdreMemos(
      utilisateur.uid,
      memosRef.current.map((m) => m.id)
    ).catch((err) => {
      console.error("Erreur sauvegarde de l'ordre des mémos :", err);
      setErreurAction("L'ordre n'a pas pu être sauvegardé. Recharge la page pour réessayer.");
    });
  }

  // ---- CONTENU MODAL (partagé création / édition) ----
  function renderContenu(type, texte, setTexte, listeFigs, selection, setSelection) {
    if (type === "memo") {
      return (
        <textarea
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          placeholder="Contenu du mémo…"
          rows={4}
          className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-[#D4D4D4] text-sm placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#C9A227]/50 resize-none transition-colors md:min-h-64"
        />
      );
    }
    return (
      <ListeFigurines
        liste={listeFigs}
        selection={selection}
        onToggle={(fig) => toggleFigurine(fig, setSelection)}
        onQuantiteChange={(id, q) => updateQuantite(id, q, setSelection)}
      />
    );
  }

  return (
    <div className="min-h-screen pb-10 px-4 w-full">
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

      {erreurAction && (
        <p className="text-red-400 text-xs bg-red-900/20 border border-red-800/40 rounded-xl px-3 py-2 text-center mb-4">
          {erreurAction}
        </p>
      )}

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
        <div ref={listRef} className="flex flex-col gap-3" onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag}>
          {memos.map((memo, index) => {
            const type = memo.type || "memo";
            const figurines = memo.figurines || [];
            return (
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
                    className="shrink-0 mt-0.5 touch-none cursor-grab active:cursor-grabbing text-[#3A3A3A] hover:text-[#6B6B6B] transition-colors"
                    aria-label="Déplacer le mémo"
                  >
                    <GripVertical size={16} />
                  </button>

                  {/* Titre + badge type */}
                  <div className="flex-1 flex flex-col gap-0.5">
                    <p className="text-[#F5F5F5] font-bold text-sm leading-snug">
                      {memo.titre}
                    </p>
                    {type !== "memo" && (
                      <p className="text-[#C9A227] text-[10px] uppercase tracking-wide font-semibold">
                        {type === "peinture" ? "Peinture à prioriser" : "Figurine à acheter"}
                      </p>
                    )}
                  </div>

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

                {/* Contenu résumé */}
                {type === "memo" && memo.texte && (
                  <p className="text-[#6B6B6B] text-sm leading-relaxed whitespace-pre-wrap pl-6">
                    {memo.texte}
                  </p>
                )}
                {type !== "memo" && figurines.length > 0 && (
                  <p className="text-[#6B6B6B] text-xs pl-6">
                    {figurines.length} figurine{figurines.length > 1 ? "s" : ""} sélectionnée{figurines.length > 1 ? "s" : ""}
                  </p>
                )}

                {/* Bouton agrandir — tablette/ordinateur uniquement */}
                <div className="hidden md:flex justify-end">
                  <button
                    onClick={() => setMemoAgrandiId(memo.id)}
                    aria-label="Agrandir le mémo"
                    className="w-6 h-6 flex items-center justify-center text-[#3A3A3A] hover:text-[#6B6B6B] transition-colors"
                  >
                    <Maximize2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VUE AGRANDIE — tablette/ordinateur uniquement */}
      {memoAgrandiId && (() => {
        const memo = memos.find((m) => m.id === memoAgrandiId);
        if (!memo) return null;
        const type = memo.type || "memo";
        const figurines = memo.figurines || [];
        return (
          <div
            className="fixed inset-0 z-60 hidden md:flex items-center justify-center p-8 bg-black/70 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setMemoAgrandiId(null); }}
          >
            <div className="w-full max-w-2xl max-h-[80vh] bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 flex flex-col gap-4 overflow-hidden">
              <div className="flex items-start justify-between shrink-0 gap-4">
                <div>
                  <h2 className="text-[#F5F5F5] font-extrabold text-xl uppercase tracking-widest">
                    {memo.titre}
                  </h2>
                  {type !== "memo" && (
                    <p className="text-[#C9A227] text-xs uppercase tracking-wide font-semibold mt-0.5">
                      {type === "peinture" ? "Peinture à prioriser" : "Figurine à acheter"}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => { setMemoAgrandiId(null); ouvrirEdition(memo); }}
                    aria-label="Modifier le mémo"
                    className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:bg-[#C9A227]/20 hover:text-[#C9A227] transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setMemoAgrandiId(null)}
                    aria-label="Réduire le mémo"
                    className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
                  >
                    <Minimize2 size={14} />
                  </button>
                </div>
              </div>
              <div className="h-px bg-[#2A2A2A] shrink-0" />
              {type === "memo" ? (
                memo.texte ? (
                  <p className="text-[#D4D4D4] text-base leading-relaxed whitespace-pre-wrap overflow-y-auto flex-1">
                    {memo.texte}
                  </p>
                ) : (
                  <p className="text-[#3A3A3A] text-sm italic">Aucun contenu.</p>
                )
              ) : figurines.length > 0 ? (
                <div className="overflow-y-auto flex-1">
                  {["bien", "mal"].map((camp) => {
                    const figs = figurines.filter((f) => f.camp === camp);
                    if (figs.length === 0) return null;
                    return (
                      <div key={camp}>
                        <p className="text-[#C9A227] text-xs font-bold uppercase tracking-widest py-1.5">
                          {camp === "bien" ? "Bien" : "Mal"}
                        </p>
                        {figs.map((fig) => (
                          <div
                            key={fig.id}
                            className="flex items-center gap-3 py-2 border-b border-[#2A2A2A]/50 last:border-0"
                          >
                            <span className="flex-1 text-[#D4D4D4] text-sm">{fig.nom}</span>
                            <span className="text-[#6B6B6B] text-xs">{fig.faction}</span>
                            <span className="text-[#C9A227] font-bold text-sm">×{fig.quantite}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[#3A3A3A] text-sm italic">Aucune figurine sélectionnée.</p>
              )}
            </div>
          </div>
        );
      })()}

      {/* MODAL CRÉATION */}
      {modalOuverte && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) ajouterMemo({ fermerSiVide: true });
          }}
        >
          <div className="w-full max-w-md md:max-w-2xl bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 md:p-10 flex flex-col gap-4 max-h-[90vh]">
            <div className="flex items-center justify-between shrink-0">
              <h2 className="text-[#F5F5F5] font-bold uppercase tracking-widest text-sm md:text-base">
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
              className="shrink-0 w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-[#F5F5F5] text-sm placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#C9A227]/50 transition-colors"
            />

            <div className="shrink-0">
              <SelecteurType
                valeur={typeMemo}
                onChange={(v) => { setTypeMemo(v); setFigurinesSelection([]); }}
              />
            </div>

            <div className="flex-1 min-h-0 flex flex-col">
              {renderContenu(
                typeMemo, texteMemo, setTexteMemo,
                figurinesDisponibles[typeMemo] ?? [],
                figurinesSelection, setFigurinesSelection
              )}
            </div>

            {erreurMemo && (
              <p className="shrink-0 text-red-400 text-xs text-center">{erreurMemo}</p>
            )}
            <button
              onClick={() => ajouterMemo()}
              disabled={enregistrement}
              className="shrink-0 w-full py-3 rounded-xl bg-[#C9A227] text-[#0D0D0D] font-bold text-sm uppercase tracking-widest hover:bg-[#E6C25A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
          <div className="w-full max-w-md md:max-w-2xl bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 md:p-10 flex flex-col gap-4 max-h-[90vh]">
            <div className="flex items-center justify-between shrink-0">
              <h2 className="text-[#F5F5F5] font-bold uppercase tracking-widest text-sm md:text-base">
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
              className="shrink-0 w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-[#F5F5F5] text-sm placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#C9A227]/50 transition-colors"
            />

            <div className="shrink-0">
              <span className="inline-block px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-[#C9A227] text-[#0D0D0D]">
                {TYPES_MEMO.find((t) => t.value === typeEdit)?.label ?? "Mémo"}
              </span>
            </div>

            <div className="flex-1 min-h-0 flex flex-col">
              {renderContenu(
                typeEdit, texteEdit, setTexteEdit,
                figurinesDisponibles[typeEdit] ?? [],
                figurinesSelectionEdit, setFigurinesSelectionEdit
              )}
            </div>

            <button
              onClick={sauvegarderModification}
              disabled={!titreEdit.trim() || enregistrement}
              className="shrink-0 w-full py-3 rounded-xl bg-[#C9A227] text-[#0D0D0D] font-bold text-sm uppercase tracking-widest hover:bg-[#E6C25A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {enregistrement ? "Enregistrement…" : "Sauvegarder"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
