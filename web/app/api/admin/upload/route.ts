import { NextResponse } from "next/server";
import { uploadImage, uploadVideo, uploadsConfigured } from "@/lib/upload";

export async function POST(req: Request) {
  if (!uploadsConfigured()) {
    return NextResponse.json(
      { error: "L'import est indisponible : CLOUDINARY_URL n'est pas configuré." },
      { status: 503 }
    );
  }
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });

  const isVideo = file.type.startsWith("video/");
  const isImage = file.type.startsWith("image/");
  if (!isVideo && !isImage) {
    return NextResponse.json({ error: "Le fichier doit être une image ou une vidéo." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const hint = file.name.replace(/\.[a-z0-9]+$/i, "");
  const url = isVideo ? await uploadVideo(buffer, hint) : await uploadImage(buffer, hint);
  return NextResponse.json({ url });
}
