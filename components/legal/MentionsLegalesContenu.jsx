// ============================================================
// CONTENU MENTIONS LÉGALES — partagé entre la modale (profil,
// utilisateurs connectés) et la page publique /politique-confidentialite
// (accessible sans compte, requise pour la fiche Play Store).
// ============================================================

export default function MentionsLegalesContenu() {
  return (
    <>
      {/* Éditeur */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[#C9A227] text-xs font-bold uppercase tracking-wider">
          Éditeur
        </p>
        <p className="text-[#D4D4D4]">
          Application :{" "}
          <span className="text-[#F5F5F5] font-medium">MESBG Collection</span>
        </p>
        <p className="text-[#D4D4D4]">
          Développeur :{" "}
          <span className="text-[#F5F5F5] font-medium">Mickael Martone</span>
        </p>
        <p className="text-[#D4D4D4]">
          Contact :{" "}
          <span className="text-[#F5F5F5] font-medium">
            mickael-dvlp@gmail.com
          </span>
        </p>
        <p className="text-[#6B6B6B] text-xs leading-relaxed">
          Application personnelle, non commerciale, sans affiliation
          officielle.
        </p>
      </div>

      <div className="h-px bg-[#2A2A2A]" />

      {/* Hébergement */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[#C9A227] text-xs font-bold uppercase tracking-wider">
          Hébergement & données
        </p>
        <p className="text-[#6B6B6B] text-xs leading-relaxed">
          Les données utilisateur (inventaire, profil, figurines
          personnalisées) sont stockées sur{" "}
          <span className="text-[#D4D4D4]">Firebase</span> (Google Cloud
          Platform), dans des centres de données situés en Europe.
        </p>
        <p className="text-[#6B6B6B] text-xs leading-relaxed">
          Aucune donnée n'est revendue ni partagée avec des tiers.
        </p>
      </div>

      <div className="h-px bg-[#2A2A2A]" />

      {/* RGPD */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[#C9A227] text-xs font-bold uppercase tracking-wider">
          Données personnelles (RGPD)
        </p>
        <p className="text-[#6B6B6B] text-xs leading-relaxed">
          Les seules données collectées sont :
        </p>
        <ul className="flex flex-col gap-1 pl-3">
          {[
            "Adresse e-mail (authentification)",
            "Pseudo",
            "Inventaire de figurines",
          ].map((item) => (
            <li
              key={item}
              className="text-[#D4D4D4] text-xs flex items-start gap-2"
            >
              <span className="text-[#C9A227] mt-0.5">·</span>
              {item}
            </li>
          ))}
        </ul>
        <p className="text-[#6B6B6B] text-xs leading-relaxed mt-1">
          Vous pouvez demander la suppression de votre compte et de toutes vos
          données à l'adresse :{" "}
          <span className="text-[#D4D4D4]">mickael-dvlp@gmail.com</span>
        </p>
      </div>

      <div className="h-px bg-[#2A2A2A]" />

      {/* Propriété intellectuelle */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[#C9A227] text-xs font-bold uppercase tracking-wider">
          Propriété intellectuelle
        </p>
        <p className="text-[#6B6B6B] text-xs leading-relaxed">
          Les noms, images et univers liés à{" "}
          <span className="text-[#D4D4D4]">The Lord of the Rings</span> et{" "}
          <span className="text-[#D4D4D4]">
            Middle-earth Strategy Battle Game (MESBG)
          </span>{" "}
          sont des marques déposées appartenant à{" "}
          <span className="text-[#D4D4D4]">Games Workshop Ltd</span> et/ou à
          leurs ayants droit respectifs.
        </p>
        <p className="text-[#6B6B6B] text-xs leading-relaxed">
          Cette application est un projet personnel sans approbation ni
          affiliation officielle avec Games Workshop.
        </p>
      </div>

      <div className="h-px bg-[#2A2A2A]" />

      {/* Cookies */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[#C9A227] text-xs font-bold uppercase tracking-wider">
          Cookies
        </p>
        <p className="text-[#6B6B6B] text-xs leading-relaxed">
          Aucun cookie publicitaire ni outil de traçage tiers n'est utilisé.
          Les tokens d'authentification Firebase sont stockés localement dans
          votre navigateur pour maintenir votre session.
        </p>
      </div>

      <p className="text-[#3A3A3A] text-[10px] text-center pb-1">
        Dernière mise à jour : mai 2025
      </p>
    </>
  );
}
