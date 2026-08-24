"use client";

import { Heart, Plus, Minus, X, Check, MoreHorizontal, Pencil, ImageIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { useCompteurFigurine } from "@/lib/hooks/useCompteurFigurine";

export default function FigurineRow({
  figurine,
  donneesUtilisateur,
  onMettreAJour,
  onSupprimer,
  onModifier,
}) {
  const idInventaire = figurine.inventaireId ?? figurine.id;
  const quantitePeinte = donneesUtilisateur?.quantitePeinte ?? 0;
  const {
    quantite,
    souhaite,
    quantiteSouhaitee,
    compteurVisible,
    ajouter: ajouterAInventaire,
    modifierQuantite,
    toggleSouhaite,
  } = useCompteurFigurine({
    id: idInventaire,
    donneesUtilisateur,
    onMettreAJour,
    quantitePeinte,
  });
  const [confirmerSuppression, setConfirmerSuppression] = useState(false);
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [editionNom, setEditionNom] = useState(false);
  const [nomEdit, setNomEdit] = useState(figurine.nom);
  const inputFichierRef = useRef(null);

  useEffect(() => {
    setNomEdit(figurine.nom);
  }, [figurine.nom]);

  async function modifierQuantitePeinte(delta) {
    const nouvelleQuantite = Math.min(
      quantite,
      Math.max(0, quantitePeinte + delta),
    );
    await onMettreAJour(idInventaire, {
      quantitePeinte: nouvelleQuantite,
    });
  }

  async function modifierQuantiteSouhaitee(delta) {
    const nouvelleQuantite = Math.max(1, quantiteSouhaitee + delta);
    await onMettreAJour(idInventaire, {
      quantiteSouhaitee: nouvelleQuantite,
    });
  }

  async function sauvegarderNom() {
    const trimmed = nomEdit.trim();
    if (trimmed && trimmed !== figurine.nom) {
      await onModifier({ nom: trimmed });
    }
    setEditionNom(false);
  }

  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden flex flex-col hover:border-[#3A3A3A] transition-colors">
      {/* Image */}
      <div className="w-full aspect-square bg-[#0D0D0D] flex items-center justify-center overflow-hidden relative">
        {figurine.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={figurine.image}
            alt={figurine.nom}
            className="max-w-full max-h-full object-contain p-3"
          />
        ) : (
          <PlaceholderImage />
        )}

        {/* Overlay d'édition */}
        {menuOuvert && (
          <div className="absolute inset-0 bg-[#0D0D0D]/85 flex flex-col items-center justify-center gap-3 z-10">
            <button
              onClick={() => { setEditionNom(true); setMenuOuvert(false); }}
              className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#3A3A3A] rounded-full text-xs text-[#F5F5F5] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors"
            >
              <Pencil size={11} />
              Renommer
            </button>
            <button
              onClick={() => { inputFichierRef.current?.click(); setMenuOuvert(false); }}
              className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#3A3A3A] rounded-full text-xs text-[#F5F5F5] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors"
            >
              <ImageIcon size={11} />
              Changer l&apos;image
            </button>
            <button
              onClick={() => setMenuOuvert(false)}
              className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center rounded-full bg-[#2A2A2A] text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
              aria-label="Fermer"
            >
              <X size={10} />
            </button>
          </div>
        )}

        {/* Input fichier caché pour changer l'image */}
        {onModifier && (
          <input
            ref={inputFichierRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) { onModifier({ file }); e.target.value = ""; }
            }}
          />
        )}

        {/* Boutons action top-right (masqués si overlay ouvert) */}
        {!menuOuvert && (
          <div className="absolute top-1.5 right-1.5 flex flex-col gap-1">
            {/* Bouton suppression */}
            {onSupprimer && (
              confirmerSuppression ? (
                <div className="flex gap-1">
                  <button
                    onClick={onSupprimer}
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-red-900/60 text-red-400 hover:bg-red-900/80 transition-colors"
                    aria-label="Confirmer la suppression"
                  >
                    <Check size={10} />
                  </button>
                  <button
                    onClick={() => setConfirmerSuppression(false)}
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-[#2A2A2A] text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
                    aria-label="Annuler"
                  >
                    <X size={10} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmerSuppression(true)}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-[#1A1A1A]/80 text-[#6B6B6B] hover:text-red-400 hover:bg-red-900/30 transition-colors"
                  aria-label="Supprimer la figurine"
                >
                  <X size={10} />
                </button>
              )
            )}

            {/* Bouton trois points */}
            {onModifier && !confirmerSuppression && (
              <button
                onClick={() => setMenuOuvert(true)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-[#1A1A1A]/80 text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
                aria-label="Modifier la figurine"
              >
                <MoreHorizontal size={10} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="flex flex-col gap-2 px-2 py-2 flex-1">
        {/* Nom */}
        {editionNom ? (
          <div className="flex items-center gap-1">
            <input
              value={nomEdit}
              onChange={(e) => setNomEdit(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sauvegarderNom();
                if (e.key === "Escape") { setEditionNom(false); setNomEdit(figurine.nom); }
              }}
              autoFocus
              className="flex-1 min-w-0 bg-[#0D0D0D] border border-[#C9A227]/50 rounded px-1.5 py-0.5 text-[#F5F5F5] text-xs text-center focus:outline-none"
            />
            <button
              onClick={sauvegarderNom}
              className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-[#C9A227]/20 text-[#C9A227] hover:bg-[#C9A227]/40 transition-colors"
              aria-label="Sauvegarder"
            >
              <Check size={9} />
            </button>
            <button
              onClick={() => { setEditionNom(false); setNomEdit(figurine.nom); }}
              className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-[#2A2A2A] text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
              aria-label="Annuler"
            >
              <X size={9} />
            </button>
          </div>
        ) : (
          <p className="text-[#F5F5F5] font-bold text-sm leading-snug text-center">
            {figurine.nom}
          </p>
        )}

        {/* Actions : bouton inventaire + cœur */}
        <div className="flex items-center gap-2 mt-auto pt-1">
          {compteurVisible ? (
            <div className="flex-1 flex items-center justify-between bg-[#0D0D0D] border border-[#3A3A3A] rounded-full px-3 py-1.5">
              <button
                onClick={() => modifierQuantite(-1)}
                className="text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
                aria-label="Réduire"
              >
                <Minus size={13} />
              </button>
              <span className="text-[#F5F5F5] font-bold text-sm min-w-5 text-center">
                {quantite}
              </span>
              <button
                onClick={() => modifierQuantite(1)}
                className="text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
                aria-label="Augmenter"
              >
                <Plus size={13} />
              </button>
            </div>
          ) : (
            <button
              onClick={ajouterAInventaire}
              className="flex-1 flex items-center justify-center gap-1.5 border border-[#3A3A3A] rounded-full py-1.5 text-xs text-[#6B6B6B] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors"
            >
              <Plus size={12} />
              Ajouter
            </button>
          )}

          {/* Cœur */}
          <button
            onClick={toggleSouhaite}
            aria-label={souhaite ? "Retirer des souhaités" : "Ajouter aux souhaités"}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-[#2A2A2A] hover:border-[#3A3A3A] transition-colors"
          >
            <Heart
              size={15}
              className={souhaite ? "fill-red-500 text-red-500" : "text-[#3A3A3A] hover:text-[#6B6B6B]"}
            />
          </button>
        </div>

        {/* Compteur quantité souhaitée */}
        {souhaite && (
          <div className="flex items-center justify-between mt-1.5 px-1">
            <span className="text-[#6B6B6B] text-[10px]">souhaite</span>
            <div className="flex items-center gap-2 bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-2.5 py-1">
              <button
                onClick={() => modifierQuantiteSouhaitee(-1)}
                className="text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
                aria-label="Réduire souhaitées"
              >
                <Minus size={11} />
              </button>
              <span className="text-red-400 font-bold text-xs min-w-4 text-center">
                {quantiteSouhaitee}
              </span>
              <button
                onClick={() => modifierQuantiteSouhaitee(1)}
                className="text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
                aria-label="Augmenter souhaitées"
              >
                <Plus size={11} />
              </button>
            </div>
          </div>
        )}

        {/* Compteur "dont peint" */}
        {quantite > 0 && (
          <div className="flex items-center justify-between mt-1.5 px-1">
            <span className="text-[#6B6B6B] text-[10px]">dont peint</span>
            <div className="flex items-center gap-2 bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-2.5 py-1">
              <button
                onClick={() => modifierQuantitePeinte(-1)}
                className="text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
                aria-label="Réduire peintes"
              >
                <Minus size={11} />
              </button>
              <span className="text-[#C9A227] font-bold text-xs min-w-4 text-center">
                {quantitePeinte}
              </span>
              <button
                onClick={() => modifierQuantitePeinte(1)}
                className="text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
                aria-label="Augmenter peintes"
              >
                <Plus size={11} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
