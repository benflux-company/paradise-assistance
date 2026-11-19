import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  phone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  hours: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  whatsapp: z.string().optional(),
  linkedin: z.string().optional(),
  budgetRanges: z.array(z.string()).optional(),
  projectTypes: z.array(z.string()).optional(),
  mapEmbed: z.string().optional(),
  contactEmail: z.string().optional(),
  seoDefaultTitle: z.string().optional(),
  seoDefaultDesc: z.string().optional(),
});

export async function GET() {
  const settings = await prisma.settings.findUnique({ where: { id: "settings" } });
  return NextResponse.json({ settings });
}

export async function PATCH(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  const settings = await prisma.settings.upsert({
    where: { id: "settings" },
    update: parsed.data,
    create: { id: "settings", ...parsed.data },
  });
  return NextResponse.json({ settings });
}
