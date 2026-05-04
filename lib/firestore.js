// ============================================================
// FONCTIONS FIRESTORE - Gestion de l'inventaire utilisateur
// ============================================================
// Ce fichier contient toutes les fonctions pour lire et écrire
// les données de l'utilisateur dans Firestore.

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// ---- PROFIL UTILISATEUR ----

/**
 * Crée ou met à jour le profil d'un utilisateur dans Firestore.
 * @param {Object} profil - Données du profil (uid, pseudo, email, langue, creeLe)
 */
export async function creerProfil(profil) {
  await setDoc(doc(db, "utilisateurs", profil.uid), profil);
}

/**
 * Récupère le profil d'un utilisateur par son UID.
 * @param {string} uid - L'identifiant Firebase de l'utilisateur
 * @returns {Object|null} Le profil ou null si inexistant
 */
export async function getProfil(uid) {
  const snap = await getDoc(doc(db, "utilisateurs", uid));
  return snap.exists() ? snap.data() : null;
}

// ---- INVENTAIRE FIGURINES ----

/**
 * Récupère toutes les données d'inventaire d'un utilisateur.
 * Retourne un objet indexé par figurineId pour un accès rapide.
 * @param {string} uid - L'identifiant Firebase de l'utilisateur
 * @returns {Object} Objet { figurineId: donneesFigurine }
 */
export async function getInventaireUtilisateur(uid) {
  const colRef = collection(db, "utilisateurs", uid, "inventaire");
  const snap = await getDocs(colRef);
  const result = {};
  snap.forEach((d) => {
    result[d.id] = d.data();
  });
  return result;
}

/**
 * Met à jour les données d'une figurine dans l'inventaire utilisateur.
 * Crée le document s'il n'existe pas encore.
 * @param {string} uid - L'identifiant Firebase de l'utilisateur
 * @param {string} figurineId - L'ID de la figurine
 * @param {Object} data - Les données à mettre à jour
 */
export async function mettreAJourFigurine(uid, figurineId, data) {
  const ref = doc(db, "utilisateurs", uid, "inventaire", figurineId);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    // Mise à jour partielle si le document existe
    await updateDoc(ref, data);
  } else {
    // Création du document avec valeurs par défaut + données fournies
    await setDoc(ref, {
      figurineId,
      enInventaire: false,
      quantiteInventaire: 0,
      souhaite: false,
      quantiteSouhaitee: 0,
      enProjet: false,
      ...data,
    });
  }
}
