"use client";

// ============================================================
// CONTEXTE D'AUTHENTIFICATION FIREBASE
// ============================================================
// Ce fichier fournit un contexte React pour partager l'état
// d'authentification dans toute l'application.
// Enveloppe l'application dans <AuthProvider> pour y accéder.

import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  linkWithCredential,
  linkWithPopup,
  EmailAuthProvider,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { creerProfil, getProfil, verifierPseudoDisponible, reserverPseudo, getAmis } from "@/lib/firestore";

// Création du contexte avec valeur par défaut null
const AuthContext = createContext(null);

function creerNouveauProfil(uid, pseudo, email) {
  return { uid, pseudo, email, langue: "fr", creeLe: new Date().toISOString() };
}

// ----- PROVIDER -----
// Enveloppe l'application pour partager l'état d'authentification
export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(null);
  const [profil, setProfil] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [nbDemandesAmis, setNbDemandesAmis] = useState(0);

  useEffect(() => {
    const desabonner = onAuthStateChanged(auth, async (user) => {
      setUtilisateur(user);

      if (user && !user.isAnonymous) {
        try {
          const [profilData, amis] = await Promise.all([
            getProfil(user.uid),
            getAmis(user.uid),
          ]);
          setProfil(profilData);
          setNbDemandesAmis(
            amis.filter((a) => a.statut === "reçu").length
          );
        } catch (err) {
          console.warn("Impossible de charger le profil Firestore :", err.message);
          setProfil(null);
        }
      } else {
        setProfil(null);
        setNbDemandesAmis(0);
      }

      setChargement(false);
    });

    // Nettoyage : désabonnement lors du démontage du composant
    return () => desabonner();
  }, []);

  /**
   * Connexion avec email et mot de passe
   * @param {string} email
   * @param {string} motDePasse
   */
  async function seConnecter(email, motDePasse) {
    await signInWithEmailAndPassword(auth, email, motDePasse);
  }

  /**
   * Inscription d'un nouvel utilisateur.
   * Crée le compte Firebase Auth + le profil dans Firestore.
   * @param {string} email
   * @param {string} motDePasse
   * @param {string} pseudo
   */
  async function sInscrire(email, motDePasse, pseudo) {
    const dispo = await verifierPseudoDisponible(pseudo);
    if (!dispo) throw Object.assign(new Error("Pseudo déjà utilisé."), { code: "pseudo/already-in-use" });

    let user;
    if (utilisateur?.isAnonymous) {
      const credential = EmailAuthProvider.credential(email, motDePasse);
      const result = await linkWithCredential(utilisateur, credential);
      user = result.user;
    } else {
      const result = await createUserWithEmailAndPassword(auth, email, motDePasse);
      user = result.user;
    }

    await updateProfile(user, { displayName: pseudo });

    const nouveauProfil = creerNouveauProfil(user.uid, pseudo, email);
    await creerProfil(nouveauProfil);
    await reserverPseudo(pseudo, user.uid);
    setProfil(nouveauProfil);
  }

  /**
   * Déconnexion de l'utilisateur
   */
  async function seDeconnecter() {
    await signOut(auth);
  }

  /**
   * Connexion via Google OAuth.
   * Nécessite d'activer le provider Google dans Firebase Console.
   */
  async function seConnecterAvecGoogle() {
    const provider = new GoogleAuthProvider();
    let user;

    if (utilisateur?.isAnonymous) {
      // Lier le compte anonyme à Google (conserve les données Firestore)
      const result = await linkWithPopup(utilisateur, provider);
      user = result.user;
    } else {
      const result = await signInWithPopup(auth, provider);
      user = result.user;
    }

    const existingProfil = await getProfil(user.uid);
    if (!existingProfil) {
      let pseudo = user.displayName || user.email.split("@")[0];
      let dispo = await verifierPseudoDisponible(pseudo);
      let suffixe = 1;
      while (!dispo && suffixe <= 50) {
        pseudo = `${user.displayName || user.email.split("@")[0]}${suffixe}`;
        dispo = await verifierPseudoDisponible(pseudo);
        suffixe++;
      }
      if (!dispo) throw new Error("Impossible de générer un pseudo disponible.");
      const nouveauProfil = creerNouveauProfil(user.uid, pseudo, user.email);
      await creerProfil(nouveauProfil);
      await reserverPseudo(pseudo, user.uid);
      setProfil(nouveauProfil);
    } else {
      setProfil(existingProfil);
    }
  }

  /**
   * Connexion en mode invité (anonyme).
   * Les données sont sauvegardées dans Firestore sous un UID temporaire.
   * L'invité peut convertir son compte via sInscrire() ou seConnecterAvecGoogle().
   */
  async function seConnecterEnInvite() {
    await signInAnonymously(auth);
  }

  /**
   * Envoie un email de réinitialisation du mot de passe.
   * @param {string} email
   */
  async function reinitialiserMotDePasse(email) {
    await sendPasswordResetEmail(auth, email);
  }

  // Recharge le profil depuis Firestore (utile après une modification de pseudo ou d'avatar).
  async function rafraichirProfil() {
    if (!utilisateur) return;
    const data = await getProfil(utilisateur.uid);
    setProfil(data);
  }

  // Met à jour le badge de demandes d'amis en recomptant les entrées "reçu".
  // Appelé depuis la page /amis après acceptation/refus.
  async function rafraichirDemandesAmis() {
    if (!utilisateur) return;
    const amis = await getAmis(utilisateur.uid);
    setNbDemandesAmis(
      amis.filter((a) => a.statut === "reçu").length
    );
  }

  const isInvite = utilisateur?.isAnonymous ?? false;

  return (
    <AuthContext.Provider
      value={{ utilisateur, profil, chargement, isInvite, nbDemandesAmis, rafraichirDemandesAmis, seConnecter, sInscrire, seDeconnecter, seConnecterAvecGoogle, seConnecterEnInvite, reinitialiserMotDePasse, rafraichirProfil }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ----- HOOK PERSONNALISÉ -----
// Utilise ce hook dans n'importe quel composant client pour accéder à l'auth
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un <AuthProvider>");
  }
  return context;
}
