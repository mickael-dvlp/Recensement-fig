"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function useScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    const key = `scroll:${pathname}`;
    const saved = sessionStorage.getItem(key);

    let rafId;

    if (saved) {
      const target = parseInt(saved, 10);
      const startTime = Date.now();

      // Réessaye chaque frame jusqu'à ce que la page soit assez haute,
      // ou abandonne après 2s (contenu chargé mais liste plus courte qu'avant).
      function tryScroll() {
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;
        if (maxScroll >= target - 50 || Date.now() - startTime > 2000) {
          window.scrollTo({ top: target, behavior: "instant" });
          return;
        }
        rafId = requestAnimationFrame(tryScroll);
      }

      rafId = requestAnimationFrame(tryScroll);
    }

    let debounceId;
    function onScroll() {
      clearTimeout(debounceId);
      debounceId = setTimeout(() => {
        sessionStorage.setItem(key, String(Math.round(window.scrollY)));
      }, 100);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(debounceId);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);
}
