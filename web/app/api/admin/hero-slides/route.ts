import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  image: z.string().min(1),
  video: z.string().optional().nullable(),
  alt: z.string().min(1),
  caption: z.string().min(1),
});

export async function GET() {
  const slides = await prisma.heroSlide.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ slides });
}

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  const maxOrder = await prisma.heroSlide.aggregate({ _max: { order: true } });
  const slide = await prisma.heroSlide.create({
    data: { ...parsed.data, video: parsed.data.video || null, order: (maxOrder._max.order ?? -1) + 1 },
  });
  return NextResponse.json({ slide }, { status: 201 });
}
