"use client";

import { useRef, useState } from "react";

export default function ImageField({
  label,
  value,
  onChange,
  uploadsEnabled,
  accept = "image/*",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  uploadsEnabled: boolean;
  accept?: string;
}) {
  const isVideoField = accept.startsWith("video");
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Échec de l'import.");
    } else {
      onChange(data.url);
    }
    setBusy(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="adm-field">
      <label>{label}</label>
      {error && <div className="adm-error">{error}</div>}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {value && !isVideoField && <img src={value} alt="" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8 }} />}
        {value && isVideoField && <video src={value} muted style={{ width: 90, height: 56, objectFit: "cover", borderRadius: 8 }} />}
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={{ flex: 1 }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input ref={fileRef} type="file" accept={accept} onChange={onUpload} disabled={!uploadsEnabled || busy} />
        {busy && (
          <span className="adm-spinner" aria-live="polite">
            Import en cours…
          </span>
        )}
      </div>
      {!uploadsEnabled && (
        <div className="hint">
          Import indisponible (CLOUDINARY_URL manquant) — collez une URL {isVideoField ? "de vidéo" : "d'image"}.
        </div>
      )}
    </div>
  );
}
