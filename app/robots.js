export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/connexion", "/inscription"],
        disallow: ["/accueil", "/figurines", "/heroes", "/projet", "/peinture", "/amis", "/profil"],
      },
    ],
    sitemap: "https://mesbg-collection-app.com/sitemap.xml",
  };
}
