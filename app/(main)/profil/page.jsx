"use client";

// ============================================================
// PAGE PROFIL - Paramètres utilisateur
// ============================================================
// Affiche les informations du compte et permet de :
//   - Se déconnecter
//   - Voir les liens rapides vers les sections
//   - (Plus tard) Changer la langue FR/EN

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  User,
  Shield,
  ShoppingCart,
  Sword,
  ChevronRight,
  Globe,
  Moon,
  Sun,
  Users,
  Pencil,
  X,
  Check,
  Trash2,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { modifierPseudo, nettoyerInventaireOrphelins } from "@/lib/firestore";

export default function PageProfil() {
  const { utilisateur, profil, rafraichirProfil, seDeconnecter, isInvite } =
    useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [chargementDeconnexion, setChargementDeconnexion] = useState(false);
  const [editPseudo, setEditPseudo] = useState(false);
  const [nouveauPseudo, setNouveauPseudo] = useState("");
  const [savingPseudo, setSavingPseudo] = useState(false);
  const [erreurPseudo, setErreurPseudo] = useState("");
  const [modalNettoyage, setModalNettoyage] = useState(false);
  const [nettoyageEnCours, setNettoyageEnCours] = useState(false);
  const [resultatNettoyage, setResultatNettoyage] = useState(null);
  const [modalMentions, setModalMentions] = useState(false);

  // Délai restant avant prochain changement de pseudo (en jours)
  const joursRestants = (() => {
    if (!profil?.dernierChangementPseudo) return 0;
    const dernierTs = profil.dernierChangementPseudo?.seconds
      ? profil.dernierChangementPseudo.seconds * 1000
      : new Date(profil.dernierChangementPseudo).getTime();
    const diff = 7 * 24 * 3600 * 1000 - (Date.now() - dernierTs);
    return diff > 0 ? Math.ceil(diff / (24 * 3600 * 1000)) : 0;
  })();

  async function handleSauvegarderPseudo() {
    if (!nouveauPseudo.trim() || savingPseudo) return;
    setErreurPseudo("");
    setSavingPseudo(true);
    try {
      await modifierPseudo(
        utilisateur.uid,
        profil.pseudo,
        nouveauPseudo.trim(),
      );
      await rafraichirProfil();
      setEditPseudo(false);
      setNouveauPseudo("");
    } catch (err) {
      setErreurPseudo(
        err.message === "pseudo_indisponible"
          ? "Ce pseudo est déjà utilisé."
          : "Une erreur est survenue.",
      );
    } finally {
      setSavingPseudo(false);
    }
  }

  async function handleNettoyage() {
    setNettoyageEnCours(true);
    setResultatNettoyage(null);
    try {
      const supprimees = await nettoyerInventaireOrphelins(utilisateur.uid);
      await rafraichirProfil();
      setResultatNettoyage({ ok: true, count: supprimees });
    } catch {
      setResultatNettoyage({ ok: false });
    } finally {
      setNettoyageEnCours(false);
    }
  }

  async function handleDeconnexion() {
    setChargementDeconnexion(true);
    try {
      await seDeconnecter();
      router.replace("/connexion");
    } catch {
      setChargementDeconnexion(false);
    }
  }

  // Calcul des initiales du pseudo pour l'avatar (ex: "JD" pour "Jean Dupont")
  const pseudo = profil?.pseudo || utilisateur?.displayName || "Utilisateur";
  const initiales = pseudo
    .split(" ")
    .map((mot) => mot[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  return (
    <div className="flex flex-col min-h-screen bg-[#0D0D0D]">
      {/* EN-TÊTE PROFIL */}
      <div className="bg-[#1A1A1A] full-width px-6 pt-0 pb-8 border-b border-[#2A2A2A]">
        <div className="h-0.5 bg-linear-to-r from-transparent via-[#C9A227] to-transparent mb-8" />

        {/* Avatar avec initiales + informations */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-[#C9A227]/10 border-2 border-[#C9A227] flex items-center justify-center">
            <span className="text-[#C9A227] text-2xl font-bold">
              {initiales}
            </span>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-[#F5F5F5]">{pseudo}</h1>
            <p className="text-[#6B6B6B] text-sm">{utilisateur?.email}</p>
          </div>
        </div>
      </div>

      <div className="py-6 flex flex-col gap-5">
        {/* SECTION COMPTE */}
        <section>
          <h2 className="text-[#C9A227] text-xs font-bold uppercase tracking-widest mb-3">
            Mon compte
          </h2>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
            {/* Pseudo modifiable */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#2A2A2A]">
              <User size={18} className="text-[#6B6B6B]" />
              <div className="flex-1 min-w-0">
                <p className="text-[#6B6B6B] text-xs">Pseudo</p>
                {editPseudo ? (
                  <div className="flex flex-col gap-1.5 mt-1">
                    <input
                      type="text"
                      value={nouveauPseudo}
                      onChange={(e) => {
                        setNouveauPseudo(e.target.value);
                        setErreurPseudo("");
                      }}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSauvegarderPseudo()
                      }
                      placeholder={pseudo}
                      autoFocus
                      className="bg-[#0D0D0D] border border-[#3A3A3A] rounded-lg px-3 py-1.5 text-[#F5F5F5] text-sm focus:outline-none focus:border-[#C9A227]/50 transition-colors"
                    />
                    {erreurPseudo && (
                      <p className="text-red-400 text-xs">{erreurPseudo}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-[#F5F5F5] text-sm font-medium">{pseudo}</p>
                )}
              </div>
              {joursRestants > 0 && !editPseudo ? (
                <span className="text-[10px] text-[#6B6B6B] shrink-0">
                  {joursRestants}j restant{joursRestants > 1 ? "s" : ""}
                </span>
              ) : editPseudo ? (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={handleSauvegarderPseudo}
                    disabled={!nouveauPseudo.trim() || savingPseudo}
                    className="w-7 h-7 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E] hover:bg-[#22C55E]/20 transition-colors disabled:opacity-40"
                  >
                    {savingPseudo ? (
                      <div className="w-3 h-3 border-2 border-[#22C55E] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check size={12} />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setEditPseudo(false);
                      setNouveauPseudo("");
                      setErreurPseudo("");
                    }}
                    className="w-7 h-7 rounded-full bg-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : isInvite ? (
                <span className="text-[#6B6B6B] text-[10px] uppercase tracking-wide shrink-0">
                  Compte requis
                </span>
              ) : (
                <button
                  onClick={() => {
                    setEditPseudo(true);
                    setNouveauPseudo("");
                  }}
                  className="shrink-0 w-7 h-7 rounded-full bg-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:text-[#C9A227] transition-colors"
                >
                  <Pencil size={12} />
                </button>
              )}
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#2A2A2A]">
              <User size={18} className="text-[#6B6B6B]" />
              <div className="flex-1">
                <p className="text-[#6B6B6B] text-xs">Email</p>
                <p className="text-[#F5F5F5] text-sm font-medium">
                  {utilisateur?.email}
                </p>
              </div>
            </div>

            {/* Date d'inscription */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#2A2A2A]">
              <Shield size={18} className="text-[#6B6B6B]" />
              <div className="flex-1">
                <p className="text-[#6B6B6B] text-xs">Membre depuis</p>
                <p className="text-[#F5F5F5] text-sm font-medium">
                  {profil?.creeLe
                    ? new Date(profil.creeLe).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Langue (à implémenter plus tard) */}
            <div className="flex items-center gap-3 px-4 py-3">
              <Globe size={18} className="text-[#6B6B6B]" />
              <div className="flex-1">
                <p className="text-[#6B6B6B] text-xs">Langue</p>
                <p className="text-[#F5F5F5] text-sm font-medium">
                  {profil?.langue === "en" ? "English" : "Français"}
                </p>
              </div>
              {/* Badge indiquant que cette fonctionnalité arrive bientôt */}
              <span className="text-[10px] bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/30 rounded-full px-2 py-0.5 font-semibold">
                Bientôt
              </span>
            </div>
          </div>
        </section>

        {/* SECTION APPARENCE */}
        <section>
          <h2 className="text-[#C9A227] text-xs font-bold uppercase tracking-widest mb-3">
            Apparence
          </h2>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
            {/*
              Bouton Mode : bascule entre mode sombre et mode clair.
              Le toggle switch indique visuellement le mode actif.
            */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#2A2A2A] transition-colors"
            >
              {/* Icône Lune (sombre) ou Soleil (clair) */}
              {theme === "dark" ? (
                <Moon size={18} className="text-[#6B6B6B]" />
              ) : (
                <Sun size={18} className="text-[#C9A227]" />
              )}

              {/* Label + état actuel */}
              <div className="flex-1 text-left">
                <p className="text-[#D4D4D4] text-sm font-medium">Mode</p>
                <p className="text-[#6B6B6B] text-xs">
                  {theme === "dark" ? "Sombre" : "Clair"}
                </p>
              </div>

              {/*
                Toggle switch visuel.
                Fond doré = mode clair activé, fond gris = mode sombre.
                Le rond blanc glisse de gauche (sombre) à droite (clair).
              */}
              <div
                className="relative w-12 h-6 rounded-full shrink-0 transition-colors duration-300"
                style={{
                  backgroundColor: theme === "light" ? "#C9A227" : "#3A3A3A",
                }}
              >
                <div
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300"
                  style={{
                    transform:
                      theme === "light"
                        ? "translateX(26px)"
                        : "translateX(4px)",
                  }}
                />
              </div>
            </button>
          </div>
        </section>

        {/* SECTION ACCÈS RAPIDE */}
        <section>
          <h2 className="text-[#C9A227] text-xs font-bold uppercase tracking-widest mb-3">
            Accès rapide
          </h2>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
            <button
              onClick={() => router.push("/figurines")}
              className="w-full flex items-center gap-3 px-4 py-3 border-b border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors"
            >
              <Shield size={18} className="text-[#22C55E]" />
              <span className="flex-1 text-left text-[#D4D4D4] text-sm">
                Mon inventaire
              </span>
              <ChevronRight size={16} className="text-[#3A3A3A]" />
            </button>

            <button
              onClick={() => router.push("/figurines?filtre=souhaite")}
              className="w-full flex items-center gap-3 px-4 py-3 border-b border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors"
            >
              <ShoppingCart size={18} className="text-[#C9A227]" />
              <span className="flex-1 text-left text-[#D4D4D4] text-sm">
                Ma liste de souhaits
              </span>
              <ChevronRight size={16} className="text-[#3A3A3A]" />
            </button>

            <button
              onClick={() => router.push("/projet")}
              className="w-full flex items-center gap-3 px-4 py-3 border-b border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors"
            >
              <Sword size={18} className="text-blue-400" />
              <span className="flex-1 text-left text-[#D4D4D4] text-sm">
                Mon projet en cours
              </span>
              <ChevronRight size={16} className="text-[#3A3A3A]" />
            </button>

            <button
              onClick={() => !isInvite && router.push("/amis")}
              disabled={isInvite}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#2A2A2A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Users
                size={18}
                className={isInvite ? "text-[#3A3A3A]" : "text-purple-400"}
              />
              <span className="flex-1 text-left text-[#D4D4D4] text-sm">
                Mes amis
              </span>
              {isInvite ? (
                <span className="text-[#6B6B6B] text-[10px] uppercase tracking-wide">
                  Compte requis
                </span>
              ) : (
                <ChevronRight size={16} className="text-[#3A3A3A]" />
              )}
            </button>
          </div>
        </section>

        {/* SECTION MENTIONS LÉGALES */}
        <section>
          <h2 className="text-[#C9A227] text-xs font-bold uppercase tracking-widest mb-3">
            Informations
          </h2>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
            <button
              onClick={() => setModalMentions(true)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#2A2A2A] transition-colors"
            >
              <FileText size={18} className="text-[#6B6B6B]" />
              <div className="flex-1 text-left">
                <p className="text-[#D4D4D4] text-sm font-medium">
                  Mentions légales
                </p>
                <p className="text-[#6B6B6B] text-xs">
                  Données, confidentialité & droits
                </p>
              </div>
              <ChevronRight size={16} className="text-[#3A3A3A]" />
            </button>
          </div>
        </section>

        {/* MODAL MENTIONS LÉGALES */}
        {modalMentions && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 px-4 pb-6 sm:pb-0">
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl w-full max-w-sm flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#2A2A2A] shrink-0">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-[#C9A227]" />
                  <h3 className="text-[#F5F5F5] font-bold text-base">
                    Mentions légales
                  </h3>
                </div>
                <button
                  onClick={() => setModalMentions(false)}
                  className="w-7 h-7 rounded-full bg-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Contenu scrollable */}
              <div className="overflow-y-auto px-5 py-4 flex flex-col gap-5 text-sm">
                {/* Éditeur */}
                <div className="flex flex-col gap-1.5">
                  <p className="text-[#C9A227] text-xs font-bold uppercase tracking-wider">
                    Éditeur
                  </p>
                  <p className="text-[#D4D4D4]">
                    Application :{" "}
                    <span className="text-[#F5F5F5] font-medium">
                      MESBG Collection
                    </span>
                  </p>
                  <p className="text-[#D4D4D4]">
                    Développeur :{" "}
                    <span className="text-[#F5F5F5] font-medium">
                      Mickael Martone
                    </span>
                  </p>
                  <p className="text-[#D4D4D4]">
                    Contact :{" "}
                    <span className="text-[#F5F5F5] font-medium">
                      mickael-dvlp@gmail.com
                    </span>
                  </p>
                  <p className="text-[#6B6B6B] text-xs leading-relaxed">
                    Application personnelle, non commerciale, sans affiliation
                    officielle.
                  </p>
                </div>

                <div className="h-px bg-[#2A2A2A]" />

                {/* Hébergement */}
                <div className="flex flex-col gap-1.5">
                  <p className="text-[#C9A227] text-xs font-bold uppercase tracking-wider">
                    Hébergement & données
                  </p>
                  <p className="text-[#6B6B6B] text-xs leading-relaxed">
                    Les données utilisateur (inventaire, profil, figurines
                    personnalisées) sont stockées sur{" "}
                    <span className="text-[#D4D4D4]">Firebase</span> (Google
                    Cloud Platform), dans des centres de données situés en
                    Europe.
                  </p>
                  <p className="text-[#6B6B6B] text-xs leading-relaxed">
                    Aucune donnée n'est revendue ni partagée avec des tiers.
                  </p>
                </div>

                <div className="h-px bg-[#2A2A2A]" />

                {/* RGPD */}
                <div className="flex flex-col gap-1.5">
                  <p className="text-[#C9A227] text-xs font-bold uppercase tracking-wider">
                    Données personnelles (RGPD)
                  </p>
                  <p className="text-[#6B6B6B] text-xs leading-relaxed">
                    Les seules données collectées sont :
                  </p>
                  <ul className="flex flex-col gap-1 pl-3">
                    {[
                      "Adresse e-mail (authentification)",
                      "Pseudo",
                      "Inventaire de figurines",
                    ].map((item) => (
                      <li
                        key={item}
                        className="text-[#D4D4D4] text-xs flex items-start gap-2"
                      >
                        <span className="text-[#C9A227] mt-0.5">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[#6B6B6B] text-xs leading-relaxed mt-1">
                    Vous pouvez demander la suppression de votre compte et de
                    toutes vos données à l'adresse :{" "}
                    <span className="text-[#D4D4D4]">
                      mickael-dvlp@gmail.com
                    </span>
                  </p>
                </div>

                <div className="h-px bg-[#2A2A2A]" />

                {/* Propriété intellectuelle */}
                <div className="flex flex-col gap-1.5">
                  <p className="text-[#C9A227] text-xs font-bold uppercase tracking-wider">
                    Propriété intellectuelle
                  </p>
                  <p className="text-[#6B6B6B] text-xs leading-relaxed">
                    Les noms, images et univers liés à{" "}
                    <span className="text-[#D4D4D4]">
                      The Lord of the Rings
                    </span>{" "}
                    et{" "}
                    <span className="text-[#D4D4D4]">
                      Middle-earth Strategy Battle Game (MESBG)
                    </span>{" "}
                    sont des marques déposées appartenant à{" "}
                    <span className="text-[#D4D4D4]">Games Workshop Ltd</span>{" "}
                    et/ou à leurs ayants droit respectifs.
                  </p>
                  <p className="text-[#6B6B6B] text-xs leading-relaxed">
                    Cette application est un projet personnel sans approbation
                    ni affiliation officielle avec Games Workshop.
                  </p>
                </div>

                <div className="h-px bg-[#2A2A2A]" />

                {/* Cookies */}
                <div className="flex flex-col gap-1.5">
                  <p className="text-[#C9A227] text-xs font-bold uppercase tracking-wider">
                    Cookies
                  </p>
                  <p className="text-[#6B6B6B] text-xs leading-relaxed">
                    Aucun cookie publicitaire ni outil de traçage tiers n'est
                    utilisé. Les tokens d'authentification Firebase sont stockés
                    localement dans votre navigateur pour maintenir votre
                    session.
                  </p>
                </div>

                <p className="text-[#3A3A3A] text-[10px] text-center pb-1">
                  Dernière mise à jour : mai 2025
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION MAINTENANCE */}
        <section>
          <h2 className="text-[#C9A227] text-xs font-bold uppercase tracking-widest mb-3">
            Maintenance
          </h2>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
            <button
              onClick={() => {
                setModalNettoyage(true);
                setResultatNettoyage(null);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#2A2A2A] transition-colors"
            >
              <Trash2 size={18} className="text-orange-400" />
              <div className="flex-1 text-left">
                <p className="text-[#D4D4D4] text-sm font-medium">
                  Nettoyer l'inventaire
                </p>
                <p className="text-[#6B6B6B] text-xs">
                  Supprimer les données obsolètes
                </p>
              </div>
              <ChevronRight size={16} className="text-[#3A3A3A]" />
            </button>
          </div>
        </section>

        {/* MODAL NETTOYAGE */}
        {modalNettoyage && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 px-4 pb-6 sm:pb-0">
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl w-full max-w-sm p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-400/10 flex items-center justify-center shrink-0">
                  <AlertTriangle size={20} className="text-orange-400" />
                </div>
                <h3 className="text-[#F5F5F5] font-bold text-base">
                  Nettoyer l'inventaire
                </h3>
              </div>

              <p className="text-[#6B6B6B] text-sm leading-relaxed">
                Suite aux mises à jour de l'application, certaines données de
                votre inventaire peuvent être obsolètes. Cette action supprime
                définitivement ces entrées inutilisées.
              </p>
              <p className="text-[#6B6B6B] text-sm leading-relaxed">
                Vos figurines possédées et souhaitées ne seront{" "}
                <span className="text-[#F5F5F5] font-medium">
                  pas affectées
                </span>
                .
              </p>

              {resultatNettoyage && (
                <div
                  className={`rounded-xl px-4 py-3 text-sm font-medium ${
                    resultatNettoyage.ok
                      ? "bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E]"
                      : "bg-red-900/20 border border-red-800 text-red-400"
                  }`}
                >
                  {resultatNettoyage.ok
                    ? resultatNettoyage.count === 0
                      ? "Inventaire déjà propre, rien à supprimer."
                      : `${resultatNettoyage.count} entrée${resultatNettoyage.count > 1 ? "s" : ""} supprimée${resultatNettoyage.count > 1 ? "s" : ""}.`
                    : "Une erreur est survenue. Réessaie plus tard."}
                </div>
              )}

              <div className="flex gap-3 mt-1">
                <button
                  onClick={() => {
                    setModalNettoyage(false);
                    setResultatNettoyage(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-[#2A2A2A] text-[#6B6B6B] hover:text-[#F5F5F5] hover:border-[#3A3A3A] transition-colors text-sm font-medium"
                >
                  {resultatNettoyage ? "Fermer" : "Annuler"}
                </button>
                {!resultatNettoyage && (
                  <button
                    onClick={handleNettoyage}
                    disabled={nettoyageEnCours}
                    className="flex-1 py-2.5 rounded-xl bg-orange-400/10 border border-orange-400/30 text-orange-400 hover:bg-orange-400/20 transition-colors text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {nettoyageEnCours ? (
                      <>
                        <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />{" "}
                        En cours…
                      </>
                    ) : (
                      <>
                        <Trash2 size={14} /> Nettoyer
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* BOUTON DÉCONNEXION */}
        <button
          onClick={handleDeconnexion}
          disabled={chargementDeconnexion}
          className="flex items-center justify-center gap-2 w-full bg-red-900/20 border border-red-800 hover:bg-red-900/40 disabled:opacity-50 text-red-400 font-bold uppercase tracking-wider py-3 rounded-xl transition-colors"
        >
          {chargementDeconnexion ? (
            <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <LogOut size={18} />
              Se déconnecter
            </>
          )}
        </button>

        {/* Version */}
        <p className="text-center text-[#3A3A3A] text-xs mt-2">
          MESBG Collection v1.0.0
        </p>
      </div>
    </div>
  );
}
