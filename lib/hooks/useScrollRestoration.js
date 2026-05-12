"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function useScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    const key = `scroll:${pathname}`;

    const saved = sessionStorage.getItem(key);
    if (saved) {
      window.scrollTo({ top: parseInt(saved, 10), behavior: "instant" });
    }

    let id;
    function onScroll() {
      clearTimeout(id);
      id = setTimeout(() => {
        sessionStorage.setItem(key, String(Math.round(window.scrollY)));
      }, 100);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(id);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);
}
