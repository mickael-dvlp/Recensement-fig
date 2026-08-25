// ============================================================
// CONFIGURATION FIREBASE
// ============================================================
// Ce fichier initialise Firebase avec les variables d'environnement.
// Remplace les valeurs dans le fichier .env.local avec tes clés Firebase.
// Pour obtenir ces clés : Firebase Console > Ton projet > Paramètres > Ton application web

import { initializeApp, getApps } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
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

// App Check : protège Auth/Firestore/Storage contre les clients non légitimes (bots, abus).
// Ignoré tant que NEXT_PUBLIC_RECAPTCHA_SITE_KEY n'est pas défini, pour ne jamais casser
// l'app en son absence (clé à créer dans Firebase Console > App Check > reCAPTCHA v3).
if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
  // En dev, reCAPTCHA v3 ne valide pas localhost : le SDK génère un jeton de debug
  // dans la console à enregistrer une fois dans Firebase Console > App Check > Debug tokens.
  if (process.env.NODE_ENV !== "production") {
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
    isTokenAutoRefreshEnabled: true,
  });
}

// Services Firebase exportés
export const auth = getAuth(app); // Authentification
setPersistence(auth, browserLocalPersistence); // Session persistante même après fermeture de l'onglet
export const db = getFirestore(app); // Base de données Firestore
export const storage = getStorage(app); // Stockage des images

export default app;
