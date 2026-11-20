import { PrismaClient, PostCategory } from "@prisma/client";
import bcrypt from "bcrypt";
import { POSTS, SERVICES, METHOD_STEPS, FAQS } from "../lib/data";
import { REAL_PROJECTS, REAL_HERO_SLIDES, REAL_INTRO_IMAGES, CLOUDINARY_PHOTO_BASE, CLOUDINARY_NAMED_BASE } from "./realProjects";

const prisma = new PrismaClient();
const photoUrl = (p: number | string) => (typeof p === "number" ? `${CLOUDINARY_PHOTO_BASE}${p}.jpg` : `${CLOUDINARY_NAMED_BASE}${p}.jpg`);

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
      phone: "+243 991 836 082, +227 78 555 6933",
      email: "contact@paradis-assistance.com",
      address: "Kinshasa, av. réf. IPG",
      hours: "Du lundi au vendredi de 07h30 à 17h00",
      contactEmail: "contact@paradis-assistance.com,jacquesdjulama7@gmail.com",
      budgetRanges: ["Moins de 500 $", "500 - 1 500 $", "1 500 - 5 000 $", "Plus de 5 000 $"],
      projectTypes: ["Cuisine", "Dressing", "Mur TV", "Salle de bain", "Salon", "Aménagement complet"],
      seoDefaultTitle: "Ets Paradis Assistance — Architecture d'intérieur",
      seoDefaultDesc:
        "Ets Paradis Assistance conçoit et réalise cuisines, dressings, murs TV et aménagements d'intérieur sur mesure.",
    },
  });

  console.log("Seed : images de la section « Le studio »…");
  await prisma.siteContent.upsert({
    where: { key: "intro_image_1" },
    update: { value: photoUrl(REAL_INTRO_IMAGES[0]) },
    create: { key: "intro_image_1", value: photoUrl(REAL_INTRO_IMAGES[0]) },
  });
  await prisma.siteContent.upsert({
    where: { key: "intro_image_2" },
    update: { value: photoUrl(REAL_INTRO_IMAGES[1]) },
    create: { key: "intro_image_2", value: photoUrl(REAL_INTRO_IMAGES[1]) },
  });

  console.log("Seed : diaporama du hero…");
  await prisma.heroSlide.deleteMany();
  for (const [i, s] of REAL_HERO_SLIDES.entries()) {
    await prisma.heroSlide.create({
      data: { image: photoUrl(s.photo), video: null, alt: s.alt, caption: s.caption, order: i },
    });
  }

  console.log("Seed : projets du portfolio (vraies réalisations)…");
  // Supprime tout projet qui ne fait plus partie de la liste réelle (ancien
  // contenu de démo, ou un projet retiré) — l'upsert par slug ci-dessous ne
  // supprime jamais, il ne fait que créer/mettre à jour.
  await prisma.project.deleteMany({ where: { slug: { notIn: REAL_PROJECTS.map((p) => p.slug) } } });
  for (const [i, p] of REAL_PROJECTS.entries()) {
    const project = await prisma.project.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        category: p.category,
        shortDesc: p.shortDesc,
        longDesc: p.longDesc,
        wide: p.wide,
        featured: p.featured,
        order: i,
      },
      create: {
        slug: p.slug,
        title: p.title,
        category: p.category,
        shortDesc: p.shortDesc,
        longDesc: p.longDesc,
        wide: p.wide,
        featured: p.featured,
        order: i,
      },
    });
    await prisma.projectImage.deleteMany({ where: { projectId: project.id } });
    for (const [j, photo] of p.photos.entries()) {
      await prisma.projectImage.create({
        data: {
          projectId: project.id,
          url: photoUrl(photo),
          alt: p.title,
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
