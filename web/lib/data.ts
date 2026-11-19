export function img(name: string): string {
  return `/img/${name}.jpg`;
}

export type ProjectCategory = "Cuisines" | "Murs TV" | "Dressings" | "Salons" | "Salles de bain";

export type ProjectData = {
  slug: string;
  image: string;
  gallery: string[];
  title: string;
  category: ProjectCategory;
  alt: string;
  shortDesc: string;
  longDesc: string;
  wide?: boolean;
};

export const PROJECTS: ProjectData[] = [
  {
    slug: "cuisine-marbre",
    image: "cuisine-marbre",
    gallery: ["cuisine-marbre"],
    title: "Cuisine, îlot en marbre",
    category: "Cuisines",
    alt: "Cuisine blanche avec îlot en marbre et suspensions dorées",
    shortDesc: "Îlot en cascade effet marbre, façades blanches et laiton.",
    longDesc:
      "Une cuisine blanche structurée autour d'un grand îlot en cascade effet marbre, prolongé par la crédence. Les meubles hauts vitrés sont éclairés de l'intérieur et les poignées en laiton répondent aux suspensions dorées.",
    wide: true,
  },
  {
    slug: "tv-noir",
    image: "tv-noir",
    gallery: ["tv-noir"],
    title: "Mur TV, lamelles noires",
    category: "Murs TV",
    alt: "Mur TV en lamelles noires avec panneau laqué blanc",
    shortDesc: "Lamelles noires, panneau laqué et meuble suspendu.",
    longDesc:
      "Un mur TV pleine hauteur habillé de lamelles noires. Le panneau laqué blanc encadre l'écran et le long meuble suspendu à tiroirs cache les appareils et les câbles.",
  },
  {
    slug: "chantier-cuisine",
    image: "chantier-cuisine",
    gallery: ["chantier-cuisine", "chantier-cuisine-2", "chantier-couloir"],
    title: "Cuisine sur mesure, en chantier",
    category: "Cuisines",
    alt: "Cuisine sur mesure en cours d'installation par l'équipe",
    shortDesc: "Pose des caissons et habillage bois, sur place.",
    longDesc:
      "Les coulisses d'une cuisine sur mesure : caissons blancs assemblés sur place, colonne habillée de bois et espace prévu pour les appareils encastrés. Le sol est protégé pendant toute la durée du chantier.",
  },
  {
    slug: "dressing-eclaire",
    image: "dressing-eclaire",
    gallery: ["dressing-eclaire"],
    title: "Dressing éclairé",
    category: "Dressings",
    alt: "Dressing aux étagères en bois éclairées",
    shortDesc: "Étagères en bois, tiroirs et LED intégrée.",
    longDesc:
      "Un dressing aux portes laquées blanches qui s'ouvre sur un intérieur en bois clair. Étagères réglables, tiroirs à coulisses et éclairage LED intégré aux montants pour bien voir chaque rangement.",
  },
  {
    slug: "cuisine-niche",
    image: "cuisine-niche",
    gallery: ["cuisine-niche"],
    title: "Colonnes et niche en bois",
    category: "Cuisines",
    alt: "Colonnes blanches de cuisine avec niche en bois",
    shortDesc: "Colonnes four, vitrine éclairée et niche à lamelles.",
    longDesc:
      "Un linéaire de colonnes blanches qui intègre les fours et une vitrine éclairée. Il se termine par une niche en bois à lamelles, avec étagères et spots, qui sert de bar et de décoration.",
  },
  {
    slug: "tv-marbre",
    image: "tv-marbre",
    gallery: ["tv-marbre"],
    title: "Mur TV, effet marbre",
    category: "Murs TV",
    alt: "Mur TV avec panneau effet marbre et LED bleue",
    shortDesc: "Panneau effet marbre et éclairage indirect.",
    longDesc:
      "Un grand panneau effet marbre posé sur un fond de lamelles, souligné par un éclairage LED indirect. Le meuble bas suspendu et la bibliothèque latérale complètent l'ensemble.",
    wide: true,
  },
  {
    slug: "salle-de-bain",
    image: "salle-de-bain",
    gallery: ["salle-de-bain"],
    title: "Salle de bain, mosaïque",
    category: "Salles de bain",
    alt: "Salle de bain avec mosaïque de verre et accessoires noirs",
    shortDesc: "Mosaïque de verre et accessoires en métal noir.",
    longDesc:
      "Une bande verticale de mosaïque de verre met en valeur la vasque posée. Miroir rond, robinetterie et accessoires en métal noir sont assortis pour un ensemble cohérent.",
  },
  {
    slug: "cuisine-cannele",
    image: "cuisine-cannele",
    gallery: ["cuisine-cannele"],
    title: "Îlot cannelé",
    category: "Cuisines",
    alt: "Îlot de cuisine cannelé en marbre avec suspensions",
    shortDesc: "Façade cannelée effet marbre, verre ambré.",
    longDesc:
      "Un îlot à façade cannelée effet marbre, posé sur un socle sombre. Les suspensions en verre ambré et les vitrines éclairées donnent une ambiance chaleureuse à la cuisine.",
  },
  {
    slug: "dressing-led",
    image: "dressing-led",
    gallery: ["dressing-led"],
    title: "Dressing, LED verticale",
    category: "Dressings",
    alt: "Dressing avec éclairage LED vertical",
    shortDesc: "Portes laquées et rubans LED dans les montants.",
    longDesc:
      "Des portes laquées blanches sans poignée et, à l'intérieur, des rubans LED verticaux dans les montants qui éclairent les étagères en bois.",
  },
  {
    slug: "tv-gris",
    image: "tv-gris",
    gallery: ["tv-gris"],
    title: "Mur TV, lamelles grises",
    category: "Murs TV",
    alt: "Mur TV en lamelles grises avec LED bleue",
    shortDesc: "Lamelles grises, cadre rétroéclairé, étagères.",
    longDesc:
      "Des lamelles grises, un cadre blanc rétroéclairé autour de l'écran, des étagères flottantes et un meuble bas suspendu pour un salon épuré.",
  },
  {
    slug: "salon-bleu",
    image: "salon-bleu",
    gallery: ["salon-bleu"],
    title: "Salon capitonné",
    category: "Salons",
    alt: "Salon aux fauteuils bleus capitonnés, plafond lumineux",
    shortDesc: "Plafond lumineux et fauteuils bleu nuit.",
    longDesc:
      "Un faux plafond avec gorge lumineuse, des murs gris et des spots encastrés mettent en valeur les fauteuils capitonnés bleu nuit.",
    wide: true,
  },
  {
    slug: "cuisine-dore",
    image: "cuisine-dore",
    gallery: ["cuisine-dore"],
    title: "Îlot et suspensions dorées",
    category: "Cuisines",
    alt: "Cuisine avec îlot et suspensions dorées",
    shortDesc: "Îlot laqué, plaque gaz et anneaux dorés.",
    longDesc:
      "Un îlot laqué avec plaque gaz intégrée, face au salon. Les suspensions en anneaux dorés et les poignées assorties apportent une touche chaude.",
  },
  {
    slug: "cuisine-cadre",
    image: "cuisine-cadre",
    gallery: ["cuisine-cadre"],
    title: "Cadre en bois et bar",
    category: "Cuisines",
    alt: "Cuisine avec cadre en bois et bar",
    shortDesc: "Bar en quartz encadré de bois.",
    longDesc:
      "Une cuisine ouverte délimitée par un cadre en bois. Le bar en quartz accueille deux tabourets, un porte-verres central et trois suspensions cuivrées.",
  },
];

