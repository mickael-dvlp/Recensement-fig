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
  metadataBase: new URL("https://mesbg-collection-app.com"),
  title: {
    default: "MESBG — Gérez votre collection de figurines Middle-Earth",
    template: "%s | MESBG",
  },
  description:
    "L'application de référence pour les joueurs de Middle-Earth Strategy Battle Game. Inventaire de figurines Games Workshop, mémos de projet, guides de peinture et système d'amis.",
  keywords: [
    "MESBG",
    "Middle-Earth Strategy Battle Game",
    "figurines",
    "inventaire figurines",
    "collection MESBG",
    "Seigneur des Anneaux",
    "The Hobbit",
    "Games Workshop",
    "gestion collection",
  ],
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/image/favicon-32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/apple-icon.png",
  },
  verification: {
    google: "7KJY7tz70Z27FUTpaUlaHPgJ3D7aJdwHQD1hIBnUngA",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://mesbg-collection-app.com",
    siteName: "MESBG",
    title: "MESBG — Gérez votre collection de figurines Middle-Earth",
    description:
      "Inventaire de figurines MESBG, mémos de projet, guides de peinture et système d'amis. Gratuit et sans publicité.",
    images: [
      {
        url: "/image/mesbg_header.jpg",
        width: 1200,
        height: 630,
        alt: "MESBG — Gestion de figurines Middle-Earth Strategy Battle Game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MESBG — Gérez votre collection de figurines Middle-Earth",
    description:
      "Inventaire de figurines MESBG, mémos de projet, guides de peinture et système d'amis.",
    images: ["/image/mesbg_header.jpg"],
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
