"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageField from "../ImageField";
import type { ContentFieldDef } from "@/lib/siteContent";

export default function SiteContentManager({
  section,
  fields,
  values,
  uploadsEnabled,
}: {
  section: string;
  fields: ContentFieldDef[];
  values: Record<string, string>;
  uploadsEnabled: boolean;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.key, values[f.key] ?? f.default]))
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function save() {
    setBusy(true);
    setError("");
    setSaved(false);
    const res = await fetch("/api/admin/site-content", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    if (!res.ok) setError("Échec de l'enregistrement.");
    else {
      setSaved(true);
      router.refresh();
    }
    setBusy(false);
  }

  return (
    <div className="adm-card" style={{ marginBottom: 24 }}>
      <h3 style={{ fontFamily: "Cormorant, serif", fontWeight: 500, fontSize: 18, marginTop: 0 }}>{section}</h3>
      {error && <div className="adm-error" style={{ marginBottom: 12 }}>{error}</div>}
      {saved && <div className="adm-success" style={{ marginBottom: 12 }}>Enregistré.</div>}
      <div className="adm-form">
        {fields.map((f) =>
          f.type === "image" ? (
            <ImageField
              key={f.key}
              label={f.label}
              value={draft[f.key]}
              onChange={(url) => setDraft((d) => ({ ...d, [f.key]: url }))}
              uploadsEnabled={uploadsEnabled}
            />
          ) : (
            <div className="adm-field" key={f.key}>
              <label>{f.label}</label>
              {f.type === "text" ? (
                <input
                  type="text"
                  value={draft[f.key]}
                  onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                />
              ) : (
                <textarea
                  value={draft[f.key]}
                  onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                  style={f.type === "list" ? { minHeight: 120 } : undefined}
                />
              )}
              {f.hint && <div className="hint">{f.hint}</div>}
            </div>
          )
        )}
        <div className="adm-form-actions">
          <button type="button" className="adm-btn primary" disabled={busy} onClick={save}>
            {busy ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}
