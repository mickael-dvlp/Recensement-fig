"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import CarteAuth from "@/components/auth/CarteAuth";
import BoutonGoogle from "@/components/auth/BoutonGoogle";
import BoutonInvite from "@/components/auth/BoutonInvite";

// ── Calcul de la force du mot de passe ──
function calculerForce(mdp) {
  if (!mdp) return null;
  let score = 0;
  if (mdp.length >= 8) score++;
  if (mdp.length >= 12) score++;
  if (/[A-Z]/.test(mdp)) score++;
  if (/[0-9]/.test(mdp)) score++;
  if (/[^A-Za-z0-9]/.test(mdp)) score++;

  if (score <= 1)
    return { niveau: 1, label: "Très faible", couleur: "#EF4444" };
  if (score <= 2) return { niveau: 2, label: "Faible", couleur: "#F97316" };
  if (score <= 3) return { niveau: 3, label: "Moyen", couleur: "#EAB308" };
  return { niveau: 4, label: "Fort", couleur: "#22C55E" };
}

export default function PageInscription() {
  const { sInscrire, seConnecterAvecGoogle, seConnecterEnInvite } = useAuth();
  const router = useRouter();

  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [afficherMdp, setAfficherMdp] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");
  const [chargementGoogle, setChargementGoogle] = useState(false);
  const [chargementInvite, setChargementInvite] = useState(false);

  const force = useMemo(() => calculerForce(motDePasse), [motDePasse]);

  async function handleInscription(e) {
    e.preventDefault();
    setErreur("");

    if (pseudo.trim().length < 3 || pseudo.trim().length > 30) {
      setErreur("Le pseudo doit contenir entre 3 et 30 caractères.");
      return;
    }
    if (!/^[a-zA-Z0-9_\-]+$/.test(pseudo.trim())) {
      setErreur("Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores.");
      return;
    }
    if (motDePasse !== confirmation) {
      setErreur("Les mots de passe ne correspondent pas.");
      return;
    }
    if (motDePasse.length < 6) {
      setErreur("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setChargement(true);
    try {
      await sInscrire(email, motDePasse, pseudo);
      router.replace("/accueil");
    } catch (err) {
      const code = err?.code;
      if (code === "pseudo/already-in-use") {
        setErreur("Ce pseudo est déjà utilisé.");
      } else if (code === "auth/email-already-in-use") {
        setErreur("Cet email est déjà utilisé.");
      } else if (code === "auth/invalid-email") {
        setErreur("Adresse email invalide.");
      } else if (code === "auth/weak-password") {
        setErreur("Mot de passe trop faible (min. 6 caractères).");
      } else {
        setErreur("Une erreur est survenue. Réessaie.");
      }
    } finally {
      setChargement(false);
    }
  }

  async function handleGoogle() {
    setErreur("");
    setChargementGoogle(true);
    try {
      await seConnecterAvecGoogle();
      router.replace("/accueil");
    } catch (err) {
      if (err?.code !== "auth/popup-closed-by-user") {
        setErreur(
          "Connexion Google impossible. Vérifie que le provider est activé dans Firebase.",
        );
      }
    } finally {
      setChargementGoogle(false);
    }
  }

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

  return (
    <CarteAuth
      variante="inscription"
      sousTitreBranding="Rejoins ta collection"
      titre="Créer un compte"
      description="Commence à gérer ta collection MESBG."
    >
          <form onSubmit={handleInscription} className="flex flex-col gap-4">
            {/* Pseudo */}
            <div className="flex flex-col gap-2">
              <label className="text-[#D4D4D4] text-xs font-bold uppercase tracking-widest">
                Pseudo
              </label>
              <input
                type="text"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                placeholder="Ton pseudo"
                required
                className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl py-4 text-[#F5F5F5] placeholder-[#4A4A4A] focus:outline-none focus:border-[#1c9ac2] transition-colors text-sm"
                style={{ paddingLeft: "16px", paddingRight: "20px" }}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-[#D4D4D4] text-xs font-bold uppercase tracking-widest">
                Email
              </label>
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

            {/* Mot de passe + indicateur de force */}
            <div className="flex flex-col gap-2">
              <label className="text-[#D4D4D4] text-xs font-bold uppercase tracking-widest">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={afficherMdp ? "text" : "password"}
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  placeholder="Min. 6 caractères"
                  required
                  className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl py-4 text-[#F5F5F5] placeholder-[#4A4A4A] focus:outline-none focus:border-[#1c9ac2] transition-colors text-sm"
                  style={{ paddingLeft: "16px", paddingRight: "56px" }}
                />
                <button
                  type="button"
                  onClick={() => setAfficherMdp(!afficherMdp)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#1c9ac2] transition-colors"
                >
                  {afficherMdp ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Indicateur de force */}
              {force && (
                <div className="flex flex-col gap-1.5 mt-1">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor:
                            i <= force.niveau ? force.couleur : "#2A2A2A",
                        }}
                      />
                    ))}
                  </div>
                  <p
                    className="text-xs font-semibold"
                    style={{ color: force.couleur }}
                  >
                    {force.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirmation */}
            <div className="flex flex-col gap-2">
              <label className="text-[#D4D4D4] text-xs font-bold uppercase tracking-widest">
                Confirmer le mot de passe
              </label>
              <input
                type={afficherMdp ? "text" : "password"}
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl py-4 text-[#F5F5F5] placeholder-[#4A4A4A] focus:outline-none focus:border-[#1c9ac2] transition-colors text-sm"
                style={{ paddingLeft: "16px", paddingRight: "20px" }}
              />
            </div>

            {/* Erreur */}
            {erreur && (
              <p className="text-red-400 text-sm text-center bg-red-900/20 border border-red-800/50 rounded-2xl px-5 py-3">
                {erreur}
              </p>
            )}

            {/* Bouton inscription */}
            <button
              type="submit"
              disabled={chargement}
              className="flex items-center justify-center gap-2.5 bg-[#1c9ac2] hover:bg-[#3ab8e0] disabled:opacity-50 disabled:cursor-not-allowed text-[#0D0D0D] font-bold uppercase tracking-widest py-4 rounded-2xl text-sm mt-1 transition-colors"
            >
              {chargement ? (
                <div className="w-5 h-5 border-2 border-[#0D0D0D] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={17} /> Créer le compte
                </>
              )}
            </button>
          </form>

          {/* Séparateur */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#2A2A2A]" />
            <span className="text-[#3A3A3A] text-xs uppercase tracking-widest">
              ou
            </span>
            <div className="flex-1 h-px bg-[#2A2A2A]" />
          </div>

          <BoutonGoogle onClick={handleGoogle} chargement={chargementGoogle} />
          <BoutonInvite onClick={handleInvite} chargement={chargementInvite} />

          {/* Lien connexion */}
          <p className="text-center text-[#6B6B6B] text-sm">
            Déjà un compte ?{" "}
            <Link
              href="/connexion"
              className="text-[#1c9ac2] hover:text-[#3ab8e0] font-semibold transition-colors"
            >
              Se connecter
            </Link>
          </p>
    </CarteAuth>
  );
}
