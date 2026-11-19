import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const STATUSES = ["NOUVEAU", "EN_COURS", "TRAITE", "ARCHIVE"] as const;

const schema = z.object({
  status: z.enum(STATUSES).optional(),
  note: z.string().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  const request_ = await prisma.contactRequest.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ request: request_ });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.contactRequest.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
