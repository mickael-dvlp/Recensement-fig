"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ClipboardList,
  Clipboard,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Info,
  Save,
  Trash2,
  Download,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useInventaire } from "@/lib/hooks/useInventaire";
import { parseTTS, aggregerFigurines, resoudreId } from "@/lib/tts-parser";
import { getListesTTS, creerListeTTS, supprimerListeTTS } from "@/lib/firestore";
import TTS_MAPPING from "@/data/tts-mapping.json";
import { getAllFigurines } from "@/data/factions/index.js";
import TOUS_LES_HEROS from "@/data/heros/index.js";

// Ancienne clé locale (pré-migration Firestore) — conservée pour proposer l'import
// une fois aux utilisateurs qui avaient déjà des listes sauvegardées sur cet appareil.
const STORAGE_KEY_LEGACY = "mesbg-listes";
const STORAGE_KEY_MIGRATION_FAITE = "mesbg-listes-migrees";
const MAX_LISTES = 10;

const _allFigs = getAllFigurines();

const NOM_PAR_ID = Object.fromEntries(_allFigs.map((f) => [f.id, f.nom]));

// IDs des figurines définies comme héros dans les données de faction (indépendamment de l'indentation TTS)
const HEROS_IDS = new Set(_allFigs.filter((f) => f.type === "heros").map((f) => f.id));

// Pour les héros liés au système /heroes, l'inventaire est stocké sous les IDs variantes
const LIEN_PAR_ID = Object.fromEntries(
  _allFigs.filter((f) => f.lienHero).map((f) => [f.id, f.lienHero])
);
// Stocke { id, nom, image } pour afficher le détail dans la modale
const VARIANTES_PAR_LIEN = Object.fromEntries(
  TOUS_LES_HEROS.map((h) => [
    h.nom,
    h.variantes.map((v) => ({ id: v.id, nom: v.nom, image: v.image ?? null })),
  ])
);

// Lecture d'un champ quantité : vérifie d'abord la figurine directe,
// puis agrège les variantes héros liées si aucune entrée directe n'existe.
function getQuantite(id, inventaire, champ) {
  const direct = inventaire[id]?.[champ] ?? 0;
  if (direct > 0) return direct;
  const lien = LIEN_PAR_ID[id];
  if (!lien) return 0;
  return (VARIANTES_PAR_LIEN[lien] ?? []).reduce(
    (s, v) => s + (inventaire[v.id]?.[champ] ?? 0),
    0
  );
}

const getPossedees = (id, inv) => getQuantite(id, inv, "quantiteInventaire");
const getPeint     = (id, inv) => getQuantite(id, inv, "quantitePeinte");

const PLACEHOLDER = `Coller votre liste ici…

Exemple :
(Boromir, Captain of the White Tower: Banner of Minas Tirith, Horse, Shield)
    (2x Knight of Minas Tirith:)
    (5x Warrior of Minas Tirith: Shield)
    (9x Warrior of Minas Tirith: Shield and spear)

(Faramir, Captain of Gondor:)
    (2x Warrior of Minas Tirith: Shield)
    (2x Ranger of Gondor: Spear)`;

function IconStatut({ statut }) {
  if (statut === "ok")
    return <CheckCircle2 size={15} className="text-green-400 shrink-0" />;
  if (statut === "partiel")
    return <AlertCircle size={15} className="text-yellow-400 shrink-0" />;
  return <XCircle size={15} className="text-red-400 shrink-0" />;
}

