"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import CarteAuth from "@/components/auth/CarteAuth";
import BoutonGoogle from "@/components/auth/BoutonGoogle";
import BoutonInvite from "@/components/auth/BoutonInvite";

export default function PageConnexion() {
  const { seConnecter, seConnecterAvecGoogle, seConnecterEnInvite, reinitialiserMotDePasse } = useAuth();
  const router = useRouter();

  // États formulaire connexion
  const [email, setEmail]                       = useState("");
  const [motDePasse, setMotDePasse]             = useState("");
  const [afficherMotDePasse, setAfficher]       = useState(false);
  const [chargement, setChargement]             = useState(false);
  const [erreur, setErreur]                     = useState("");

  // États mot de passe oublié
  const [modeReset, setModeReset]               = useState(false);
  const [emailReset, setEmailReset]             = useState("");
  const [chargementReset, setChargementReset]   = useState(false);
  const [resetEnvoye, setResetEnvoye]           = useState(false);
  const [erreurReset, setErreurReset]           = useState("");

  // État Google
  const [chargementGoogle, setChargementGoogle] = useState(false);

  // État Mode invité
  const [chargementInvite, setChargementInvite] = useState(false);

  // ── Connexion email/mdp ──
  async function handleConnexion(e) {
    e.preventDefault();
    setErreur("");
    setChargement(true);
    try {
      await seConnecter(email, motDePasse);
      router.replace("/accueil");
    } catch (err) {
      const code = err?.code;
      if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setErreur("Email ou mot de passe incorrect.");
      } else if (code === "auth/too-many-requests") {
        setErreur("Trop de tentatives. Réessaie dans quelques minutes.");
      } else {
        setErreur("Une erreur est survenue. Réessaie.");
      }
    } finally {
      setChargement(false);
    }
  }

  // ── Connexion Google ──
  async function handleGoogle() {
    setErreur("");
    setChargementGoogle(true);
    try {
      await seConnecterAvecGoogle();
      router.replace("/accueil");
    } catch (err) {
      if (err?.code === "auth/popup-closed-by-user") {
        // ignoré — l'utilisateur a fermé la popup
      } else {
        setErreur("Connexion Google impossible. Vérifie que le provider est activé dans Firebase.");
      }
    } finally {
      setChargementGoogle(false);
    }
  }

  // ── Mode invité ──
  async function handleInvite() {
    setErreur("");
    setChargementInvite(true);
    try {
      await seConnecterEnInvite();
      router.replace("/accueil");
    } catch {
      setErreur("Impossible de continuer en mode invité. Réessaie.");
    } finally {
      setChargementInvite(false);
    }
  }

  // ── Réinitialisation mot de passe ──
  async function handleReset(e) {
    e.preventDefault();
    setErreurReset("");
    setChargementReset(true);
    try {
      await reinitialiserMotDePasse(emailReset);
    } catch {
      // Silencieux : on affiche toujours le succès pour éviter l'énumération d'emails
    } finally {
      setResetEnvoye(true);
      setChargementReset(false);
    }
  }

  return (
    <CarteAuth
      variante="connexion"
      sousTitreBranding="Gestion de figurines"
      titre="Bon retour !"
      description="Connecte-toi à ta collection."
    >
          {/* ══ MODE NORMAL ══ */}
          {!modeReset ? (
            <>
              <form onSubmit={handleConnexion} className="flex flex-col gap-5">

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-[#D4D4D4] text-xs font-bold uppercase tracking-widest">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ton@email.com"
                    required
                    className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl py-4 text-[#F5F5F5] placeholder-[#4A4A4A] focus:outline-none focus:border-[#1c9ac2] transition-colors text-sm"
                    style={{ paddingLeft: "16px", paddingRight: "20px" }}
                  />
                </div>

                {/* Mot de passe */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[#D4D4D4] text-xs font-bold uppercase tracking-widest">Mot de passe</label>
                    <button
                      type="button"
                      onClick={() => { setModeReset(true); setEmailReset(email); }}
                      className="text-[#1c9ac2] hover:text-[#3ab8e0] text-xs transition-colors"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={afficherMotDePasse ? "text" : "password"}
                      value={motDePasse}
                      onChange={(e) => setMotDePasse(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl py-4 text-[#F5F5F5] placeholder-[#4A4A4A] focus:outline-none focus:border-[#1c9ac2] transition-colors text-sm"
                      style={{ paddingLeft: "16px", paddingRight: "56px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setAfficher(!afficherMotDePasse)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#1c9ac2] transition-colors"
                    >
                      {afficherMotDePasse ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Erreur */}
                {erreur && (
                  <p className="text-red-400 text-sm text-center bg-red-900/20 border border-red-800/50 rounded-2xl px-5 py-3">
                    {erreur}
                  </p>
                )}

                {/* Bouton connexion */}
                <button
                  type="submit"
                  disabled={chargement}
                  className="flex items-center justify-center gap-2.5 bg-[#1c9ac2] hover:bg-[#3ab8e0] disabled:opacity-50 disabled:cursor-not-allowed text-[#0D0D0D] font-bold uppercase tracking-widest py-4 rounded-2xl text-sm transition-colors"
                >
                  {chargement
                    ? <div className="w-5 h-5 border-2 border-[#0D0D0D] border-t-transparent rounded-full animate-spin" />
                    : <><LogIn size={17} /> Se connecter</>
                  }
                </button>
              </form>

              {/* Séparateur */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[#2A2A2A]" />
                <span className="text-[#3A3A3A] text-xs uppercase tracking-widest">ou</span>
                <div className="flex-1 h-px bg-[#2A2A2A]" />
              </div>

              <BoutonGoogle onClick={handleGoogle} chargement={chargementGoogle} />
              <BoutonInvite onClick={handleInvite} chargement={chargementInvite} />

              {/* Lien inscription */}
              <p className="text-center text-[#6B6B6B] text-sm">
                Pas encore de compte ?{" "}
                <Link href="/inscription" className="text-[#1c9ac2] hover:text-[#3ab8e0] font-semibold transition-colors">
                  S&apos;inscrire
                </Link>
              </p>
            </>
          ) : (

            /* ══ MODE RESET MOT DE PASSE ══ */
            <div className="flex flex-col gap-5">
              <div>
                <h3 className="text-[#F5F5F5] font-bold text-lg">Réinitialisation</h3>
                <p className="text-[#6B6B6B] text-sm mt-1">
                  Saisis ton email pour recevoir un lien de réinitialisation.
                </p>
              </div>

              {resetEnvoye ? (
                <div className="flex flex-col gap-4">
                  <div className="bg-green-900/20 border border-green-700/50 rounded-2xl px-5 py-4 text-center">
                    <p className="text-green-400 font-semibold text-sm">Email envoyé !</p>
                    <p className="text-[#6B6B6B] text-xs mt-1">Vérifie ta boîte mail et suis les instructions.</p>
                  </div>
                  <button
                    onClick={() => { setModeReset(false); setResetEnvoye(false); setEmailReset(""); }}
                    className="text-[#1c9ac2] hover:text-[#3ab8e0] text-sm font-semibold transition-colors text-center"
                  >
                    ← Retour à la connexion
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReset} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[#D4D4D4] text-xs font-bold uppercase tracking-widest">Email</label>
                    <input
                      type="email"
                      value={emailReset}
                      onChange={(e) => setEmailReset(e.target.value)}
                      placeholder="ton@email.com"
                      required
                      className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl py-4 text-[#F5F5F5] placeholder-[#4A4A4A] focus:outline-none focus:border-[#1c9ac2] transition-colors text-sm"
                    style={{ paddingLeft: "16px", paddingRight: "20px" }}
                    />
                  </div>

                  {erreurReset && (
                    <p className="text-red-400 text-sm text-center bg-red-900/20 border border-red-800/50 rounded-2xl px-5 py-3">
                      {erreurReset}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={chargementReset}
                    className="flex items-center justify-center gap-2 bg-[#1c9ac2] hover:bg-[#3ab8e0] disabled:opacity-50 text-[#0D0D0D] font-bold uppercase tracking-widest py-4 rounded-2xl transition-colors text-sm"
                  >
                    {chargementReset
                      ? <div className="w-5 h-5 border-2 border-[#0D0D0D] border-t-transparent rounded-full animate-spin" />
                      : "Envoyer le lien"
                    }
                  </button>

                  <button
                    type="button"
                    onClick={() => { setModeReset(false); setErreurReset(""); }}
                    className="text-[#6B6B6B] hover:text-[#D4D4D4] text-sm transition-colors text-center"
                  >
                    ← Retour à la connexion
                  </button>
                </form>
              )}
            </div>
          )}
    </CarteAuth>
  );
}
