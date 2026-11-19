import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({ title: z.string().min(1), description: z.string().min(1), image: z.string().min(1) });

export async function GET() {
  const steps = await prisma.methodStep.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ steps });
}

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  const maxOrder = await prisma.methodStep.aggregate({ _max: { order: true } });
  const step = await prisma.methodStep.create({ data: { ...parsed.data, order: (maxOrder._max.order ?? -1) + 1 } });
  return NextResponse.json({ step }, { status: 201 });
}
