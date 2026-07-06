"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, UserCheck, Clock, Users, X, Check, Trash2, Eye } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  getAmis,
  envoyerDemandeAmi,
  accepterDemandeAmi,
  supprimerRelationAmi,
} from "@/lib/firestore";

export default function PageAmis() {
  const { utilisateur, profil } = useAuth();
  const router = useRouter();

  const [amis, setAmis] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [modalOuverte, setModalOuverte] = useState(false);
  const [pseudoRecherche, setPseudoRecherche] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [erreurEnvoi, setErreurEnvoi] = useState("");
  const [succesEnvoi, setSuccesEnvoi] = useState("");
  const [confirmSupprimer, setConfirmSupprimer] = useState(null);

  const monPseudo = profil?.pseudo || utilisateur?.displayName || "";

  useEffect(() => {
    if (!utilisateur) {
      setChargement(false);
      return;
    }
    getAmis(utilisateur.uid)
      .then(setAmis)
      .finally(() => setChargement(false));
  }, [utilisateur]);

  const demandesRecues = amis.filter((a) => a.statut === "reçu");
  const demandesEnvoyees = amis.filter((a) => a.statut === "envoyé");
  const amisAcceptes = amis.filter((a) => a.statut === "accepté");

  async function handleEnvoyerDemande() {
    if (!pseudoRecherche.trim() || envoi) return;
    setErreurEnvoi("");
    setSuccesEnvoi("");
    setEnvoi(true);
    try {
      await envoyerDemandeAmi(utilisateur.uid, monPseudo, pseudoRecherche.trim());
      setSuccesEnvoi(`Demande envoyée à « ${pseudoRecherche.trim()} » !`);
      setPseudoRecherche("");
      const updated = await getAmis(utilisateur.uid);
      setAmis(updated);
    } catch (err) {
      const msgs = {
        pseudo_introuvable: "Aucun utilisateur trouvé avec ce pseudo.",
        soi_meme: "Tu ne peux pas t'ajouter toi-même.",
        deja_ami: "Cette personne est déjà dans ta liste.",
      };
      setErreurEnvoi(msgs[err.message] ?? "Une erreur est survenue.");
    } finally {
      setEnvoi(false);
    }
  }

  async function handleAccepter(amiUid) {
    await accepterDemandeAmi(utilisateur.uid, amiUid);
    setAmis((prev) =>
      prev.map((a) => (a.id === amiUid ? { ...a, statut: "accepté" } : a))
    );
  }

  async function handleSupprimer(amiUid) {
    await supprimerRelationAmi(utilisateur.uid, amiUid);
    setAmis((prev) => prev.filter((a) => a.id !== amiUid));
  }

  function fermerModal() {
    setModalOuverte(false);
    setPseudoRecherche("");
    setErreurEnvoi("");
    setSuccesEnvoi("");
  }

  if (chargement) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-[#2A2A2A] border-t-[#C9A227] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-6">
      {/* EN-TÊTE */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#F5F5F5] text-xl font-bold uppercase tracking-widest">
            Mes amis
          </h1>
          <p className="text-[#6B6B6B] text-xs mt-0.5">{amisAcceptes.length} ami{amisAcceptes.length > 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setModalOuverte(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C9A227] text-[#0D0D0D] font-bold text-xs uppercase tracking-wide hover:bg-[#E6C25A] transition-colors"
        >
          <UserPlus size={15} /> Ajouter
        </button>
      </div>

      {/* DEMANDES REÇUES */}
      {demandesRecues.length > 0 && (
        <section>
          <h2 className="text-[#C9A227] text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
            <Clock size={13} /> Demandes reçues ({demandesRecues.length})
          </h2>
          <div className="flex flex-col gap-2">
            {demandesRecues.map((ami) => (
              <div
                key={ami.id}
                className="bg-[#1A1A1A] border border-[#C9A227]/30 rounded-2xl px-4 py-3 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30 flex items-center justify-center shrink-0">
                  <span className="text-[#C9A227] text-sm font-bold">
                    {ami.pseudo[0]?.toUpperCase()}
                  </span>
                </div>
                <span className="flex-1 text-[#F5F5F5] font-semibold text-sm">{ami.pseudo}</span>
                <button
                  onClick={() => handleAccepter(ami.id)}
                  className="w-8 h-8 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E] hover:bg-[#22C55E]/20 transition-colors"
                  title="Accepter"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => handleSupprimer(ami.id)}
                  className="w-8 h-8 rounded-full bg-red-900/20 border border-red-800/30 flex items-center justify-center text-red-400 hover:bg-red-900/40 transition-colors"
                  title="Refuser"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* DEMANDES ENVOYÉES */}
      {demandesEnvoyees.length > 0 && (
        <section>
          <h2 className="text-[#6B6B6B] text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
            <Clock size={13} /> En attente ({demandesEnvoyees.length})
          </h2>
          <div className="flex flex-col gap-2">
            {demandesEnvoyees.map((ami) => (
              <div
                key={ami.id}
                className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-4 py-3 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-[#2A2A2A] flex items-center justify-center shrink-0">
                  <span className="text-[#6B6B6B] text-sm font-bold">
                    {ami.pseudo[0]?.toUpperCase()}
                  </span>
                </div>
                <span className="flex-1 text-[#6B6B6B] font-semibold text-sm">{ami.pseudo}</span>
                <span className="text-[#3A3A3A] text-[10px] uppercase tracking-wide">En attente</span>
                <button
                  onClick={() => handleSupprimer(ami.id)}
                  className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:text-red-400 transition-colors"
                  title="Annuler"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* AMIS ACCEPTÉS */}
      <section>
        {amisAcceptes.length === 0 && demandesRecues.length === 0 && demandesEnvoyees.length === 0 ? (
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] border-dashed rounded-2xl p-10 flex flex-col items-center gap-3">
            <Users size={36} className="text-[#3A3A3A]" />
            <p className="text-[#6B6B6B] text-sm text-center">
              Aucun ami pour le moment.<br />Ajoute des joueurs pour voir leur collection !
            </p>
          </div>
        ) : (
          amisAcceptes.length > 0 && (
            <>
              <h2 className="text-[#C9A227] text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                <UserCheck size={13} /> Amis ({amisAcceptes.length})
              </h2>
              <div className="flex flex-col gap-2">
                {amisAcceptes.map((ami) => (
                  <div
                    key={ami.id}
                    className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-4 py-3 flex items-center gap-3"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30 flex items-center justify-center shrink-0">
                      <span className="text-[#C9A227] text-sm font-bold">
                        {ami.pseudo[0]?.toUpperCase()}
                      </span>
                    </div>
                    <span className="flex-1 text-[#F5F5F5] font-semibold text-sm">{ami.pseudo}</span>
                    <button
                      onClick={() => router.push(`/amis/${ami.id}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2A2A2A] text-[#D4D4D4] text-xs font-semibold hover:bg-[#3A3A3A] transition-colors"
                    >
                      <Eye size={13} /> Collection
                    </button>
                    <button
                      onClick={() => setConfirmSupprimer(ami)}
                      className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:text-red-400 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )
        )}
      </section>

      {/* MODAL CONFIRMATION SUPPRESSION AMI */}
      {confirmSupprimer && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setConfirmSupprimer(null); }}
        >
          <div className="w-full max-w-sm bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-[#F5F5F5] font-bold uppercase tracking-widest text-sm">
                Supprimer cet ami ?
              </h2>
              <p className="text-[#6B6B6B] text-xs">
                Es-tu sûr de vouloir supprimer <span className="text-[#D4D4D4] font-semibold">{confirmSupprimer.pseudo}</span> de ta liste d'amis ? Cette action est irréversible.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmSupprimer(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#2A2A2A] text-[#D4D4D4] font-semibold text-sm hover:bg-[#3A3A3A] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={async () => {
                  await handleSupprimer(confirmSupprimer.id);
                  setConfirmSupprimer(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-900/40 border border-red-800/50 text-red-400 font-semibold text-sm hover:bg-red-900/60 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL AJOUTER UN AMI */}
      {modalOuverte && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) fermerModal(); }}
        >
          <div className="w-full max-w-sm bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[#F5F5F5] font-bold uppercase tracking-widest text-sm">
                Ajouter un ami
              </h2>
              <button
                onClick={fermerModal}
                className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-[#6B6B6B] text-xs">
              Entre le pseudo exact de l'utilisateur que tu veux ajouter.
            </p>

            <input
              type="text"
              value={pseudoRecherche}
              onChange={(e) => { setPseudoRecherche(e.target.value); setErreurEnvoi(""); setSuccesEnvoi(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleEnvoyerDemande()}
              placeholder="Pseudo de l'ami"
              autoFocus
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-[#F5F5F5] text-sm placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#C9A227]/50 transition-colors"
            />

            {erreurEnvoi && (
              <p className="text-red-400 text-xs bg-red-900/20 border border-red-800/40 rounded-xl px-3 py-2">
                {erreurEnvoi}
              </p>
            )}
            {succesEnvoi && (
              <p className="text-[#22C55E] text-xs bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-xl px-3 py-2">
                {succesEnvoi}
              </p>
            )}

            <button
              onClick={handleEnvoyerDemande}
              disabled={!pseudoRecherche.trim() || envoi}
              className="w-full py-3 rounded-xl bg-[#C9A227] text-[#0D0D0D] font-bold text-sm uppercase tracking-widest hover:bg-[#E6C25A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {envoi ? "Envoi…" : "Envoyer la demande"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
