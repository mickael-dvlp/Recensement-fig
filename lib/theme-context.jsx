"use client";

// ============================================================
// CONTEXTE DE THÈME - Mode sombre / Mode clair
// ============================================================
// Gère le thème de l'application et le persiste dans localStorage.
// Le thème est appliqué en ajoutant/retirant la classe "light"
// sur l'élément <html>, ce qui déclenche les overrides CSS.

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // "dark" par défaut (thème original de l'app)
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    // Charge le thème sauvegardé au démarrage
    const savedTheme = localStorage.getItem("mesbg-theme") || "dark";
    setTheme(savedTheme);
    appliquerTheme(savedTheme);
  }, []);

  /**
   * Applique le thème en manipulant la classe sur <html>.
   * Les overrides CSS dans globals.css réagissent à "html.light".
   */
  function appliquerTheme(nouveauTheme) {
    const html = document.documentElement;
    if (nouveauTheme === "light") {
      html.classList.add("light");
      html.classList.remove("dark");
    } else {
      html.classList.remove("light");
      html.classList.add("dark");
    }
  }

  /**
   * Bascule entre mode sombre et mode clair, et sauvegarde le choix.
   */
  function toggleTheme() {
    const nouveauTheme = theme === "dark" ? "light" : "dark";
    setTheme(nouveauTheme);
    appliquerTheme(nouveauTheme);
    localStorage.setItem("mesbg-theme", nouveauTheme);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme doit être utilisé dans un <ThemeProvider>");
  return context;
}
