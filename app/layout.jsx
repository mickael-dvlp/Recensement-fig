// ============================================================
// LAYOUT RACINE - Enveloppe toute l'application
// ============================================================

import "./globals.css";
import { Uncial_Antiqua } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/lib/theme-context";

const uncialAntiqua = Uncial_Antiqua({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-elvish",
  display: "swap",
});

export const metadata = {
  title: "MESBG - Gestion de Figurines",
  description: "Recensez et gérez votre collection de figurines Middle-Earth Strategy Battle Game",
  icons: {
    icon: "/image/favicon.ico",
  },
};

export const viewport = {
  themeColor: "#0D0D0D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    /*
      suppressHydrationWarning : nécessaire car la classe "light"/"dark" est
      ajoutée côté client (depuis localStorage) avant l'hydratation React.
      Sans ça, Next.js afficherait une erreur d'hydratation.
    */
    <html lang="fr" suppressHydrationWarning className={uncialAntiqua.variable}>
      <head>
        {/*
          Script anti-flash : s'exécute de manière SYNCHRONE avant le premier
          rendu du navigateur. Il lit le thème sauvegardé et applique la bonne
          classe sur <html> immédiatement, évitant un flash sombre→clair.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('mesbg-theme')||'dark';document.documentElement.classList.add(t);}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body className="bg-[#0D0D0D] min-h-screen">
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
