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

      if (user) {
        try {
          // Si connecté, on tente de charger le profil Firestore.
          // Le try/catch est essentiel : si Firestore est indisponible,
          // l'erreur ne doit pas bloquer le chargement indéfiniment.
          const profilData = await getProfil(user.uid);
          setProfil(profilData);
        } catch (err) {
          console.warn("Impossible de charger le profil Firestore :", err.message);
          // On continue sans profil plutôt que de bloquer l'app
          setProfil(null);
        }
      } else {
        setProfil(null);
      }

      // Toujours exécuté, même en cas d'erreur Firestore
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
    const credential = await createUserWithEmailAndPassword(auth, email, motDePasse);
    const user = credential.user;

    // Mise à jour du nom d'affichage dans Firebase Auth
    await updateProfile(user, { displayName: pseudo });

    // Création du profil dans Firestore
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
    const credential = await signInWithPopup(auth, provider);
    const user = credential.user;

    // Crée le profil Firestore uniquement si c'est la première connexion
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
   * Envoie un email de réinitialisation du mot de passe.
   * @param {string} email
   */
  async function reinitialiserMotDePasse(email) {
    await sendPasswordResetEmail(auth, email);
  }

  return (
    <AuthContext.Provider
      value={{ utilisateur, profil, chargement, seConnecter, sInscrire, seDeconnecter, seConnecterAvecGoogle, reinitialiserMotDePasse }}
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
