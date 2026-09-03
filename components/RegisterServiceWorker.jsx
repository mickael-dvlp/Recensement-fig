"use client";

// ============================================================
// ENREGISTREMENT DU SERVICE WORKER — critère d'installabilité PWA.
// ============================================================

import { useEffect } from "react";

export default function RegisterServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return null;
}
