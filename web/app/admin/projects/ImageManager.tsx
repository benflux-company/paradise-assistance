"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Img = { id: string; url: string; alt: string; cover: boolean };

export default function ImageManager({ projectId, images, uploadsEnabled }: { projectId: string; images: Img[]; uploadsEnabled: boolean }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`/api/admin/projects/${projectId}/images`, { method: "POST", body: form });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Échec de l'import.");
    } else {
      router.refresh();
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function remove(imageId: string) {
    if (!confirm("Supprimer cette photo ?")) return;
    setBusy(true);
    await fetch(`/api/admin/projects/${projectId}/images?imageId=${imageId}`, { method: "DELETE" });
    router.refresh();
    setBusy(false);
  }

  async function setCover(imageId: string) {
    setBusy(true);
    await fetch(`/api/admin/projects/${projectId}/images`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coverImageId: imageId }),
    });
    router.refresh();
    setBusy(false);
  }

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= images.length) return;
    const next = images.slice();
    [next[index], next[target]] = [next[target], next[index]];
    setBusy(true);
    await fetch(`/api/admin/projects/${projectId}/images`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((i) => i.id) }),
    });
    router.refresh();
    setBusy(false);
  }

  return (
    <div className="adm-card">
      <h3 style={{ fontFamily: "Cormorant, serif", fontWeight: 500, fontSize: 18, marginTop: 0 }}>Photos</h3>
      {!uploadsEnabled && (
        <div className="adm-error">
          L&apos;import d&apos;images n&apos;est pas encore configuré (CLOUDINARY_URL manquant). Demandez à votre
          prestataire de le configurer.
        </div>
      )}
      {error && <div className="adm-error">{error}</div>}

      {images.length === 0 ? (
        <div className="adm-empty">Aucune photo pour cette réalisation.</div>
      ) : (
        <div className="adm-order-list" style={{ marginBottom: 16 }}>
          {images.map((img, i) => (
            <div key={img.id} className="adm-order-row">
              <img src={img.url} alt={img.alt} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }} />
              <span>{img.cover ? <span className="adm-badge ok">Photo de couverture</span> : `Photo ${i + 1}`}</span>
              <div className="mv">
                {!img.cover && (
                  <button type="button" className="adm-btn sm" onClick={() => setCover(img.id)} disabled={busy}>
                    Définir comme couverture
                  </button>
                )}
                <button type="button" className="adm-btn sm" onClick={() => move(i, -1)} disabled={busy || i === 0}>
                  ↑
                </button>
                <button
                  type="button"
                  className="adm-btn sm"
                  onClick={() => move(i, 1)}
                  disabled={busy || i === images.length - 1}
                >
                  ↓
                </button>
                <button type="button" className="adm-btn sm danger" onClick={() => remove(img.id)} disabled={busy}>
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} disabled={!uploadsEnabled || busy || uploading} />
        {uploading && (
          <span className="adm-spinner" aria-live="polite">
            Import en cours…
          </span>
        )}
      </div>
    </div>
  );
}
