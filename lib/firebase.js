// ============================================================
// CONFIGURATION FIREBASE
// ============================================================
// Ce fichier initialise Firebase avec les variables d'environnement.
// Remplace les valeurs dans le fichier .env.local avec tes clés Firebase.
// Pour obtenir ces clés : Firebase Console > Ton projet > Paramètres > Ton application web

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialise Firebase une seule fois (évite les erreurs avec Next.js HMR)
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Services Firebase exportés
export const auth = getAuth(app); // Authentification
export const db = getFirestore(app); // Base de données Firestore
export const storage = getStorage(app); // Stockage des images

export default app;
