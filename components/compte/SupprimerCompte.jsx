"use client";

// ============================================================
// SUPPRESSION DE COMPTE — bouton + modale de confirmation.
// ============================================================
// Réutilisé à la fois dans Profil (utilisateur connecté dans l'app) et sur la
// page publique /politique-confidentialite (exigence Google Play : suppression
// de compte accessible même sans avoir l'app installée).

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, AlertTriangle, X, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function SupprimerCompte() {
  const { utilisateur, chargement, isInvite, supprimerCompteUtilisateur } = useAuth();
  const router = useRouter();
  const [modalOuvert, setModalOuvert] = useState(false);
  const [motDePasse, setMotDePasse] = useState("");
  const [afficherMdp, setAfficherMdp] = useState(false);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState("");

  const estEmailMdp = !isInvite && utilisateur?.providerData[0]?.providerId === "password";
  const estGoogle = !isInvite && utilisateur?.providerData[0]?.providerId === "google.com";

  function fermer() {
    setModalOuvert(false);
    setMotDePasse("");
    setErreur("");
  }

  async function handleSupprimer() {
    setErreur("");
    setEnCours(true);
    try {
      await supprimerCompteUtilisateur(estEmailMdp ? motDePasse : undefined);
      router.replace("/");
    } catch (err) {
      if (err?.code === "auth/popup-closed-by-user") {
        // Annulé volontairement par l'utilisateur — pas une erreur à afficher.
      } else if (err?.code === "auth/wrong-password" || err?.code === "auth/invalid-credential") {
        setErreur("Mot de passe incorrect.");
      } else if (err?.code === "mot-de-passe-requis") {
        setErreur("Entre ton mot de passe pour confirmer.");
      } else {
        setErreur("Une erreur est survenue. Réessaie.");
      }
    } finally {
      setEnCours(false);
    }
  }

  if (chargement) return null;

  if (!utilisateur) {
    return (
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4">
        <p className="text-[#6B6B6B] text-sm leading-relaxed">
          Connecte-toi à ton compte pour supprimer définitivement ton compte et
          tes données, ou écris-nous à{" "}
          <span className="text-[#D4D4D4]">mickael-dvlp@gmail.com</span>.
        </p>
        <Link
          href="/connexion"
          className="inline-block mt-3 text-[#1c9ac2] hover:text-[#3ab8e0] text-sm font-semibold transition-colors"
        >
          Se connecter →
        </Link>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setModalOuvert(true)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl hover:bg-red-900/10 hover:border-red-800/50 transition-colors"
      >
        <Trash2 size={18} className="text-red-400" />
        <div className="flex-1 text-left">
          <p className="text-red-400 text-sm font-medium">
            Supprimer mon compte
          </p>
          <p className="text-[#6B6B6B] text-xs">
            Action définitive et irréversible
          </p>
        </div>
      </button>

      {modalOuvert && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 px-4 pb-6 sm:pb-0">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl w-full max-w-sm p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-900/20 flex items-center justify-center shrink-0">
                  <AlertTriangle size={20} className="text-red-400" />
                </div>
                <h3 className="text-[#F5F5F5] font-bold text-base">
                  Supprimer le compte
                </h3>
              </div>
              <button
                onClick={fermer}
                disabled={enCours}
                className="w-7 h-7 rounded-full bg-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors disabled:opacity-50"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-[#6B6B6B] text-sm leading-relaxed">
              Cette action supprime définitivement ton compte, ton inventaire,
              tes mémos, tes figurines personnalisées et tes relations d'amis.{" "}
              <span className="text-[#F5F5F5] font-medium">
                Impossible à annuler.
              </span>
            </p>

            {estEmailMdp && (
              <div className="flex flex-col gap-2">
                <label className="text-[#D4D4D4] text-xs font-bold uppercase tracking-widest">
                  Confirme ton mot de passe
                </label>
                <div className="relative">
                  <input
                    type={afficherMdp ? "text" : "password"}
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSupprimer()}
                    autoFocus
                    className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl py-2.5 px-3 pr-10 text-[#F5F5F5] text-sm focus:outline-none focus:border-red-800/50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setAfficherMdp(!afficherMdp)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
                  >
                    {afficherMdp ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {estGoogle && (
              <p className="text-[#6B6B6B] text-xs">
                Une fenêtre Google s'ouvrira pour confirmer ton identité.
              </p>
            )}

            {erreur && (
              <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/50 rounded-xl px-4 py-2.5">
                {erreur}
              </p>
            )}

            <div className="flex gap-3 mt-1">
              <button
                onClick={fermer}
                disabled={enCours}
                className="flex-1 py-2.5 rounded-xl border border-[#2A2A2A] text-[#6B6B6B] hover:text-[#F5F5F5] hover:border-[#3A3A3A] transition-colors text-sm font-medium disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSupprimer}
                disabled={enCours || (estEmailMdp && !motDePasse)}
                className="flex-1 py-2.5 rounded-xl bg-red-900/30 border border-red-800 text-red-400 hover:bg-red-900/50 transition-colors text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {enCours ? (
                  <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 size={14} /> Supprimer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
