import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const CATEGORIES = ["CUISINES", "MURS_TV", "DRESSINGS", "SALONS", "SALLES_DE_BAIN"] as const;

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Le slug ne doit contenir que des lettres minuscules, chiffres et tirets.")
    .optional(),
  category: z.enum(CATEGORIES).optional(),
  shortDesc: z.string().min(1).optional(),
  longDesc: z.string().min(1).optional(),
  featured: z.boolean().optional(),
  wide: z.boolean().optional(),
  published: z.boolean().optional(),
});

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id }, include: { images: { orderBy: { order: "asc" } } } });
  if (!project) return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  return NextResponse.json({ project });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides." }, { status: 400 });
  }

  if (parsed.data.slug) {
    const existing = await prisma.project.findUnique({ where: { slug: parsed.data.slug } });
    if (existing && existing.id !== id) {
      return NextResponse.json({ error: "Ce slug est déjà utilisé par une autre réalisation." }, { status: 409 });
    }
  }

  const project = await prisma.project.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ project });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
