"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getInventaireUtilisateur, mettreAJourFigurine } from "@/lib/firestore";

/**
 * Charge l'inventaire d'un utilisateur au montage et à chaque retour sur l'onglet.
 * Réinitialise l'inventaire à {} si uid devient null/undefined (déconnexion).
 *
 * @param {string|null|undefined} uid  - UID Firebase de l'utilisateur
 * @param {Function} [opExtra]         - Callback async optionnel exécuté en parallèle :
 *                                       (uid) => Promise<any>. Sa valeur de retour est ignorée ;
 *                                       utiliser pour déclencher un setState externe (ex: figurinesCustom).
 *                                       Stocké dans un ref pour éviter de re-déclencher l'effet si
 *                                       la référence de la fonction change entre deux rendus.
 *                                       Une erreur dans opExtra n'annule pas le chargement de l'inventaire.
 * @returns {{ inventaire, setInventaire, chargement }}
 */
export function useInventaire(uid, opExtra) {
  const [inventaire, setInventaire] = useState({});
  const [chargement, setChargement] = useState(true);

  const opExtraRef = useRef(opExtra);
  useEffect(() => { opExtraRef.current = opExtra; }, [opExtra]);

  useEffect(() => {
    if (!uid) {
      setInventaire({});
      setChargement(false);
      return;
    }

    setChargement(true);

    async function charger() {
      try {
        // Promise.allSettled : une erreur dans opExtra n'annule pas le chargement de l'inventaire.
        const promesses = [getInventaireUtilisateur(uid)];
        if (opExtraRef.current) promesses.push(opExtraRef.current(uid));
        const [invResult] = await Promise.allSettled(promesses);
        if (invResult.status === "fulfilled") setInventaire(invResult.value);
      } finally {
        setChargement(false);
      }
    }

    charger();
    window.addEventListener("focus", charger);
    return () => window.removeEventListener("focus", charger);
  }, [uid]);

  // Mise à jour optimiste : applique data localement, rollback si Firestore échoue.
  const mettreAJour = useCallback(
    async (figurineId, data) => {
      if (!uid) return;
      let sauvegarde;
      let existaitAvant;
      setInventaire((prev) => {
        existaitAvant = figurineId in prev;
        sauvegarde = prev[figurineId];
        return { ...prev, [figurineId]: { ...(prev[figurineId] ?? {}), ...data } };
      });
      try {
        await mettreAJourFigurine(uid, figurineId, data);
      } catch {
        setInventaire((prev) => {
          if (existaitAvant) return { ...prev, [figurineId]: sauvegarde };
          const next = { ...prev };
          delete next[figurineId];
          return next;
        });
      }
    },
    [uid]
  );

  return { inventaire, setInventaire, chargement, mettreAJour };
}
