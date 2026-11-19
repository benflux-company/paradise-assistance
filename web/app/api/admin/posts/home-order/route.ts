import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// Replaces the full set of posts shown in the home-page preview: the given
// ids (in order) get homeOrder 0..n-1, every other post gets homeOrder null.
const schema = z.object({ ids: z.array(z.string()).max(3) });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Données invalides (3 articles maximum)." }, { status: 400 });

  await prisma.$transaction([
    prisma.post.updateMany({ data: { homeOrder: null } }),
    ...parsed.data.ids.map((id, i) => prisma.post.update({ where: { id }, data: { homeOrder: i } })),
  ]);

  return NextResponse.json({ ok: true });
}
