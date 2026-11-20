// Vraies réalisations du client (98 photos fournies, groupées par projet),
// importées sur Cloudinary et figées ici comme source de seed définitive —
// remplace les 13 projets de démonstration utilisés pendant le développement.
import { ProjectCategory } from "@prisma/client";

export type RealProject = {
  slug: string;
  title: string;
  category: ProjectCategory;
  shortDesc: string;
  longDesc: string;
  featured: boolean;
  wide: boolean;
  // A number resolves against CLOUDINARY_PHOTO_BASE + "IMG_<n>.jpg" (the
  // first 98-photo batch); a string is a named public_id from a later batch
  // (resolved against CLOUDINARY_NAMED_BASE below).
  photos: (number | string)[];
};

const CAT = {
  C: ProjectCategory.CUISINES,
  T: ProjectCategory.MURS_TV,
  D: ProjectCategory.DRESSINGS,
  S: ProjectCategory.SALONS,
  B: ProjectCategory.SALLES_DE_BAIN,
};

const TEMPLATES: Record<ProjectCategory, { short: (d: string) => string; long: (d: string) => string }> = {
  [ProjectCategory.CUISINES]: {
    short: (d) => `Cuisine ${d}.`,
    long: (d) => `Cuisine sur mesure ${d}, conçue et posée par notre équipe.`,
  },
  [ProjectCategory.MURS_TV]: {
    short: (d) => `Mur TV ${d}.`,
    long: (d) => `Habillage mural sur mesure pour le téléviseur, ${d}.`,
  },
  [ProjectCategory.DRESSINGS]: {
    short: (d) => `Dressing ${d}.`,
    long: (d) => `Dressing sur mesure, ${d}, pensé pour optimiser le rangement.`,
  },
  [ProjectCategory.SALONS]: {
    short: (d) => `Aménagement ${d}.`,
    long: (d) => `Réalisation sur mesure pour cet espace de vie, ${d}.`,
  },
  [ProjectCategory.SALLES_DE_BAIN]: {
    short: (d) => `Salle de bain ${d}.`,
    long: (d) => `Aménagement de salle de bain sur mesure, ${d}.`,
  },
};

function mk(
  slug: string,
  title: string,
  cat: ProjectCategory,
  detail: string,
  photos: (number | string)[],
  opts: { featured?: boolean; wide?: boolean } = {}
): RealProject {
  const t = TEMPLATES[cat];
  return {
    slug,
    title,
    category: cat,
    shortDesc: t.short(detail),
    longDesc: t.long(detail),
    featured: !!opts.featured,
    wide: !!opts.wide,
    photos,
  };
}

