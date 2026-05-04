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
import { auth } from "./firebase";
import { creerProfil, getProfil } from "./firestore";

// Création du contexte avec valeur par défaut null
const AuthContext = createContext(null);

// ----- PROVIDER -----
// Enveloppe l'application pour partager l'état d'authentification
export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(null);   // Objet Firebase Auth (ou null)
  const [profil, setProfil] = useState(null);              // Données Firestore du profil
  const [chargement, setChargement] = useState(true);      // Vrai pendant la vérification initiale

  // Écoute les changements d'état Firebase Auth (connexion / déconnexion)
  useEffect(() => {
    const desabonner = onAuthStateChanged(auth, async (user) => {
      setUtilisateur(user);

      if (user && !user.isAnonymous) {
        try {
          const profilData = await getProfil(user.uid);
          setProfil(profilData);
        } catch (err) {
          console.warn("Impossible de charger le profil Firestore :", err.message);
          setProfil(null);
        }
      } else {
        setProfil(null);
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
    let user;

    if (utilisateur?.isAnonymous) {
      // Lier le compte anonyme à un vrai compte email (conserve les données Firestore)
      const credential = EmailAuthProvider.credential(email, motDePasse);
      const result = await linkWithCredential(utilisateur, credential);
      user = result.user;
    } else {
      const result = await createUserWithEmailAndPassword(auth, email, motDePasse);
      user = result.user;
    }

    await updateProfile(user, { displayName: pseudo });

    const nouveauProfil = {
      uid: user.uid,
      pseudo,
      email,
      langue: "fr",
      creeLe: new Date().toISOString(),
    };
    await creerProfil(nouveauProfil);
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
      const nouveauProfil = {
        uid: user.uid,
        pseudo: user.displayName || user.email.split("@")[0],
        email: user.email,
        langue: "fr",
        creeLe: new Date().toISOString(),
      };
      await creerProfil(nouveauProfil);
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

  const isInvite = utilisateur?.isAnonymous ?? false;

  return (
    <AuthContext.Provider
      value={{ utilisateur, profil, chargement, isInvite, seConnecter, sInscrire, seDeconnecter, seConnecterAvecGoogle, seConnecterEnInvite, reinitialiserMotDePasse }}
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