export const PROJECT_CATEGORIES: (ProjectCategory | "Tous")[] = [
  "Tous",
  "Cuisines",
  "Murs TV",
  "Dressings",
  "Salons",
  "Salles de bain",
];

export type PostCategory = "Conseils" | "Chantiers" | "Inspirations";

export type PostData = {
  id: number;
  slug: string;
  image: string;
  category: PostCategory;
  title: string;
  excerpt: string;
};

export const POSTS: PostData[] = [
  {
    id: 1,
    slug: "1",
    image: "tv-noir",
    category: "Conseils",
    title: "Mur TV en lamelles : comment il se construit",
    excerpt: "De l'ossature aux lamelles, en passant par le panneau laqué et l'éclairage LED.",
  },
  {
    id: 2,
    slug: "2",
    image: "cuisine-marbre",
    category: "Conseils",
    title: "Laqué brillant ou mat : quelle finition choisir ?",
    excerpt: "Les critères pour trancher selon l'usage, la lumière et l'entretien.",
  },
  {
    id: 3,
    slug: "3",
    image: "dressing-led",
    category: "Conseils",
    title: "L'éclairage LED intégré au meuble : où le placer",
    excerpt: "Sous étagère, en montant vertical ou en niche : la lumière qui sert vraiment.",
  },
  {
    id: 4,
    slug: "4",
    image: "chantier-blanche",
    category: "Chantiers",
    title: "Une cuisine blanche en cours de pose",
    excerpt: "Les caissons sont posés, les façades arrivent : ce qui se passe avant la finition.",
  },
  {
    id: 5,
    slug: "5",
    image: "cuisine-cannele",
    category: "Conseils",
    title: "Marbre, quartz ou stratifié : quel plan de travail ?",
    excerpt: "Entretien, résistance à la chaleur et budget, comparés point par point.",
  },
  {
    id: 6,
    slug: "6",
    image: "salon-bleu",
    category: "Inspirations",
    title: "Un salon qui prend du caractère avec la couleur",
    excerpt: "Fauteuils capitonnés, plafond lumineux et murs gris : un ensemble cohérent.",
  },
  {
    id: 7,
    slug: "7",
    image: "dressing-eclaire",
    category: "Inspirations",
    title: "Dressing : répartir penderies, tiroirs et étagères",
    excerpt: "Organiser l'espace selon ce que vous rangez réellement.",
  },
  {
    id: 8,
    slug: "8",
    image: "chantier-mur",
    category: "Chantiers",
    title: "Pose d'un habillage mural en grande hauteur",
    excerpt: "Installer un grand panneau mural sur échafaudage, avec son éclairage intégré.",
  },
];