export const REAL_PROJECTS: RealProject[] = [
  mk("bar-bois-sur-mesure", "Bar privé en bois", CAT.S, "en bois massif avec étagère à verres et rangement bouteilles", [5762, 5773, 5788, 5808], { featured: true, wide: true }),
  mk("mur-tv-lambris-bleu-marine", "Mur TV, lambris bleu marine", CAT.T, "en lambris bleu marine avec meuble bas blanc", [5772, 5787], { featured: true }),
  mk("mur-tv-marbre-led-bleue", "Mur TV, marbre et bois sous LED bleue", CAT.T, "en marbre et lambris bois, souligné par un bandeau LED bleu", [5747, 5758]),
  mk("cuisine-blanche-suspensions-dorees", "Cuisine blanche, suspensions dorées", CAT.C, "blanche avec plaque de cuisson à gaz et suspensions dorées", [5778, 5780], { featured: true }),
  mk("cuisine-ilot-bois-clair", "Cuisine, îlot en bois clair", CAT.C, "avec îlot en bois clair et tabourets de bar", [5781, 5782], { featured: true }),
  mk("chambre-tete-de-lit-bleu-nuit", "Chambre, tête de lit capitonnée", CAT.S, "avec tête de lit capitonnée bleu nuit", [5764, 5789]),
  mk("escalier-bois-sur-mesure", "Escalier en bois sur mesure", CAT.S, "en structure et marches bois, en cours de pose", [5766, 5792, 5807], { featured: true }),
  mk("claustra-bois-exterieur", "Claustra en bois, extérieur", CAT.S, "en claustra bois à motif croisé pour cet extérieur", [5809, 5818]),
  mk("chantier-facade-enduit", "Chantier extérieur, façade et enduit", CAT.S, "avec reprise d'enduit en façade, échafaudage", [5731, 5733, 5820]),
  mk("lounge-eclairage-scenique", "Espace lounge, éclairage scénique", CAT.S, "avec sol et éclairage scénique colorés pour un espace de réception", [5739, 5746, 5753, 5757, 5765, 5775, 5822], { featured: true, wide: true }),
  mk("cuisine-chantier-caissons-blancs", "Cuisine en chantier, pose des caissons", CAT.C, "blanche, en cours de pose des caissons et du plan de travail", [5737, 5742]),
  mk("cuisine-four-micro-ondes-encastres", "Cuisine, four et micro-ondes encastrés", CAT.C, "avec four et micro-ondes encastrés dans une colonne bois", [5805, 5806]),

  mk("cuisine-ilot-bois-lamelles", "Cuisine, îlot en lamelles de bois", CAT.C, "avec îlot en lamelles de bois et suspensions noires", [5732]),
  mk("cuisine-chantier-miroir", "Cuisine en chantier, crédence miroir", CAT.C, "en cours de finition avec crédence miroir", [5734]),
  mk("salon-fauteuils-beiges", "Salon, fauteuils beiges", CAT.S, "avec fauteuils beiges et grandes baies vitrées", [5735]),
  mk("mur-tv-bois-led-verte", "Mur TV, bois et LED verte", CAT.T, "en bois avec cadre rétroéclairé vert", [5736]),
  mk("cuisine-blanche-suspensions-noires", "Cuisine blanche, îlot et suspensions", CAT.C, "blanche avec îlot central et suspensions", [5738]),
  mk("salle-de-bain-miroir-rond", "Salle de bain, miroir rond", CAT.B, "avec vasque noire et miroir rond", [5740]),
  mk("mur-tv-gris-led-bleue", "Mur TV, lambris gris et LED bleue", CAT.T, "en lambris gris avec étagère et bandeau LED bleu", [5741]),
  mk("chantier-tour-bois-exterieur", "Chantier, structure bois extérieure", CAT.S, "en structure bois en cours de construction", [5743]),
  mk("piece-lambris-bois-rouge", "Pièce en lambris bois", CAT.S, "habillée de portes et lambris bois", [5744]),
  mk("chantier-panneau-bois", "Chantier, panneau bois en cours de pose", CAT.S, "avec panneau bois en cours de pose sur échafaudage", [5745]),
  mk("salle-de-bain-mosaique-douche", "Salle de bain, douche mosaïque", CAT.B, "avec douche et mosaïque de carreaux", [5748]),
  mk("cuisine-chantier-bois-fonce", "Cuisine en chantier, tons foncés", CAT.C, "en cours de pose, caissons de tons foncés", [5749]),
  mk("cuisine-grise-anthracite", "Cuisine grise anthracite", CAT.C, "grise anthracite avec façades vitrées", [5750]),
  mk("cuisine-blanche-desserte-bois", "Cuisine blanche, desserte bois", CAT.C, "blanche avec desserte vitrée et réfrigérateur américain", [5751]),
  mk("dressing-ouvert-bois-blanc", "Dressing ouvert, bois et blanc", CAT.D, "ouvert avec étagères bois et tiroirs blancs", [5752]),
  mk("mur-tv-prepa-pose", "Préparation pose mur TV", CAT.T, "en cours de préparation avant pose du meuble", [5754]),
  mk("cuisine-chantier-peinture", "Cuisine en chantier, finitions peinture", CAT.C, "en cours de finitions peinture", [5755]),
  mk("cuisine-bois-marbre-induction", "Cuisine, îlot bois et marbre", CAT.C, "avec îlot bois et marbre, plaque à induction", [5756]),
  mk("cuisine-chantier-colonne-bois", "Cuisine en chantier, colonne bois", CAT.C, "en cours de pose avec colonne bois", [5759]),
  mk("cuisine-chantier-caissons-pose", "Cuisine en chantier, pose des meubles hauts", CAT.C, "en cours de pose des meubles hauts", [5760]),
  mk("dressing-blanc-ouvert", "Dressing blanc, rangement ouvert", CAT.D, "blanc avec rangements ouverts et tiroirs", [5761]),
  mk("chantier-echafaudage-facade", "Chantier, échafaudage en façade", CAT.S, "avec échafaudage en façade", [5763]),
  mk("exterieur-porte-bois", "Extérieur, porte et lambris bois", CAT.S, "avec porte et lambris bois extérieur", [5767]),
  mk("mur-tv-gris-niche-bois", "Mur TV, niche et lambris", CAT.T, "gris avec niche de rangement et lambris bois", [5768]),
  mk("salle-de-bain-robinetterie-noire", "Salle de bain, robinetterie noire", CAT.B, "avec douche et robinetterie noire mate", [5769]),
  mk("terrasse-bois-chantier", "Terrasse en bois, chantier", CAT.S, "en platelage bois, chantier en cours", [5770]),
  mk("cuisine-chantier-blanche-1", "Cuisine blanche en chantier", CAT.C, "blanche, en cours de pose du plan de travail", [5771]),
  mk("cuisine-chantier-blanche-2", "Cuisine blanche en chantier, finitions", CAT.C, "blanche, finitions en cours", [5774]),
  mk("cuisine-noire-doree", "Cuisine noire et dorée", CAT.C, "noire avec touches dorées et suspensions", [5776]),
  mk("cuisine-bleu-marine-marbre", "Cuisine bleu marine et marbre", CAT.C, "bleu marine avec crédence marbre", [5777]),
  mk("dressing-vitrine-led", "Dressing, vitrine rétroéclairée", CAT.D, "avec vitrine verticale rétroéclairée", [5779]),
  mk("salon-ouvert-cuisine", "Salon ouvert sur la cuisine", CAT.S, "ouvert sur la cuisine, fauteuils capitonnés", [5783]),
  mk("cuisine-marbre-compacte", "Cuisine, marbre compact", CAT.C, "compacte avec plan de travail marbre foncé", [5784]),
  mk("dressing-portes-hautes-bois", "Dressing, portes hautes bois", CAT.D, "avec portes hautes en bois", [5785]),
  mk("cuisine-bar-bois-orange", "Cuisine, comptoir bar bois", CAT.C, "avec comptoir bar bois et accents orangés", [5786]),
  mk("exterieur-facade-lambris", "Extérieur, façade en lambris bois", CAT.S, "en lambris bois, chantier en façade", [5790]),
  mk("chambre-marbre-suspensions", "Chambre, mur marbre et suspensions", CAT.S, "avec pan de mur marbre et suspensions", [5791]),
  mk("chantier-echafaudage-2", "Chantier, échafaudage extérieur", CAT.S, "avec échafaudage extérieur", [5793]),
  mk("cuisine-bois-fonce-marbre", "Cuisine, bois foncé et marbre", CAT.C, "en L avec bois foncé et plan marbre", [5794]),
  mk("mur-tv-marbre-niches-dorees", "Mur TV, marbre et niches dorées", CAT.T, "en marbre avec niches de rangement dorées", [5795], { featured: true, wide: true }),
  mk("salle-de-bain-vasque-mosaique", "Salle de bain, vasque et mosaïque", CAT.B, "avec vasque posée et mosaïque murale", [5796]),
  mk("dressing-led-doree", "Dressing, éclairage LED doré", CAT.D, "avec éclairage LED doré intégré", [5797]),
  mk("meuble-bibliotheque-vert", "Meuble bibliothèque sur mesure", CAT.S, "vert avec niches et éclairage intégré", [5798]),
  mk("cuisine-blanche-fonce-contraste", "Cuisine, contraste blanc et foncé", CAT.C, "avec meubles hauts blancs et bas foncés", [5799]),
  mk("mur-tv-bois-balcon", "Mur TV, lambris bois face baie vitrée", CAT.T, "en lambris bois, face à une baie vitrée", [5800]),
  mk("cuisine-chantier-gaz", "Cuisine en chantier, plaque à gaz", CAT.C, "en cours de pose avec plaque à gaz", [5801]),
  mk("dressing-portes-persiennes", "Dressing, portes à persiennes", CAT.D, "blanc avec portes à persiennes", [5802]),
  mk("exterieur-tour-bois-2", "Extérieur, structure bois", CAT.S, "en structure bois, chantier en cours", [5803]),
  mk("cuisine-beige-credence-foncee", "Cuisine beige, crédence foncée", CAT.C, "beige avec crédence de tons foncés", [5804]),
  mk("cuisine-ouverte-bois-blanc", "Cuisine ouverte, bois et blanc", CAT.C, "ouverte, associant bois et blanc", [5810]),
  mk("cuisine-blanche-chaises-bleues", "Cuisine, îlot et chaises bleues", CAT.C, "avec îlot central et chaises bleu nuit", [5811]),
  mk("cuisine-miroir-bois-frigo", "Cuisine, miroir et bois", CAT.C, "avec crédence miroir et réfrigérateur encastré", [5812]),
  mk("cuisine-marbre-noir-cascade", "Cuisine, îlot cascade marbre noir", CAT.C, "avec îlot effet cascade en marbre noir", [5813]),
  mk("terrasse-lampadaire-bois", "Terrasse en bois, éclairage extérieur", CAT.S, "en bois avec éclairage extérieur", [5814]),
  mk("cuisine-blanche-longueur", "Cuisine blanche, plan en longueur", CAT.C, "blanche, plan de travail en longueur", [5815]),
  mk("mur-tv-marbre-beige", "Mur TV, marbre beige", CAT.T, "en marbre beige avec meuble bas suspendu", [5816]),
  mk("cuisine-blanche-fenetre", "Cuisine blanche, évier sous fenêtre", CAT.C, "blanche avec évier sous fenêtre", [5817]),
  mk("cuisine-bois-longueur", "Cuisine bois clair, en longueur", CAT.C, "bois clair, plan en longueur", [5819]),
  mk("cuisine-induction-bois-blanc", "Cuisine, induction, bois et blanc", CAT.C, "associant bois et blanc, plaque à induction", [5821]),
  mk("cuisine-chantier-frigo", "Cuisine en chantier, pose du réfrigérateur", CAT.C, "en cours de pose avec réfrigérateur encastrable", [5823]),
  mk("terrasse-bois-chantier-2", "Terrasse bois, chantier", CAT.S, "en platelage bois, chantier en cours", [5824]),
  mk("exterieur-panneau-bois", "Extérieur, panneau bois sur mesure", CAT.S, "avec panneau bois sur mesure", [5825]),
  mk("cuisine-blanche-marbre-compacte", "Cuisine blanche, marbre compact", CAT.C, "blanche et compacte avec plan marbre", [5826]),
  mk("chantier-echafaudage-3", "Chantier, échafaudage de façade", CAT.S, "avec échafaudage de façade", [5827]),
  mk("mur-tv-bois-salon-orange", "Mur TV, lambris bois, salon chaleureux", CAT.T, "en lambris bois dans un salon aux tons chauds", [5828]),

  // Deuxième lot de photos (envoyé séparément par le client) — seule la photo
  // ci-dessous est inédite ; les 4 autres du lot sont les mêmes pièces que des
  // projets déjà listés plus haut (mêmes photos, juste reprises pour le hero)
  // donc elles ne sont pas dupliquées ici en tant que projets séparés.
  mk("cuisine-ilot-marbre-orchidee", "Cuisine, îlot en marbre cannelé", CAT.C, "à façade cannelée avec suspensions ambrées et vitrine rétroéclairée", ["cuisine_ilot_marbre_orchidee"], { featured: true }),
];

