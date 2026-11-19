import { NextResponse } from "next/server";
import { uploadImage, uploadsConfigured } from "@/lib/upload";

export async function POST(req: Request) {
  if (!uploadsConfigured()) {
    return NextResponse.json(
      { error: "L'import d'image est indisponible : CLOUDINARY_URL n'est pas configuré." },
      { status: 503 }
    );
  }
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });
  if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Le fichier doit être une image." }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await uploadImage(buffer, file.name.replace(/\.[a-z0-9]+$/i, ""));
  return NextResponse.json({ url });
}
