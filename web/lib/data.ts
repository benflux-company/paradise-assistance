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
  content: string;
};

export const POSTS: PostData[] = [
  {
    id: 1,
    slug: "1",
    image: "tv-noir",
    category: "Conseils",
    title: "Mur TV en lamelles : comment il se construit",
    excerpt: "De l'ossature aux lamelles, en passant par le panneau laqué et l'éclairage LED : les étapes d'un mur TV sur mesure.",
    content: `Le mur TV en lamelles est devenu l'une des demandes les plus fréquentes sur nos chantiers à Kinshasa. Il transforme un salon en quelques jours, sans travaux lourds, et donne une allure nettement plus actuelle qu'un simple meuble bas.

## Une ossature avant tout

Tout commence par la prise de mesures sur le mur réel, jamais sur un plan théorique : les murs ne sont presque jamais parfaitement d'équerre, et un habillage en lamelles le révèle immédiatement si l'ossature n'a pas été ajustée en conséquence. Nous posons d'abord une structure en bois ou en métal, fixée au mur porteur, qui reçoit ensuite le panneau de fond et les lamelles elles-mêmes.

Cette ossature sert aussi à dissimuler l'ensemble des câbles : alimentation de la télévision, prise pour une console, câble d'une barre de son. Rien ne doit courir apparent une fois le meuble posé.

## La découpe et la pose des lamelles

Les lamelles sont découpées sur mesure, à l'épaisseur et à l'espacement choisis avec le client. Un espacement resserré donne un rendu plus dense et plus sombre ; un espacement plus large laisse davantage respirer le panneau de fond, souvent plus clair ou doré. C'est un choix esthétique qui change complètement le caractère de la pièce.

Chaque lamelle est poncée et vérifiée avant la pose finale, puis fixée une à une sur l'ossature avec un alignement vertical contrôlé au laser pour éviter tout décalage visible, même minime.

## La niche pour la télévision et l'éclairage

Au centre, une niche plus profonde reçoit l'écran, souvent en léger retrait pour que le mur TV ne soit pas un simple fond plat. C'est à cette étape que l'éclairage LED est intégré : un ruban discret, caché dans une gorge entre les lamelles ou derrière le panneau, qui éclaire le mur sans jamais être visible directement.

## La finition

Vient enfin la teinte ou le laqué, appliqués en plusieurs couches avec ponçage intermédiaire. C'est cette dernière étape qui donne au mur TV son aspect fini : un panneau qui semble avoir toujours fait partie de la pièce, pas un meuble rapporté.

Du premier relevé de cotes à la pose des lamelles, un mur TV sur mesure se construit en une à deux semaines selon sa taille. C'est un chantier technique mais rapide, et c'est souvent la pièce qui change le plus visiblement un salon.`,
  },
  {
    id: 2,
    slug: "2",
    image: "cuisine-marbre",
    category: "Conseils",
    title: "Laqué brillant ou mat : quelle finition choisir ?",
    excerpt: "Les critères pour trancher selon l'usage, la lumière et l'entretien.",
    content: `C'est l'une des premières questions que nous posons à chaque nouveau projet de cuisine ou de mur TV : brillant ou mat ? Le choix paraît purement esthétique, mais il a des conséquences très concrètes sur l'entretien et sur l'ambiance de la pièce.

## Le laqué brillant

Le brillant réfléchit la lumière, ce qui agrandit visuellement un espace et le rend plus lumineux, même avec un éclairage naturel limité. C'est un choix que nous recommandons souvent pour les cuisines orientées vers l'intérieur de la maison, sans grande baie vitrée.

Son revers : chaque trace de doigt, chaque projection de graisse se voit immédiatement. Une cuisine en laqué brillant demande un nettoyage plus fréquent, surtout sur les façades proches de la plaque de cuisson et autour des poignées. C'est une finition qui reste impeccable à condition d'accepter cet entretien régulier.

## Le laqué mat

Le mat absorbe la lumière plutôt que de la réfléchir, pour un rendu plus sobre et plus feutré. C'est la finition que choisissent la majorité de nos clients pour les murs TV et les dressings, où l'effet recherché est une ambiance posée plutôt qu'un effet miroir.

Le mat masque beaucoup mieux les traces de doigts au quotidien, ce qui en fait un choix pratique pour les meubles très manipulés : poignées de tiroirs, portes de placard, façades basses à hauteur d'enfant. En revanche, une rayure ou un choc reste plus visible sur une surface mate, qui ne la dissimule pas dans un reflet.

## Et si on combinait les deux ?

C'est une solution que nous proposons de plus en plus : un plan de travail ou un îlot en finition mate, pour l'usage quotidien, associé à des façades hautes ou des niches en brillant, pour capter la lumière sans multiplier les surfaces à essuyer plusieurs fois par jour.

## Notre recommandation

Pour une cuisine très utilisée, avec enfants ou personnel de maison, le mat reste le choix le plus pratique sur la durée. Pour un salon ou un mur TV, davantage décoratif et moins manipulé, le brillant apporte un effet plus spectaculaire, notamment sous un éclairage LED intégré qui accroche la lumière sur la laque.

Le bon choix dépend toujours de l'usage réel de la pièce, pas uniquement du rendu sur une photo d'inspiration. C'est la première question que nous posons avant de passer à la conception.`,
  },
  {
    id: 3,
    slug: "3",
    image: "dressing-led",
    category: "Conseils",
    title: "L'éclairage LED intégré au meuble : où le placer",
    excerpt: "Sous étagère, en montant vertical ou en niche : la lumière qui sert vraiment.",
    content: `Un ruban LED mal placé n'éclaire rien d'utile ; bien placé, il peut remplacer une partie de l'éclairage général de la pièce. Voici comment nous choisissons son emplacement selon le meuble.

## Sous les étagères hautes, pour le plan de travail

Dans une cuisine, l'éclairage le plus utile n'est pas au plafond mais sous les meubles hauts, juste au-dessus du plan de travail. C'est la zone où l'on coupe, où l'on cuisine, et c'est justement celle que l'ombre du corps masque le plus facilement avec un éclairage venu du plafond. Un ruban LED discret, fixé sous la caisse du meuble haut, règle ce problème en une seule ligne de lumière.

## En montant vertical, pour les colonnes et niches

Dans un dressing ou une bibliothèque, un ruban LED posé verticalement le long d'une colonne crée un repère lumineux qui structure l'ensemble du meuble. C'est aussi la solution que nous utilisons pour mettre en valeur une niche décorative : un objet, une statuette, une bouteille de collection, éclairés latéralement prennent un relief qu'un éclairage de plafond ne donne jamais.

## En gorge, pour les murs TV et les plans de travail en îlot

Sur un mur TV en lamelles, le ruban se cache dans une gorge creusée entre deux éléments, souvent juste derrière le panneau de fond. La lumière rebondit sur le mur plutôt que d'éclairer directement l'œil, pour un effet d'ambiance plus que d'éclairage fonctionnel.

Sur un îlot de cuisine, la même technique s'applique sous le plan de travail en porte-à-faux, pour souligner la ligne du marbre ou du bois sans ajouter un spot visible.

## Les erreurs à éviter

La plus fréquente : un ruban posé en applique, visible depuis l'angle normal de vue, qui éblouit au lieu d'éclairer. Un bon éclairage LED intégré ne se voit jamais directement, seul son effet sur la matière est visible.

La seconde erreur : une seule teinte de blanc pour tout le logement. Un blanc chaud (autour de 2700-3000K) convient aux salons et chambres, un blanc plus neutre (4000K) aux cuisines et salles de bain, où l'on a besoin d'y voir clair pour travailler.

## En résumé

L'éclairage LED intégré fonctionne quand il répond à un besoin précis : voir son plan de travail, structurer un dressing, ou mettre en valeur une niche. C'est un choix qui se fait au moment de la conception du meuble, pas en ajout après coup.`,
  },
  {
    id: 4,
    slug: "4",
    image: "chantier-blanche",
    category: "Chantiers",
    title: "Une cuisine blanche en cours de pose",
    excerpt: "Les caissons sont posés, les façades arrivent : ce qui se passe avant la finition.",
    content: `Entre la livraison des meubles et la remise des clés, il y a toujours cette phase intermédiaire où la cuisine ressemble encore à un chantier : caissons nus, façades en attente, plan de travail pas encore posé. Voici ce qui se joue réellement à cette étape.

## La pose des caissons, en premier

Les caissons (les structures des meubles, sans les façades) sont posés et fixés en premier, au mur et entre eux, avant toute autre étape. C'est le moment où l'on vérifie que chaque meuble est parfaitement de niveau, car une erreur ici se répercute sur tout le reste : façades mal alignées, tiroirs qui coincent, plan de travail qui ne repose pas uniformément.

Les caissons de cette cuisine ont été posés en blanc, un choix qui simplifie l'association avec n'importe quelle façade ou poignée par la suite, et qui reste la teinte la plus demandée pour une cuisine ouverte sur le salon.

## Le passage des réseaux avant fermeture

Avant de poser le plan de travail et les façades définitives, c'est aussi la dernière occasion d'ajuster l'arrivée d'eau, l'évacuation et les prises électriques derrière les futurs appareils encastrés (four, four micro-ondes, réfrigérateur). Une fois les caissons fermés, toute modification devient beaucoup plus complexe.

## Ce qui reste à faire

Après cette étape, viennent dans l'ordre : la pose du plan de travail (marbre, quartz ou stratifié selon le choix retenu), puis les façades, les poignées, et enfin les appareils électroménagers encastrables. L'éclairage intégré, lorsqu'il y en a, est câblé avant la fermeture définitive des meubles hauts.

## Pourquoi montrer ce chantier

Nous partageons volontiers ces photos de cuisines en cours de pose, parce qu'elles montrent la partie invisible du travail : celle qui ne se voit plus une fois la cuisine terminée, mais qui conditionne sa solidité et son confort d'usage pendant des années. Une cuisine bien posée se juge autant à ce qui est caché derrière les façades qu'à ce qui se voit en façade.`,
  },
  {
    id: 5,
    slug: "5",
    image: "cuisine-cannele",
    category: "Conseils",
    title: "Marbre, quartz ou stratifié : quel plan de travail ?",
    excerpt: "Entretien, résistance à la chaleur et budget, comparés point par point.",
    content: `Le plan de travail est l'élément le plus sollicité d'une cuisine : chaleur, coupures, eau, produits d'entretien. C'est aussi celui qui pèse le plus sur le budget. Voici comment nous aidons nos clients à choisir entre marbre, quartz et stratifié.

## Le marbre

Le marbre reste la matière la plus demandée pour les îlots que nous réalisons, pour son veinage naturel, unique sur chaque plan posé, et son effet haut de gamme immédiatement reconnaissable. C'est une pierre naturelle poreuse : elle demande un traitement hydrofuge à la pose, puis un entretien régulier pour éviter les taches, notamment avec le citron, le vin ou l'huile qui peuvent marquer la surface si elle n'est pas essuyée rapidement.

Côté chaleur, le marbre résiste bien à un contact bref, mais nous recommandons toujours un dessous-de-plat pour une casserole posée longtemps. C'est le choix que nous conseillons pour un îlot central, pièce maîtresse visuelle de la cuisine, plus que pour un plan de cuisson très intensif.

## Le quartz

Le quartz est une pierre reconstituée : elle combine un veinage qui peut imiter le marbre avec une résistance supérieure, puisqu'elle est non poreuse et ne demande aucun traitement. C'est le compromis que nous recommandons le plus souvent pour un usage quotidien intensif, sans les contraintes d'entretien de la pierre naturelle.

Sa résistance à la chaleur est bonne mais pas totale : comme le marbre, un contact direct et prolongé avec une source très chaude peut provoquer un choc thermique localisé.

## Le stratifié

Le stratifié est l'option la plus économique et la plus simple d'entretien au quotidien : un panneau mélaminé qui peut imiter le bois, la pierre ou une teinte unie, résistant à l'eau et facile à nettoyer avec un simple chiffon. Sa limite est sa résistance au contact direct d'une source de chaleur (poser une casserole chaude peut le marquer de façon irréversible) et aux chocs profonds, qui peuvent écailler la surface.

C'est le choix que nous proposons pour les cuisines secondaires, les budgets plus serrés, ou les projets où la priorité va ailleurs (façades, éclairage, rangement) plutôt qu'au plan de travail.

## Notre recommandation

Pour un îlot visible depuis le salon, qui doit marquer la pièce : le marbre. Pour une cuisine à l'usage quotidien intensif, sans compromis sur la résistance : le quartz. Pour optimiser un budget sans sacrifier l'allure générale : le stratifié, en misant le reste du budget sur les façades et l'éclairage.`,
  },
  {
    id: 6,
    slug: "6",
    image: "salon-bleu",
    category: "Inspirations",
    title: "Un salon qui prend du caractère avec la couleur",
    excerpt: "Fauteuils capitonnés, plafond lumineux et murs gris : un ensemble cohérent.",
    content: `Un salon tout en blanc ou en beige est une valeur sûre, mais c'est aussi le choix qui marque le moins. Ce projet montre comment une palette resserrée autour du bleu nuit et du gris transforme un salon sans le charger.

## Partir d'une seule couleur forte

La règle que nous suivons presque systématiquement : une seule couleur forte, déclinée sur deux ou trois éléments maximum, jamais répétée sur tous les murs. Ici, le bleu nuit habille la tête de lit capitonnée et quelques coussins, pendant que les murs restent dans un gris clair neutre qui laisse la couleur forte respirer sans écraser la pièce.

Cette retenue est ce qui distingue un salon coloré réussi d'un salon surchargé : la couleur devient un point focal, pas un fond uniforme.

## Le capitonnage, pour la texture

Le capitonnage (ce matelassage en relief, piqué de boutons ou de plis réguliers) ajoute une texture que la couleur seule ne donne pas. Sur une tête de lit ou un fauteuil, il capte la lumière différemment selon l'angle, ce qui donne du mouvement à une surface qui resterait plate en tissu uni.

## Le plafond, souvent oublié

Le plafond est la cinquième surface d'une pièce, et c'est pourtant la plus souvent négligée. Un éclairage intégré au plafond, en corniche ou en caisson lumineux, change radicalement l'ambiance du soir sans ajouter un seul lampadaire au sol. C'est un traitement que nous intégrons de plus en plus systématiquement dans nos salons et chambres, en complément de l'éclairage mural.

## Les meubles sur mesure, pour fermer l'ensemble

Une bibliothèque ou un meuble bas réalisé sur mesure, dans une teinte qui reprend un élément de la pièce (ici un vert profond en contrepoint du bleu), termine l'ensemble sans avoir l'air rapporté après coup. C'est la différence entre un salon meublé et un salon conçu comme un tout cohérent.

## Ce qu'il faut retenir

Une couleur forte, limitée à deux ou trois éléments ; un fond neutre qui la met en valeur ; un plafond traité comme une pièce à part entière ; et du mobilier sur mesure qui referme la composition. C'est cette méthode, plus que la couleur choisie elle-même, qui donne du caractère à un salon.`,
  },
  {
    id: 7,
    slug: "7",
    image: "dressing-eclaire",
    category: "Inspirations",
    title: "Dressing : répartir penderies, tiroirs et étagères",
    excerpt: "Organiser l'espace selon ce que vous rangez réellement.",
    content: `La première question que nous posons avant de dessiner un dressing n'est jamais une question de style, mais une question d'inventaire : qu'est-ce qui doit être rangé, et en quelle quantité ? Un dressing réussi part toujours de cette réponse, avant même de choisir une couleur de façade.

## La penderie, pour ce qui se porte plié sur un cintre

Les vêtements longs (robes, manteaux, costumes) demandent une penderie haute, sans étagère au-dessus sur au moins 140 cm. Les vêtements courts (chemises, vestes) se contentent d'une penderie basse, ce qui libère un espace de rangement complémentaire juste en dessous ou au-dessus.

Une erreur fréquente est de prévoir une seule hauteur de penderie pour tout le dressing : la moitié de l'espace est alors perdue en vide au-dessus des vêtements courts.

## Les tiroirs, pour ce qui se plie

Le linge de maison, les t-shirts, les sous-vêtements et les accessoires trouvent naturellement leur place en tiroirs plutôt qu'en penderie. Nous recommandons des tiroirs de profondeurs différentes selon leur contenu : peu profonds pour les accessoires (ceintures, bijoux, montres), plus profonds pour le linge plié.

Un tiroir à fond vitré ou à séparateurs amovibles, de plus en plus demandé, permet de garder une vue d'ensemble sans avoir à fouiller.

## Les étagères, pour ce qui se range à plat ou debout

Chaussures, sacs, piles de linge : les étagères ouvertes conviennent à ce qui se range debout ou empilé, visible en un coup d'œil. C'est aussi l'endroit naturel pour une vitrine rétroéclairée, qui met en valeur quelques pièces choisies (sacs, chaussures, accessoires) comme on exposerait un objet.

## L'éclairage, dernier arbitrage

Un dressing bien pensé intègre son éclairage dans la conception du meuble, pas en ajout après coup : un ruban LED vertical sur une colonne, ou une vitrine éclairée, suffisent à transformer un simple rangement en une pièce où l'on prend plaisir à choisir sa tenue le matin.

## Notre méthode

Nous commençons toujours par faire l'inventaire réel de ce qui doit être rangé avec chaque client, pièce par pièce si nécessaire, avant de dessiner la répartition entre penderies, tiroirs et étagères. C'est cette étape, invisible une fois le dressing terminé, qui fait la différence entre un meuble qui s'adapte à vos vêtements et un meuble auquel il faut adapter ses vêtements.`,
  },
  {
    id: 8,
    slug: "8",
    image: "chantier-mur",
    category: "Chantiers",
    title: "Pose d'un habillage mural en grande hauteur",
    excerpt: "Installer un grand panneau mural sur échafaudage, avec son éclairage intégré.",
    content: `Certains habillages muraux dépassent largement la hauteur d'un mur TV classique : façade extérieure, double hauteur sous plafond, grand mur de réception. Ces chantiers demandent une méthode différente, que nous suivons pas à pas sur ce projet.

## L'échafaudage, une étape à part entière

Au-delà de deux mètres cinquante, la pose à la main depuis le sol devient imprécise et dangereuse. Nous montons un échafaudage adapté à la hauteur du mur, qui permet de travailler à hauteur constante sur toute la surface plutôt que de multiplier les escabeaux déplacés en cours de pose. C'est une contrainte de planning (le montage et le démontage prennent du temps) mais c'est la seule façon de garantir un alignement parfait sur une grande hauteur.

## Le calepinage avant la découpe

Sur un grand panneau, la moindre erreur de calepinage (la répartition des lames ou des panneaux sur la largeur et la hauteur du mur) se voit immédiatement, en particulier si le mur est visible depuis plusieurs angles. Nous dessinons systématiquement le calepinage complet avant toute découpe, pour vérifier que les raccords tombent à des endroits discrets (angles, changements de plan) plutôt qu'au centre visuel du mur.

## La fixation, pensée pour la hauteur

Un panneau en grande hauteur subit des contraintes différentes d'un panneau standard : poids cumulé plus important, risque de flexion si la fixation est insuffisante en partie haute. Nous renforçons systématiquement les points de fixation dans le tiers supérieur du mur, invisibles une fois la pose terminée mais déterminants pour la tenue dans la durée.

## L'éclairage intégré, câblé avant la fermeture

Comme pour un mur TV classique, l'éclairage LED est câblé avant la pose finale des panneaux, avec un soin particulier sur un mur en grande hauteur : le câblage doit être accessible en cas de maintenance future sans démonter l'ensemble du mur, ce qui impose de prévoir des trappes ou des jonctions démontables dès la conception.

## Ce que ce chantier montre

Un habillage mural en grande hauteur n'est pas qu'une version agrandie d'un mur TV standard : c'est un chantier qui demande son propre planning, son propre échafaudage, et une préparation du calepinage plus rigoureuse encore que sur un mur de taille courante. C'est ce soin en amont qui garantit un résultat net, sans raccord visible, une fois l'échafaudage retiré.`,
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
