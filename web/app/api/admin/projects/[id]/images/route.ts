import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { uploadImage, uploadsConfigured } from "@/lib/upload";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!uploadsConfigured()) {
    return NextResponse.json(
      { error: "L'import d'image est indisponible : CLOUDINARY_URL n'est pas configuré." },
      { status: 503 }
    );
  }

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return NextResponse.json({ error: "Introuvable." }, { status: 404 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const alt = (form?.get("alt") as string | null) ?? project.title;
  if (!(file instanceof File)) return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });
  if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Le fichier doit être une image." }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await uploadImage(buffer, project.slug);

  const maxOrder = await prisma.projectImage.aggregate({ where: { projectId: id }, _max: { order: true } });
  const count = await prisma.projectImage.count({ where: { projectId: id } });
  const image = await prisma.projectImage.create({
    data: {
      projectId: id,
      url,
      alt,
      order: (maxOrder._max.order ?? -1) + 1,
      cover: count === 0,
    },
  });

  return NextResponse.json({ image }, { status: 201 });
}

const patchSchema = z.object({
  order: z.array(z.string()).optional(),
  coverImageId: z.string().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });

  if (parsed.data.order) {
    await prisma.$transaction(
      parsed.data.order.map((imageId, i) => prisma.projectImage.update({ where: { id: imageId }, data: { order: i } }))
    );
  }

  if (parsed.data.coverImageId) {
    await prisma.$transaction([
      prisma.projectImage.updateMany({ where: { projectId: id }, data: { cover: false } }),
      prisma.projectImage.update({ where: { id: parsed.data.coverImageId }, data: { cover: true } }),
    ]);
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const imageId = searchParams.get("imageId");
  if (!imageId) return NextResponse.json({ error: "imageId manquant." }, { status: 400 });
  await prisma.projectImage.delete({ where: { id: imageId } });
  return NextResponse.json({ ok: true });
}
