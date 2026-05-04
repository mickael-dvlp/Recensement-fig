"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, UserPlus, Ghost } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import PopupEnConstruction from "@/components/ui/PopupEnConstruction";

// SVG Google icon
function IconGoogle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

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
      if (code === "auth/email-already-in-use") {
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
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-6">
      <PopupEnConstruction />

      {/* ── Particules flottantes ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="float-a absolute top-1/3 right-1/4 w-72 h-72 rounded-full"
          style={{
            background: "radial-gradient(circle, #1c9ac2 0%, transparent 70%)",
            opacity: 0.08,
          }}
        />
        <div
          className="float-b absolute bottom-1/3 left-1/4 w-56 h-56 rounded-full"
          style={{
            background: "radial-gradient(circle, #1c9ac2 0%, transparent 70%)",
            opacity: 0.06,
          }}
        />
        <div
          className="float-c absolute top-2/3 right-1/3 w-40 h-40 rounded-full"
          style={{
            background: "radial-gradient(circle, #1c9ac2 0%, transparent 70%)",
            opacity: 0.05,
          }}
        />
      </div>

      {/* ── Carte principale (deux colonnes) ── */}
      <div
        className="animate-fade-slide-up relative w-full max-w-215 bg-[#111111] border border-[#1c9ac2]/30 rounded-3xl overflow-hidden flex min-h-165"
        style={{
          boxShadow:
            "0 0 40px rgba(28, 154, 194, 0.25), 0 0 80px rgba(28, 154, 194, 0.1), 0 25px 50px rgba(0,0,0,0.5)",
        }}
      >
        {/* ─ Colonne gauche : image ─ */}
        <div className="relative w-[42%] shrink-0 hidden md:block">
          <Image
            src="/image/image02.jpg"
            alt="MESBG"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Séparateur vertical */}
        <div className="w-px bg-[#252525] shrink-0" />

        {/* ─ Colonne droite : formulaire ─ */}
        <div className="flex-1 flex flex-col justify-center py-10 gap-6" style={{ paddingLeft: "48px", paddingRight: "48px" }}>
          {/* Branding centré */}
          <div className="flex flex-col items-center gap-1 mb-2">
            <h1 className="text-3xl font-bold text-[#1c9ac2] uppercase tracking-[0.25em]">
              MESBG
            </h1>
            <div className="flex items-center gap-2">
              <div className="w-8 h-px bg-[#1c9ac2]/50" />
              <p className="text-[#6B6B6B] text-xs tracking-widest uppercase">
                Rejoins ta collection
              </p>
              <div className="w-8 h-px bg-[#1c9ac2]/50" />
            </div>
          </div>

          {/* Titre */}
          <div>
            <h2 className="text-2xl font-bold text-[#F5F5F5]">
              Créer un compte
            </h2>
            <p className="text-[#6B6B6B] text-sm mt-1">
              Commence à gérer ta collection MESBG.
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
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
              disabled
              className="flex items-center justify-center gap-2.5 bg-[#1c9ac2] opacity-30 cursor-not-allowed text-[#0D0D0D] font-bold uppercase tracking-widest py-4 rounded-2xl text-sm mt-1"
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

          {/* Bouton Google */}
          <button
            type="button"
            disabled
            className="flex items-center justify-center gap-3 bg-[#1A1A1A] border border-[#2A2A2A] opacity-30 cursor-not-allowed text-[#D4D4D4] font-semibold py-3.5 rounded-2xl text-sm"
          >
            {chargementGoogle ? (
              <div className="w-5 h-5 border-2 border-[#D4D4D4] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <IconGoogle /> Continuer avec Google
              </>
            )}
          </button>

          {/* Bouton Mode invité */}
          <button
            type="button"
            onClick={handleInvite}
            disabled={chargementInvite}
            className="animate-clignoter-rouge flex items-center justify-center gap-3 bg-transparent hover:bg-[#1A1A1A] border border-dashed disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-3.5 rounded-2xl text-sm"
          >
            {chargementInvite ? (
              <div className="w-5 h-5 border-2 border-[#6B6B6B] border-t-transparent rounded-full animate-spin" />
            ) : (
              <><Ghost size={17} /> Continuer en mode invité</>
            )}
          </button>

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
        </div>
      </div>
    </div>
  );
}
