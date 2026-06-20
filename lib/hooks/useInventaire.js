"use client";

import { useState, useEffect, useRef } from "react";
import { getInventaireUtilisateur } from "@/lib/firestore";

/**
 * Charge l'inventaire d'un utilisateur au montage et à chaque retour sur l'onglet.
 *
 * @param {string|null|undefined} uid  - UID Firebase de l'utilisateur
 * @param {Function} [opExtra]         - Fonction async optionnelle exécutée en parallèle :
 *                                       (uid) => Promise<void>. Utile pour charger les
 *                                       figurinesCustom en même temps que l'inventaire.
 * @returns {{ inventaire, setInventaire, chargement }}
 */
export function useInventaire(uid, opExtra) {
  const [inventaire, setInventaire] = useState({});
  const [chargement, setChargement] = useState(true);

  const opExtraRef = useRef(opExtra);
  useEffect(() => { opExtraRef.current = opExtra; }, [opExtra]);

  useEffect(() => {
    if (!uid) return;

    async function charger() {
      const ops = [getInventaireUtilisateur(uid)];
      if (opExtraRef.current) ops.push(opExtraRef.current(uid));
      const [inv] = await Promise.all(ops);
      setInventaire(inv);
      setChargement(false);
    }

    charger();
    window.addEventListener("focus", charger);
    return () => window.removeEventListener("focus", charger);
  }, [uid]);

  return { inventaire, setInventaire, chargement };
}
