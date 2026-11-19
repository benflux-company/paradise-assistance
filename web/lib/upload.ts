import { v2 as cloudinary } from "cloudinary";

export function uploadsConfigured() {
  return Boolean(process.env.CLOUDINARY_URL);
}

// Images (and the hero video) are stored on Cloudinary rather than on local
// disk because the app runs as stateless Kubernetes pods with no persistent
// volume for uploads (only Postgres has a PVC) — files written to the
// container filesystem would vanish on the next deploy/restart and wouldn't
// be shared across replicas. Cloudinary auto-configures itself from
// CLOUDINARY_URL, matching the same pattern already used by menage-api.
export async function uploadImage(file: Buffer, filenameHint: string): Promise<string> {
  if (!uploadsConfigured()) {
    throw new Error("CLOUDINARY_URL n'est pas configuré — les imports d'image sont indisponibles.");
  }
  cloudinary.config({ secure: true });

  const folder = process.env.CLOUDINARY_FOLDER || "paradise-assistance";
  const publicId = `${filenameHint.replace(/[^a-z0-9-]/gi, "-").toLowerCase()}-${Math.floor(Date.now() / 1000)}`;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder, public_id: publicId },
      (error, result) => {
        if (error) return reject(new Error(`Échec de l'import de l'image (Cloudinary) : ${error.message}`));
        if (!result) return reject(new Error("Réponse Cloudinary invalide."));
        resolve(result.secure_url);
      }
    );
    stream.end(file);
  });
}

export async function uploadVideo(file: Buffer, filenameHint: string): Promise<string> {
  if (!uploadsConfigured()) {
    throw new Error("CLOUDINARY_URL n'est pas configuré — les imports de vidéo sont indisponibles.");
  }
  cloudinary.config({ secure: true });

  const folder = process.env.CLOUDINARY_FOLDER || "paradise-assistance";
  const publicId = `${filenameHint.replace(/[^a-z0-9-]/gi, "-").toLowerCase()}-${Math.floor(Date.now() / 1000)}`;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "video", folder, public_id: publicId },
      (error, result) => {
        if (error) return reject(new Error(`Échec de l'import de la vidéo (Cloudinary) : ${error.message}`));
        if (!result) return reject(new Error("Réponse Cloudinary invalide."));
        resolve(result.secure_url);
      }
    );
    stream.end(file);
  });
}