function ModalVariantes({ hero, onFermer }) {
  if (!hero) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onFermer}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-[#111111] border border-[#2A2A2A] rounded-2xl w-full max-w-lg flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-[#1E1E1E]">
          <h3 className="text-[#C9A227] font-bold text-base">{hero.nomFR}</h3>
          <button
            onClick={onFermer}
            aria-label="Fermer"
            className="text-[#4A4A4A] hover:text-[#F5F5F5] transition-colors text-xl leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Grille de variantes */}
        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[70vh] overflow-y-auto">
          {hero.variantes.map((v) => (
            <div
              key={v.id}
              className={`relative flex flex-col rounded-xl overflow-hidden border transition-colors ${
                v.quantite > 0
                  ? "border-green-500/30 bg-green-500/5"
                  : "border-[#1E1E1E] bg-[#0D0D0D]"
              }`}
            >
              {/* Image */}
              <div className="w-full aspect-square bg-[#0A0A0A] flex items-center justify-center overflow-hidden">
                {v.image ? (
                  <img
                    src={v.image}
                    alt={v.nom}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full border border-[#2A2A2A] bg-[#1A1A1A]" />
                )}
              </div>

              {/* Nom + quantité */}
              <div className="px-2.5 py-2.5 flex flex-col gap-1">
                <p className="text-[#D4D4D4] text-xs font-medium leading-snug">{v.nom}</p>
                <span
                  className={`text-sm font-bold ${
                    v.quantite > 0 ? "text-green-400" : "text-[#3A3A3A]"
                  }`}
                >
                  {v.quantite > 0 ? `×${v.quantite} possédé${v.quantite > 1 ? "s" : ""}` : "Non possédé"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PanneauListes({ listes, listeActive, onCharger, onSupprimer, chargement, className }) {
  const [confirmerId, setConfirmerId] = useState(null);
  const listeAConfirmer = listes.find((l) => l.id === confirmerId);

  return (
    <aside className={className ?? "hidden lg:flex flex-col gap-3 w-60 shrink-0 -ml-10"}>
      <div className="flex items-center justify-center gap-2">
        <h2 className="text-[#D4D4D4] text-[10px] font-bold uppercase tracking-wider">
          Listes sauvegardées
        </h2>
        <span className="text-[#D4D4D4] text-[10px]">
          {listes.length}/{MAX_LISTES}
        </span>
      </div>

      {chargement ? (
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-4 text-center">
          <p className="text-[#4A4A4A] text-xs">Chargement…</p>
        </div>
      ) : listes.length === 0 ? (
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-4 text-center">
          <p className="text-[#4A4A4A] text-xs">Aucune liste sauvegardée</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {listes.map((liste) => (
            <div
              key={liste.id}
              onClick={() => onCharger(liste)}
              className={`bg-[#111111] border rounded-xl p-3 flex flex-col gap-1 cursor-pointer transition-colors ${
                listeActive === liste.id
                  ? "border-[#C9A227]/40"
                  : "border-[#1E1E1E] hover:border-[#2A2A2A]"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p
                  className={`text-xs font-semibold truncate flex-1 text-center ${
                    listeActive === liste.id
                      ? "text-[#C9A227]"
                      : "text-[#D4D4D4]"
                  }`}
                >
                  {liste.nom}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmerId(liste.id);
                  }}
                  aria-label={`Supprimer la liste ${liste.nom}`}
                  className="text-[#3A3A3A] hover:text-red-400 transition-colors shrink-0 mt-0.5 cursor-pointer"
                >
                  <Trash2 size={11} />
                </button>
              </div>
              <p className="text-[#4A4A4A] text-[10px] text-center">
                {new Date(liste.date).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* MODAL CONFIRMATION SUPPRESSION LISTE */}
      {listeAConfirmer && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setConfirmerId(null); }}
        >
          <div className="w-full max-w-sm bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-[#F5F5F5] font-bold uppercase tracking-widest text-sm">
                Supprimer cette liste ?
              </h2>
              <p className="text-[#6B6B6B] text-xs">
                Es-tu sûr de vouloir supprimer{" "}
                <span className="text-[#D4D4D4] font-semibold">{listeAConfirmer.nom}</span> ?
                Cette action est irréversible.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmerId(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#1E1E1E] text-[#D4D4D4] font-semibold text-sm hover:bg-[#2A2A2A] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  onSupprimer(confirmerId);
                  setConfirmerId(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-900/40 border border-red-800/50 text-red-400 font-semibold text-sm hover:bg-red-900/60 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default function PageListe() {
  const { utilisateur } = useAuth();
  const { inventaire, chargement: chargementInv } = useInventaire(utilisateur?.uid);
  const [texte, setTexte] = useState("");
  const [resultats, setResultats] = useState(null);
  const [listes, setListes] = useState([]);
  const [chargementListes, setChargementListes] = useState(true);
  const [listeActive, setListeActive] = useState(null);
  const [afficherSauvegarde, setAfficherSauvegarde] = useState(false);
  const [nomSauvegarde, setNomSauvegarde] = useState("");
  const [erreurListes, setErreurListes] = useState("");
  const [heroModal, setHeroModal] = useState(null);

  // Listes locales trouvées avant migration vers Firestore — proposées en import
  // une fois, tant qu'elles n'ont pas été traitées (importées ou ignorées).
  const [listesLocales, setListesLocales] = useState([]);
  const [migrationEnCours, setMigrationEnCours] = useState(false);

  useEffect(() => {
    if (!utilisateur) {
      setChargementListes(false);
      return;
    }
    setChargementListes(true);
    getListesTTS(utilisateur.uid)
      .then(setListes)
      .catch(() => setErreurListes("Impossible de charger tes listes sauvegardées."))
      .finally(() => setChargementListes(false));
  }, [utilisateur]);

  // Détection ponctuelle des anciennes listes localStorage (pré-migration Firestore).
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY_MIGRATION_FAITE)) return;
      const anciennes = JSON.parse(localStorage.getItem(STORAGE_KEY_LEGACY) || "[]");
      if (anciennes.length > 0) setListesLocales(anciennes);
    } catch {
      // localStorage indisponible ou corrompu — pas grave, pas de bannière d'import
    }
  }, []);

  async function importerListesLocales() {
    if (!utilisateur || migrationEnCours) return;
    setMigrationEnCours(true);
    try {
      const placeDisponible = Math.max(0, MAX_LISTES - listes.length);
      const aImporter = listesLocales.slice(0, placeDisponible);
      for (const l of aImporter) {
        await creerListeTTS(utilisateur.uid, { nom: l.nom, texte: l.texte });
      }
      const fraiches = await getListesTTS(utilisateur.uid);
      setListes(fraiches);
      localStorage.setItem(STORAGE_KEY_MIGRATION_FAITE, "1");
      localStorage.removeItem(STORAGE_KEY_LEGACY);
      setListesLocales([]);
    } catch {
      setErreurListes("Import partiel ou échoué — réessaie.");
    } finally {
      setMigrationEnCours(false);
    }
  }

  function ignorerMigration() {
    try {
      localStorage.setItem(STORAGE_KEY_MIGRATION_FAITE, "1");
    } catch {
      // pas grave si ça échoue, la bannière peut juste réapparaître
    }
    setListesLocales([]);
  }

  function ouvrirModalHero(fig) {
    const lien = LIEN_PAR_ID[fig.id];
    if (!lien) return;
    const variantes = (VARIANTES_PAR_LIEN[lien] ?? []).map((v) => ({
      id: v.id,
      nom: v.nom,
      image: v.image,
      quantite: inventaire?.[v.id]?.quantiteInventaire ?? 0,
    }));
    setHeroModal({ nomFR: fig.nomFR, variantes });
  }

  // Colle le contenu du presse-papier dans la zone de texte (ex: liste copiée
  // depuis un autre site). Échoue silencieusement si l'accès est refusé
  // (permissions navigateur, contexte non sécurisé).
  async function collerDuPressePapier() {
    try {
      const contenu = await navigator.clipboard.readText();
      if (contenu) setTexte(contenu);
    } catch {
      // Accès presse-papier indisponible — l'utilisateur peut toujours coller manuellement (Ctrl+V)
    }
  }

  // Parse, agrège et résout la liste TTS, puis croise avec l'inventaire.
  // estHero est forcé à true si l'ID figure dans HEROS_IDS même si TTS ne l'indente pas.
  function analyser() {
    if (!texte.trim() || chargementInv) return;

    const brutes = parseTTS(texte);
    const agregees = aggregerFigurines(brutes);

    const mappees = [];
    const nonMappees = [];

    for (const fig of agregees) {
      const id = resoudreId(fig.nom, fig.options, TTS_MAPPING);
      if (id === "_skip") continue;
      if (id) {
        const possedees = getPossedees(id, inventaire);
        const peint = getPeint(id, inventaire);
        mappees.push({
          id,
          nomTTS: fig.nom,
          nomFR: NOM_PAR_ID[id] ?? fig.nom,
          options: fig.options,
          besoin: fig.quantite,
          possedees,
          peint,
          estHero: fig.estHero || HEROS_IDS.has(id),
        });
      } else {
        nonMappees.push({
          nomTTS: fig.nom,
          options: fig.options,
          besoin: fig.quantite,
        });
      }
    }

    mappees.sort((a, b) => {
      if (a.estHero !== b.estHero) return a.estHero ? -1 : 1;
      return a.nomFR.localeCompare(b.nomFR, "fr");
    });

    setResultats({ mappees, nonMappees });
  }

  function reinitialiser() {
    setResultats(null);
    setTexte("");
    setListeActive(null);
    setAfficherSauvegarde(false);
    setNomSauvegarde("");
  }

  async function sauvegarder() {
    if (!texte.trim() || !nomSauvegarde.trim() || !utilisateur) return;
    setErreurListes("");
    const nom = nomSauvegarde.trim();
    try {
      const id = await creerListeTTS(utilisateur.uid, { nom, texte });
      setListes((prev) => [{ id, nom, texte, creeLe: { seconds: Date.now() / 1000 } }, ...prev]);
      setListeActive(id);
      setAfficherSauvegarde(false);
      setNomSauvegarde("");
    } catch (err) {
      setErreurListes(
        err.message === "limite_listes_atteinte"
          ? "Limite de 10 listes atteinte."
          : "Impossible de sauvegarder cette liste. Réessaie."
      );
    }
  }

  function chargerListe(liste) {
    setTexte(liste.texte);
    setListeActive(liste.id);
    setResultats(null);
  }

  async function supprimerListe(id) {
    setErreurListes("");
    try {
      await supprimerListeTTS(utilisateur.uid, id);
      setListes((prev) => prev.filter((l) => l.id !== id));
      if (listeActive === id) setListeActive(null);
    } catch {
      setErreurListes("Impossible de supprimer cette liste. Réessaie.");
    }
  }

  const stats = useMemo(() => {
    if (!resultats) return null;
    const { mappees } = resultats;
    const besoin = mappees.reduce((s, f) => s + f.besoin, 0);
    const manquant = mappees.reduce(
      (s, f) => s + Math.max(0, f.besoin - f.possedees),
      0
    );
    return { besoin, possedees: besoin - manquant, manquant };
  }, [resultats]);

  function getStatut(fig) {
    if (fig.possedees >= fig.besoin) return "ok";
    if (fig.possedees > 0) return "partiel";
    return "manquant";
  }

  const peutSauvegarder = texte.trim() && listes.length < MAX_LISTES;

  return (
    <>
    <ModalVariantes hero={heroModal} onFermer={() => setHeroModal(null)} />
    <div className="max-w-2xl lg:max-w-5xl mx-auto px-4">

      {/* HEADER — ligne dorée collée en haut, titre centré */}
      <div className="h-0.5 bg-linear-to-r from-transparent via-[#C9A227] to-transparent" />
      <div className="relative flex items-center justify-center pt-6 pb-2">
        <h1 className="text-2xl font-bold text-[#F5F5F5] uppercase tracking-widest text-center">
          Liste d&apos;Armée
        </h1>
        <div className="absolute right-4 sm:right-0 flex items-center gap-3">
          {peutSauvegarder && !afficherSauvegarde && (
            <button
              onClick={() => setAfficherSauvegarde(true)}
              className="flex items-center gap-1.5 text-xs text-[#6B6B6B] hover:text-[#C9A227] transition-colors cursor-pointer"
            >
              <Save size={13} />
              <span className="hidden sm:inline">Enregistrer</span>
            </button>
          )}
          {resultats && (
            <button
              onClick={reinitialiser}
              className="flex items-center gap-1.5 text-xs text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
            >
              <RotateCcw size={13} />
              <span className="hidden sm:inline">Nouvelle liste</span>
            </button>
          )}
        </div>
      </div>
      <p className="text-[#D4D4D4] text-xs text-center mb-6 mt-4">
        Comparez une liste TTS avec votre inventaire
      </p>

      {/* BANNIÈRE MIGRATION — listes trouvées dans localStorage avant le passage à Firestore */}
      {listesLocales.length > 0 && (
        <div className="bg-[#111111] border border-[#C9A227]/30 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
          <Download size={18} className="text-[#C9A227] shrink-0" />
          <p className="flex-1 text-[#D4D4D4] text-xs leading-relaxed">
            {listesLocales.length} liste{listesLocales.length > 1 ? "s" : ""} trouvée{listesLocales.length > 1 ? "s" : ""} sur cet appareil, pas encore liée{listesLocales.length > 1 ? "s" : ""} à ton compte. Les importer pour les retrouver sur tous tes appareils ?
          </p>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={ignorerMigration}
              disabled={migrationEnCours}
              className="px-3 py-1.5 rounded-xl border border-[#2A2A2A] text-[#6B6B6B] hover:text-[#F5F5F5] text-xs font-medium transition-colors disabled:opacity-50"
            >
              Ignorer
            </button>
            <button
              onClick={importerListesLocales}
              disabled={migrationEnCours}
              className="px-3 py-1.5 rounded-xl bg-[#C9A227] text-[#0D0D0D] font-bold text-xs hover:bg-[#d4af3a] transition-colors disabled:opacity-50"
            >
              {migrationEnCours ? "Import…" : "Importer"}
            </button>
          </div>
        </div>
      )}

      {erreurListes && (
        <p className="text-red-400 text-xs bg-red-900/20 border border-red-800/50 rounded-xl px-4 py-2.5 text-center mb-6">
          {erreurListes}
        </p>
      )}

      <div className="flex gap-6">

        {/* ── PANNEAU GAUCHE (desktop) ── */}
        <PanneauListes
          listes={listes}
          listeActive={listeActive}
          onCharger={chargerListe}
          onSupprimer={supprimerListe}
          chargement={chargementListes}
        />

        {/* ── CONTENU PRINCIPAL ── */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">

          {/* FORMULAIRE SAUVEGARDE */}
          {afficherSauvegarde && (
            <div className="flex gap-2">
              <input
                type="text"
                value={nomSauvegarde}
                onChange={(e) => setNomSauvegarde(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sauvegarder()}
                placeholder="Nom de la liste…"
                autoFocus
                className="flex-1 bg-[#111111] border border-[#2A2A2A] focus:border-[#C9A227]/40 rounded-xl px-3 py-2 text-[#F5F5F5] text-sm placeholder-[#3A3A3A] focus:outline-none"
              />
              <button
                onClick={sauvegarder}
                disabled={!nomSauvegarde.trim()}
                className="bg-[#C9A227] disabled:opacity-40 text-[#0D0D0D] font-bold px-4 py-2 rounded-xl text-sm hover:bg-[#d4af3a] transition-colors"
              >
                Sauvegarder
              </button>
              <button
                onClick={() => {
                  setAfficherSauvegarde(false);
                  setNomSauvegarde("");
                }}
                aria-label="Annuler la sauvegarde"
                className="text-[#6B6B6B] hover:text-[#F5F5F5] px-2 transition-colors text-sm"
              >
                ✕
              </button>
            </div>
          )}

          {/* ── PHASE 1 : IMPORT ── */}
          {!resultats && (
            <div className="flex flex-col gap-4">
              <div className="relative bg-[#111111] border border-[#1E1E1E] rounded-2xl p-1.5">
                <button
                  type="button"
                  onClick={collerDuPressePapier}
                  className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#6B6B6B] hover:border-[#C9A227]/40 hover:text-[#C9A227] text-[10px] font-semibold uppercase tracking-wide transition-colors"
                >
                  <Clipboard size={12} /> Coller
                </button>
                <textarea
                  value={texte}
                  onChange={(e) => setTexte(e.target.value)}
                  placeholder={PLACEHOLDER}
                  rows={13}
                  className="w-full bg-transparent text-[#A0A0A0] placeholder-[#333333] text-xs font-mono p-3 pr-20 resize-none focus:outline-none leading-relaxed"
                />
              </div>

              <button
                onClick={analyser}
                disabled={!texte.trim() || chargementInv}
                className="flex items-center justify-center gap-2 bg-[#C9A227] hover:bg-[#d4af3a] disabled:opacity-40 disabled:cursor-not-allowed text-[#0D0D0D] font-bold py-3.5 rounded-2xl text-sm transition-colors"
              >
                {chargementInv ? (
                  <div className="w-4 h-4 border-2 border-[#0D0D0D] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ClipboardList size={16} />
                    Analyser la liste
                  </>
                )}
              </button>

              {/* Listes sauvegardées — sous "Analyser la liste" en mobile/tablette, masqué sur desktop (déjà en panneau latéral) */}
              <PanneauListes
                listes={listes}
                listeActive={listeActive}
                onCharger={chargerListe}
                onSupprimer={supprimerListe}
                chargement={chargementListes}
                className="flex lg:hidden flex-col gap-3 w-full mt-2"
              />
            </div>
          )}

          {/* ── PHASE 2 : RÉSULTATS ── */}
          {resultats && stats && (
            <>
              {/* Résumé chiffré */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Nécessaires", value: stats.besoin, couleur: "text-[#F5F5F5]" },
                  { label: "Possédées", value: stats.possedees, couleur: "text-green-400" },
                  { label: "Manquantes", value: stats.manquant, couleur: "text-red-400" },
                ].map(({ label, value, couleur }) => (
                  <div
                    key={label}
                    className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-4 text-center"
                  >
                    <p className={`text-2xl font-bold ${couleur}`}>{value}</p>
                    <p className="text-[#6B6B6B] text-[10px] mt-0.5 uppercase tracking-wider">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Tableau figurines */}
              <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl overflow-hidden">
                {/* En-tête */}
                <div className="grid grid-cols-[1fr_64px_64px_64px_24px] px-4 py-2.5 border-b border-[#1E1E1E]">
                  <span className="text-[#8A8A8A] text-[10px] uppercase tracking-wider font-bold">
                    Figurine
                  </span>
                  <span className="text-[#8A8A8A] text-[10px] uppercase tracking-wider font-bold text-center">
                    Besoin
                  </span>
                  <span className="text-[#8A8A8A] text-[10px] uppercase tracking-wider font-bold text-center">
                    Possédé
                  </span>
                  <span className="text-[#8A8A8A] text-[10px] uppercase tracking-wider font-bold text-center">
                    Peint
                  </span>
                  <span />
                </div>

                {/* Lignes */}
                {resultats.mappees.map((fig) => {
                  const statut = getStatut(fig);
                  const aVariantes = fig.estHero && !!LIEN_PAR_ID[fig.id];
                  return (
                    <div
                      key={fig.nomTTS + ":" + fig.options.join(",")}
                      onClick={aVariantes ? () => ouvrirModalHero(fig) : undefined}
                      onKeyDown={
                        aVariantes
                          ? (e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                ouvrirModalHero(fig);
                              }
                            }
                          : undefined
                      }
                      role={aVariantes ? "button" : undefined}
                      tabIndex={aVariantes ? 0 : undefined}
                      className={`grid grid-cols-[1fr_64px_64px_64px_24px] px-4 py-3 items-center border-b border-[#1A1A1A] last:border-0 ${
                        aVariantes ? "cursor-pointer hover:bg-[#181818] transition-colors focus:outline-none focus:bg-[#181818] focus:ring-1 focus:ring-[#C9A227]/50 focus:ring-inset" : ""
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <p
                          className={`text-sm font-medium truncate ${
                            fig.estHero ? "text-[#C9A227]" : "text-[#D4D4D4]"
                          }`}
                        >
                          {fig.nomFR}
                          {aVariantes && (
                            <span className="ml-1.5 text-[#4A4A4A] text-[10px] font-normal">↗</span>
                          )}
                        </p>
                        {fig.options.length > 0 && (
                          <p className="text-[#4A4A4A] text-[10px] truncate mt-0.5 capitalize">
                            {fig.options.join(", ")}
                          </p>
                        )}
                      </div>

                      <span className="text-[#A0A0A0] text-sm text-center">
                        {fig.besoin}
                      </span>

                      <span
                        className={`text-sm font-bold text-center ${
                          statut === "ok"
                            ? "text-green-400"
                            : statut === "partiel"
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {fig.possedees}
                      </span>

                      <span
                        className={`text-sm font-bold text-center ${
                          fig.peint >= fig.besoin
                            ? "text-[#C9A227]"
                            : fig.peint > 0
                            ? "text-yellow-400"
                            : "text-[#4A4A4A]"
                        }`}
                      >
                        {fig.peint}
                      </span>

                      <div className="flex justify-center">
                        <IconStatut statut={statut} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Figurines non reconnues */}
              {resultats.nonMappees.length > 0 && (
                <div className="bg-[#111111] border border-yellow-400/20 rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Info size={14} className="text-yellow-400 shrink-0" />
                    <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider">
                      Non reconnues ({resultats.nonMappees.length})
                    </p>
                  </div>
                  <p className="text-[#6B6B6B] text-xs leading-relaxed">
                    Ces figurines ne sont pas encore dans la table de
                    correspondance. Elles seront ajoutées faction par faction.
                  </p>
                  <div className="flex flex-col gap-2">
                    {resultats.nonMappees.map((fig, i) => (
                      <div key={i} className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[#A0A0A0] text-xs">{fig.nomTTS}</p>
                          {fig.options.length > 0 && (
                            <p className="text-[#4A4A4A] text-[10px] mt-0.5 capitalize">
                              {fig.options.join(", ")}
                            </p>
                          )}
                        </div>
                        <span className="text-[#6B6B6B] text-xs shrink-0">
                          ×{fig.besoin}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
