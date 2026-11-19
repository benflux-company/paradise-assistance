import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const CATEGORIES = ["CUISINES", "MURS_TV", "DRESSINGS", "SALONS", "SALLES_DE_BAIN"] as const;

const createSchema = z.object({
  title: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Le slug ne doit contenir que des lettres minuscules, chiffres et tirets."),
  category: z.enum(CATEGORIES),
  shortDesc: z.string().min(1),
  longDesc: z.string().min(1),
  featured: z.boolean().optional(),
  wide: z.boolean().optional(),
  published: z.boolean().optional(),
});

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
    include: { images: { orderBy: { order: "asc" } } },
  });
  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides." }, { status: 400 });
  }

  const existing = await prisma.project.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "Ce slug est déjà utilisé par une autre réalisation." }, { status: 409 });
  }

  const maxOrder = await prisma.project.aggregate({ _max: { order: true } });
  const project = await prisma.project.create({
    data: {
      ...parsed.data,
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });

  return NextResponse.json({ project }, { status: 201 });
}
