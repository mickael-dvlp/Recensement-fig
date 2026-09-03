// ============================================================
// WEB APP MANIFEST — installabilité PWA (prérequis Play Store via PWABuilder)
// ============================================================

export default function manifest() {
  return {
    name: "MESBG Collection — Gérez votre collection de figurines",
    short_name: "MESBG",
    description:
      "Inventaire de figurines Middle-Earth Strategy Battle Game, mémos de projet, guides de peinture et système d'amis.",
    start_url: "/",
    display: "standalone",
    background_color: "#0D0D0D",
    theme_color: "#0D0D0D",
    orientation: "portrait-primary",
    lang: "fr",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