// Pas de vidéo dans le hero (confirmé par le client) — les 7 photos du
// deuxième lot, choisies pour leur netteté et leur style moderne.
export const REAL_HERO_SLIDES: Array<{ photo: number | string; alt: string; caption: string }> = [
  { photo: "marble_amber_pendants", alt: "Cuisine, îlot en marbre et suspensions ambrées", caption: "Cuisine, îlot en marbre et suspensions ambrées" },
  { photo: "mur_tv_marbre_cheminee", alt: "Mur TV en marbre avec cheminée intégrée", caption: "Mur TV en marbre et cheminée intégrée" },
  { photo: "gold_ring_kitchen_1", alt: "Cuisine ouverte, suspensions en anneaux dorés", caption: "Cuisine ouverte, suspensions en anneaux dorés" },
  { photo: "gold_ring_kitchen_2", alt: "Cuisine ouverte, suspensions en anneaux dorés", caption: "Cuisine ouverte sur le salon" },
  { photo: "bar_bouteilles_roses", alt: "Bar, suspensions en bouteilles roses", caption: "Bar, suspensions en bouteilles roses" },
  { photo: "cuisine_couloir_led", alt: "Cuisine en couloir, niche et vitrine LED", caption: "Cuisine en couloir, niche et vitrine LED" },
  { photo: "cuisine_ilot_marbre_orchidee", alt: "Cuisine, îlot en marbre cannelé", caption: "Cuisine, îlot en marbre cannelé" },
];

// Les 2 photos mises en avant dans la section "Le studio" de l'accueil.
export const REAL_INTRO_IMAGES: [string, string] = ["gold_ring_kitchen_1", "gold_ring_kitchen_2"];

export const CLOUDINARY_PHOTO_BASE = "https://res.cloudinary.com/de6pf7joi/image/upload/paradise-assistance-production/realisations/IMG_";
export const CLOUDINARY_NAMED_BASE = "https://res.cloudinary.com/de6pf7joi/image/upload/paradise-assistance-production/realisations/";
