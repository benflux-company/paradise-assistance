import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const CATEGORIES = ["CONSEILS", "CHANTIERS", "INSPIRATIONS"] as const;

const createSchema = z.object({
  title: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Le slug ne doit contenir que des lettres minuscules, chiffres et tirets."),
  category: z.enum(CATEGORIES),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  coverImage: z.string().min(1),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

export async function GET() {
  const posts = await prisma.post.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides." }, { status: 400 });
  }

  const existing = await prisma.post.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return NextResponse.json({ error: "Ce slug est déjà utilisé par un autre article." }, { status: 409 });

  const maxOrder = await prisma.post.aggregate({ _max: { order: true } });
  const post = await prisma.post.create({ data: { ...parsed.data, order: (maxOrder._max.order ?? -1) + 1 } });
  return NextResponse.json({ post }, { status: 201 });
}
