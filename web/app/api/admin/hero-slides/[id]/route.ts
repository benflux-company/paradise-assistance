import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  image: z.string().min(1).optional(),
  video: z.string().optional().nullable(),
  alt: z.string().min(1).optional(),
  caption: z.string().min(1).optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  const data = { ...parsed.data, video: parsed.data.video || null };
  const slide = await prisma.heroSlide.update({ where: { id }, data });
  return NextResponse.json({ slide });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.heroSlide.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
