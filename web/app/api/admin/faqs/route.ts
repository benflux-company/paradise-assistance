import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({ question: z.string().min(1), answer: z.string().min(1) });

export async function GET() {
  const faqs = await prisma.faq.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ faqs });
}

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  const maxOrder = await prisma.faq.aggregate({ _max: { order: true } });
  const faq = await prisma.faq.create({ data: { ...parsed.data, order: (maxOrder._max.order ?? -1) + 1 } });
  return NextResponse.json({ faq }, { status: 201 });
}
