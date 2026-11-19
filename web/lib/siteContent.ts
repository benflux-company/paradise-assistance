import { prisma } from "@/lib/prisma";

export type ContentFieldType = "text" | "textarea" | "image" | "list";

export type ContentFieldDef = {
  key: string;
  label: string;
  type: ContentFieldType;
  section: string;
  hint?: string;
  default: string;
};

// Every editable text/image block that isn't its own model, grouped by
// section for the admin UI. Adding a block here makes it editable without a
// migration — getSiteContent() falls back to `default` for any key not yet
// present in the database (e.g. right after this list grows).
export const CONTENT_FIELDS: ContentFieldDef[] = [
  // Accueil — hero
  { key: "hero_eyebrow", label: "Sur-titre", type: "text", section: "Accueil — en-tête", default: "Architecture d'intérieur · Menuiserie sur mesure" },
  { key: "hero_title_line1", label: "Titre (ligne 1)", type: "text", section: "Accueil — en-tête", default: "L'art de vivre" },
  { key: "hero_title_line2", label: "Titre (ligne 2, en italique)", type: "text", section: "Accueil — en-tête", default: "chez soi." },
  { key: "hero_intro", label: "Texte d'introduction", type: "textarea", section: "Accueil — en-tête", default: "Ets Paradis Assistance conçoit et réalise vos cuisines, dressings, murs TV et intérieurs complets, du premier croquis à la dernière finition." },

  // Accueil — studio / intro section
  { key: "intro_label", label: "Sur-titre de la section", type: "text", section: "Accueil — le studio", default: "Le studio" },
  { key: "intro_text", label: "Texte", type: "textarea", section: "Accueil — le studio", default: "Nous dessinons chaque espace avec vous, puis nous le construisons. Plans, matériaux, menuiserie, éclairage et finitions sont pris en charge par une seule équipe, du premier rendez-vous à la remise des clés." },
  { key: "intro_image_1", label: "Photo 1", type: "image", section: "Accueil — le studio", default: "/img/dressing-eclaire.jpg" },
  { key: "intro_image_2", label: "Photo 2", type: "image", section: "Accueil — le studio", default: "/img/salle-de-bain.jpg" },

  // Accueil — bandeau défilant
  {
    key: "marquee_items",
    label: "Textes du bandeau défilant",
    type: "list",
    section: "Accueil — bandeau défilant",
    hint: "Un élément par ligne (mots-clés, noms de clients qui vous font confiance, etc.).",
    default: "Cuisines\nDressings\nMurs TV\nSalons\nSalles de bain\nSur mesure",
  },

  // Portfolio
  { key: "portfolio_title_line1", label: "Titre (ligne 1)", type: "text", section: "Page Portfolio", default: "Nos" },
  { key: "portfolio_title_line2", label: "Titre (ligne 2)", type: "text", section: "Page Portfolio", default: "réalisations" },
  { key: "portfolio_description", label: "Texte d'introduction", type: "textarea", section: "Page Portfolio", default: "Cuisines, murs TV, dressings et salles de bain. Chaque projet est dessiné, fabriqué et posé par notre équipe. Cliquez sur une image pour l'ouvrir en grand." },

  // Services
  { key: "services_title_line1", label: "Titre (ligne 1)", type: "text", section: "Page Prestations", default: "Nos" },
  { key: "services_title_line2", label: "Titre (ligne 2)", type: "text", section: "Page Prestations", default: "services" },
  { key: "services_description", label: "Texte d'introduction", type: "textarea", section: "Page Prestations", default: "De la conception au suivi de chantier, une équipe unique prend en charge votre projet d'intérieur, quelle que soit la pièce." },
  { key: "services_header_image", label: "Photo d'en-tête", type: "image", section: "Page Prestations", default: "/img/tv-gris.jpg" },
  { key: "faq_section_label", label: "Sur-titre de la section FAQ", type: "text", section: "Page Prestations", default: "Questions fréquentes" },
  { key: "faq_section_title_line1", label: "Titre FAQ (ligne 1)", type: "text", section: "Page Prestations", default: "Avant de" },
  { key: "faq_section_title_line2", label: "Titre FAQ (ligne 2, en italique)", type: "text", section: "Page Prestations", default: "commencer" },

  // Blog
  { key: "blog_title_line1", label: "Titre (ligne 1)", type: "text", section: "Page Blog", default: "Le" },
  { key: "blog_title_line2", label: "Titre (ligne 2)", type: "text", section: "Page Blog", default: "journal" },
  { key: "blog_description", label: "Texte d'introduction", type: "textarea", section: "Page Blog", default: "Conseils de fabrication, coulisses de chantier et idées d'aménagement pour mieux préparer votre projet." },

  // Contact
  { key: "contact_title_line1", label: "Titre (ligne 1)", type: "text", section: "Page Contact", default: "Parlons de" },
  { key: "contact_title_line2", label: "Titre (ligne 2)", type: "text", section: "Page Contact", default: "votre projet" },
  { key: "contact_description", label: "Texte d'introduction", type: "textarea", section: "Page Contact", default: "Décrivez-nous votre espace et vos envies. Nous vous recontactons pour convenir d'une visite et établir un devis." },
  { key: "contact_bottom_image", label: "Photo (bas de page)", type: "image", section: "Page Contact", default: "/img/chantier-cuisine.jpg" },
];

const DEFAULTS: Record<string, string> = Object.fromEntries(CONTENT_FIELDS.map((f) => [f.key, f.default]));

export async function getSiteContent(): Promise<Record<string, string>> {
  const rows = await prisma.siteContent.findMany();
  const byKey = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return { ...DEFAULTS, ...byKey };
}

export function contentList(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}
