import crypto from "crypto";

type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

function parseCloudinaryUrl(): CloudinaryConfig | null {
  const raw = process.env.CLOUDINARY_URL;
  if (!raw) return null;
  // cloudinary://<api_key>:<api_secret>@<cloud_name>
  const match = raw.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  if (!match) return null;
  const [, apiKey, apiSecret, cloudName] = match;
  return { apiKey, apiSecret, cloudName };
}

export function uploadsConfigured() {
  return parseCloudinaryUrl() !== null;
}

// Images are stored on Cloudinary rather than on local disk because the app
// runs as stateless Kubernetes pods with no persistent volume for uploads
// (only Postgres has a PVC) — files written to the container filesystem
// would vanish on the next deploy/restart and wouldn't be shared across
// replicas.
export async function uploadImage(file: Buffer, filenameHint: string): Promise<string> {
  const config = parseCloudinaryUrl();
  if (!config) {
    throw new Error("CLOUDINARY_URL n'est pas configuré — les imports d'image sont indisponibles.");
  }
  const folder = process.env.CLOUDINARY_FOLDER || "paradise-assistance";
  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = `${filenameHint.replace(/[^a-z0-9-]/gi, "-").toLowerCase()}-${timestamp}`;

  const paramsToSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${config.apiSecret}`;
  const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(file)]));
  form.append("api_key", config.apiKey);
  form.append("timestamp", String(timestamp));
  form.append("folder", folder);
  form.append("public_id", publicId);
  form.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Échec de l'import de l'image (Cloudinary) : ${text || res.status}`);
  }

  const data = (await res.json()) as { secure_url?: string };
  if (!data.secure_url) throw new Error("Réponse Cloudinary invalide.");
  return data.secure_url;
}
