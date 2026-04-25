/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Options de configuration Next.js */
  images: {
    // Domaines autorisés pour les images externes (à compléter si besoin)
    remotePatterns: [],
    // Permet l'utilisation d'images SVG locales
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig;
