import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { CONTENT_FIELDS } from "@/lib/siteContent";

const VALID_KEYS = new Set(CONTENT_FIELDS.map((f) => f.key));

const schema = z.record(z.string(), z.string());

export async function PATCH(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });

  const entries = Object.entries(parsed.data).filter(([key]) => VALID_KEYS.has(key));
  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.siteContent.upsert({ where: { key }, update: { value }, create: { key, value } })
    )
  );

  return NextResponse.json({ ok: true });
}
