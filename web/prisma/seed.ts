import { PrismaClient, ProjectCategory, PostCategory } from "@prisma/client";
import bcrypt from "bcrypt";
import { PROJECTS, POSTS, SERVICES, METHOD_STEPS, HERO_SLIDES, FAQS } from "../lib/data";

const prisma = new PrismaClient();

const PROJECT_CATEGORY_MAP: Record<string, ProjectCategory> = {
  Cuisines: ProjectCategory.CUISINES,
  "Murs TV": ProjectCategory.MURS_TV,
  Dressings: ProjectCategory.DRESSINGS,
  Salons: ProjectCategory.SALONS,
  "Salles de bain": ProjectCategory.SALLES_DE_BAIN,
};

const POST_CATEGORY_MAP: Record<string, PostCategory> = {
  Conseils: PostCategory.CONSEILS,
  Chantiers: PostCategory.CHANTIERS,
  Inspirations: PostCategory.INSPIRATIONS,
};

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL et ADMIN_PASSWORD doivent être définis dans l'environnement pour lancer le seed.");
  }

  console.log("Seed : compte administrateur…");
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, name: "Administrateur", passwordHash },
  });

  console.log("Seed : paramètres du site…");
  await prisma.settings.upsert({
    where: { id: "settings" },
    update: {},
    create: {
      id: "settings",
      budgetRanges: ["[TRANCHE 1]", "[TRANCHE 2]", "[TRANCHE 3]", "À définir"],
      projectTypes: ["Cuisine", "Dressing", "Mur TV", "Salle de bain", "Salon", "Aménagement complet"],
      seoDefaultTitle: "Ets Paradise Assistance — Architecture d'intérieur",
      seoDefaultDesc:
        "Ets Paradise Assistance conçoit et réalise cuisines, dressings, murs TV et aménagements d'intérieur sur mesure.",
    },
  });

  console.log("Seed : diaporama du hero…");
  await prisma.heroSlide.deleteMany();
  for (const [i, s] of HERO_SLIDES.entries()) {
    await prisma.heroSlide.create({
      data: { image: `/img/${s.image}.jpg`, alt: s.alt, caption: s.caption, order: i },
    });
  }

  console.log("Seed : projets du portfolio…");
  // Les 7 premiers projets (même ordre que l'ancien carrousel horizontal de
  // l'accueil) sont marqués "mis en avant" pour peupler ce carrousel.
  for (const [i, p] of PROJECTS.entries()) {
    const project = await prisma.project.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        category: PROJECT_CATEGORY_MAP[p.category],
        shortDesc: p.shortDesc,
        longDesc: p.longDesc,
        wide: !!p.wide,
        featured: i < 7,
        order: i,
      },
      create: {
        slug: p.slug,
        title: p.title,
        category: PROJECT_CATEGORY_MAP[p.category],
        shortDesc: p.shortDesc,
        longDesc: p.longDesc,
        wide: !!p.wide,
        featured: i < 7,
        order: i,
      },
    });
    await prisma.projectImage.deleteMany({ where: { projectId: project.id } });
    for (const [j, image] of p.gallery.entries()) {
      await prisma.projectImage.create({
        data: {
          projectId: project.id,
          url: `/img/${image}.jpg`,
          alt: p.alt,
          order: j,
          cover: j === 0,
        },
      });
    }
  }

  console.log("Seed : articles du journal…");
  // `order` reprend l'ordre du tableau d'origine (pour la grille du blog et
  // le cycle "article suivant"). `homeOrder` reproduit la sélection
  // spécifique de l'aperçu sur l'accueil (id 4, puis 2, puis 3).
  const homePreviewOrder: Record<number, number> = { 4: 0, 2: 1, 3: 2 };
  for (const [i, b] of POSTS.entries()) {
    const homeOrder = homePreviewOrder[b.id] ?? null;
    await prisma.post.upsert({
      where: { slug: b.slug },
      update: {
        title: b.title,
        category: POST_CATEGORY_MAP[b.category],
        excerpt: b.excerpt,
        coverImage: `/img/${b.image}.jpg`,
        featured: b.id === 1,
        order: i,
        homeOrder,
      },
      create: {
        slug: b.slug,
        title: b.title,
        category: POST_CATEGORY_MAP[b.category],
        excerpt: b.excerpt,
        content: "",
        coverImage: `/img/${b.image}.jpg`,
        featured: b.id === 1,
        order: i,
        homeOrder,
      },
    });
  }

  console.log("Seed : services…");
  await prisma.service.deleteMany();
  for (const [i, s] of SERVICES.entries()) {
    await prisma.service.create({
      data: {
        title: s.title,
        subtitle: s.subtitle,
        description: s.longDesc,
        items: s.items,
        image: `/img/${s.image}.jpg`,
        order: i,
      },
    });
  }

  console.log("Seed : étapes de la méthode…");
  await prisma.methodStep.deleteMany();
  for (const [i, s] of METHOD_STEPS.entries()) {
    await prisma.methodStep.create({
      data: { title: s.title, description: s.longDesc, image: `/img/${s.image}.jpg`, order: i },
    });
  }

  console.log("Seed : FAQ…");
  await prisma.faq.deleteMany();
  for (const [i, f] of FAQS.entries()) {
    await prisma.faq.create({ data: { question: f.question, answer: f.answer, order: i } });
  }

  console.log("Seed terminé.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