export type ServiceData = {
  title: string;
  subtitle: string;
  image: string;
  longDesc: string;
  items: string[];
};

export const SERVICES: ServiceData[] = [
  {
    title: "Conception d'intérieur",
    subtitle: "Plans, matériaux, ambiances",
    image: "salon-bleu",
    longDesc:
      "Relevé, plans d'implantation, choix des matériaux, des couleurs et de l'éclairage. Votre projet est dessiné et validé avant le moindre travail.",
    items: ["Relevé et plans", "Implantation et circulation", "Matériaux et couleurs", "Plan d'éclairage"],
  },
  {
    title: "Cuisines sur mesure",
    subtitle: "Meubles, îlots, plans de travail",
    image: "cuisine-marbre",
    longDesc:
      "Meubles hauts et bas, îlots, bars, plans de travail et crédences, avec intégration des appareils et éclairage de meuble.",
    items: ["Îlots et bars", "Plans de travail et crédences", "Intégration des appareils", "Éclairage de meuble"],
  },
  {
    title: "Dressings & rangements",
    subtitle: "Penderies, tiroirs, LED",
    image: "dressing-eclaire",
    longDesc:
      "Dressings ouverts ou fermés, penderies, tiroirs et étagères pensés pour ce que vous rangez, avec éclairage intégré.",
    items: ["Penderies et tiroirs", "Étagères sur mesure", "Éclairage LED intégré", "Portes et finitions"],
  },
  {
    title: "Murs TV & habillage",
    subtitle: "Lamelles, panneaux, niches",
    image: "tv-marbre",
    longDesc: "Lamelles, panneaux effet marbre ou laqués, niches et meubles suspendus avec éclairage indirect.",
    items: ["Lamelles et panneaux", "Meubles suspendus", "Niches éclairées", "Passage des câbles"],
  },
  {
    title: "Salles de bain",
    subtitle: "Revêtements, vasques, accessoires",
    image: "salle-de-bain",
    longDesc:
      "Revêtements muraux, vasques, miroirs et accessoires assortis pour une salle de bain cohérente jusque dans les détails.",
    items: ["Revêtements muraux", "Vasques et miroirs", "Accessoires assortis", "Éclairage"],
  },
  {
    title: "Suivi de chantier",
    subtitle: "Coordination et livraison",
    image: "chantier-mur",
    longDesc:
      "Coordination des intervenants, respect du calendrier et contrôle de chaque finition jusqu'à la remise du projet.",
    items: ["Coordination des métiers", "Calendrier de chantier", "Contrôle des finitions", "Livraison et réglages"],
  },
];

