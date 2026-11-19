"use client";

import { useRef, useState } from "react";

export default function ImageField({
  label,
  value,
  onChange,
  uploadsEnabled,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  uploadsEnabled: boolean;
}) {
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
        {value && <img src={value} alt="" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8 }} />}
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={{ flex: 1 }} />
      </div>
      <div>
        <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} disabled={!uploadsEnabled || busy} />
        {!uploadsEnabled && <div className="hint">Import indisponible (CLOUDINARY_URL manquant) — collez une URL d&apos;image.</div>}
      </div>
    </div>
  );
}
