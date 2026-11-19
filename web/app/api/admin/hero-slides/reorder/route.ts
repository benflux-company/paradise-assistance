import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({ ids: z.array(z.string()).min(1) });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  await prisma.$transaction(parsed.data.ids.map((id, i) => prisma.heroSlide.update({ where: { id }, data: { order: i } })));
  return NextResponse.json({ ok: true });
}