export type MethodStepData = {
  title: string;
  longDesc: string;
  image: string;
};

export const METHOD_STEPS: MethodStepData[] = [
  {
    title: "Écoute & visite",
    longDesc:
      "Nous venons sur place, écoutons votre besoin, observons la lumière et prenons toutes les mesures.",
    image: "cuisine-cadre",
  },
  {
    title: "Conception & devis",
    longDesc: "Plans, choix des matériaux et chiffrage détaillé. Rien ne démarre sans votre validation.",
    image: "tv-gris",
  },
  {
    title: "Fabrication & pose",
    longDesc: "Le mobilier est réalisé sur mesure puis installé sur chantier par notre équipe.",
    image: "chantier-cuisine",
  },
  {
    title: "Finitions & livraison",
    longDesc: "Éclairage, réglages, contrôle de chaque détail : nous vous remettons un intérieur prêt à vivre.",
    image: "cuisine-cannele",
  },
];

export type HeroSlideData = {
  image: string;
  alt: string;
  caption: string;
};

export const HERO_SLIDES: HeroSlideData[] = [
  {
    image: "cuisine-marbre",
    alt: "Cuisine blanche avec îlot en marbre et suspensions dorées",
    caption: "Cuisine, îlot en marbre",
  },
  {
    image: "tv-noir",
    alt: "Mur TV en lamelles noires avec panneau laqué blanc",
    caption: "Mur TV, lamelles noires",
  },
  {
    image: "cuisine-niche",
    alt: "Colonnes de cuisine blanches avec niche en bois éclairée",
    caption: "Colonnes et niche en bois",
  },
];

export const FAQS: { question: string; answer: string }[] = [
  {
    question: "Intervenez-vous sur une seule pièce ?",
    answer: "Oui. Nous réalisons aussi bien un meuble TV ou un dressing seul qu'un aménagement complet de maison.",
  },
  {
    question: "Comment se passe le premier rendez-vous ?",
    answer:
      "Nous venons sur place pour comprendre votre besoin, prendre les mesures et voir la lumière de la pièce. Le devis est établi ensuite.",
  },
  {
    question: "Fabriquez-vous vous-mêmes le mobilier ?",
    answer:
      "Le mobilier est réalisé sur mesure par notre équipe, puis posé sur chantier. [À CONFIRMER PAR LE CLIENT]",
  },
  {
    question: "Quels sont les délais ?",
    answer:
      "Ils dépendent de la taille du projet et des matériaux choisis. Nous les fixons avec vous au moment du devis. [DÉLAIS INDICATIFS À COMPLÉTER]",
  },
];

export function pad(n: number): string {
  return (n < 10 ? "0" : "") + n;
}
