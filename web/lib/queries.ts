import { prisma } from "@/lib/prisma";
import type { ProjectCategory as PrismaProjectCategory, PostCategory as PrismaPostCategory } from "@prisma/client";

const PROJECT_CATEGORY_LABEL: Record<PrismaProjectCategory, string> = {
  CUISINES: "Cuisines",
  MURS_TV: "Murs TV",
  DRESSINGS: "Dressings",
  SALONS: "Salons",
  SALLES_DE_BAIN: "Salles de bain",
};

const POST_CATEGORY_LABEL: Record<PrismaPostCategory, string> = {
  CONSEILS: "Conseils",
  CHANTIERS: "Chantiers",
  INSPIRATIONS: "Inspirations",
};

export type ProjectView = {
  slug: string;
  title: string;
  category: string;
  shortDesc: string;
  longDesc: string;
  wide: boolean;
  alt: string;
  image: string;
  gallery: string[];
};

export type PostView = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
};

export type ServiceView = {
  title: string;
  subtitle: string;
  longDesc: string;
  items: string[];
  image: string;
};

export type MethodStepView = {
  title: string;
  longDesc: string;
  image: string;
};

export type HeroSlideView = {
  image: string;
  video: string | null;
  alt: string;
  caption: string;
};

export type FaqView = { question: string; answer: string };

export type SettingsView = {
  phone: string;
  email: string;
  address: string;
  hours: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  whatsapp: string;
  linkedin: string;
  budgetRanges: string[];
  projectTypes: string[];
  mapEmbed: string;
  contactEmail: string;
  seoDefaultTitle: string;
  seoDefaultDesc: string;
};

function projectView(p: {
  slug: string;
  title: string;
  category: PrismaProjectCategory;
  shortDesc: string;
  longDesc: string;
  wide: boolean;
  images: { url: string; alt: string; cover: boolean; order: number }[];
}): ProjectView {
  const gallery = [...p.images].sort((a, b) => a.order - b.order);
  const cover = gallery.find((i) => i.cover) ?? gallery[0];
  return {
    slug: p.slug,
    title: p.title,
    category: PROJECT_CATEGORY_LABEL[p.category],
    shortDesc: p.shortDesc,
    longDesc: p.longDesc,
    wide: p.wide,
    alt: cover?.alt ?? p.title,
    image: cover?.url ?? "",
    gallery: gallery.map((i) => i.url),
  };
}

function postView(b: {
  slug: string;
  title: string;
  category: PrismaPostCategory;
  excerpt: string;
  content: string;
  coverImage: string;
}): PostView {
  return {
    slug: b.slug,
    title: b.title,
    category: POST_CATEGORY_LABEL[b.category],
    excerpt: b.excerpt,
    content: b.content,
    image: b.coverImage,
  };
}

export async function getProjects(): Promise<ProjectView[]> {
  const rows = await prisma.project.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: { images: true },
  });
  return rows.map(projectView);
}

export async function getFeaturedProjects(): Promise<ProjectView[]> {
  const rows = await prisma.project.findMany({
    where: { published: true, featured: true },
    orderBy: { order: "asc" },
    include: { images: true },
  });
  return rows.map(projectView);
}

export async function getProjectBySlug(slug: string): Promise<ProjectView | null> {
  const row = await prisma.project.findUnique({ where: { slug }, include: { images: true } });
  return row ? projectView(row) : null;
}

export async function getPosts(): Promise<PostView[]> {
  const rows = await prisma.post.findMany({
    where: { published: true, featured: false },
    orderBy: { order: "asc" },
  });
  return rows.map(postView);
}

export async function getHomeBlogPreview(): Promise<PostView[]> {
  const rows = await prisma.post.findMany({
    where: { published: true, homeOrder: { not: null } },
    orderBy: { homeOrder: "asc" },
    take: 3,
  });
  return rows.map(postView);
}

export async function getFeaturedPost(): Promise<PostView | null> {
  const row = await prisma.post.findFirst({ where: { published: true, featured: true } });
  return row ? postView(row) : null;
}

export async function getPostBySlug(slug: string): Promise<PostView | null> {
  const row = await prisma.post.findUnique({ where: { slug } });
  return row ? postView(row) : null;
}

export async function getNextPost(currentSlug: string): Promise<PostView | null> {
  const rows = await prisma.post.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    select: { slug: true, title: true, category: true, excerpt: true, content: true, coverImage: true },
  });
  if (!rows.length) return null;
  const idx = rows.findIndex((r) => r.slug === currentSlug);
  const next = rows[(idx + 1) % rows.length];
  return postView(next);
}

export async function getServices(): Promise<ServiceView[]> {
  const rows = await prisma.service.findMany({ orderBy: { order: "asc" } });
  return rows.map((s) => ({ title: s.title, subtitle: s.subtitle, longDesc: s.description, items: s.items, image: s.image }));
}

export async function getMethodSteps(): Promise<MethodStepView[]> {
  const rows = await prisma.methodStep.findMany({ orderBy: { order: "asc" } });
  return rows.map((s) => ({ title: s.title, longDesc: s.description, image: s.image }));
}

export async function getHeroSlides(): Promise<HeroSlideView[]> {
  const rows = await prisma.heroSlide.findMany({ orderBy: { order: "asc" } });
  return rows.map((s) => ({ image: s.image, video: s.video, alt: s.alt, caption: s.caption }));
}

export async function getFaqs(): Promise<FaqView[]> {
  const rows = await prisma.faq.findMany({ orderBy: { order: "asc" } });
  return rows.map((f) => ({ question: f.question, answer: f.answer }));
}

export async function getSettings(): Promise<SettingsView> {
  const row = await prisma.settings.findUnique({ where: { id: "settings" } });
  return {
    phone: row?.phone ?? "",
    email: row?.email ?? "",
    address: row?.address ?? "",
    hours: row?.hours ?? "",
    facebook: row?.facebook ?? "",
    instagram: row?.instagram ?? "",
    tiktok: row?.tiktok ?? "",
    whatsapp: row?.whatsapp ?? "",
    linkedin: row?.linkedin ?? "",
    budgetRanges: row?.budgetRanges ?? [],
    projectTypes: row?.projectTypes ?? [],
    mapEmbed: row?.mapEmbed ?? "",
    contactEmail: row?.contactEmail ?? "",
    seoDefaultTitle: row?.seoDefaultTitle ?? "",
    seoDefaultDesc: row?.seoDefaultDesc ?? "",
  };
}
