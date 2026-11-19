"use client";

import { useState } from "react";
import ImageField from "../ImageField";

type Slide = { id: string; image: string; video: string; alt: string; caption: string };
type Draft = { image: string; video: string; alt: string; caption: string };

const EMPTY: Draft = { image: "", video: "", alt: "", caption: "" };

export default function HeroSlideManager({ initial, uploadsEnabled }: { initial: Slide[]; uploadsEnabled: boolean }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [creating, setCreating] = useState(false);
  const [newDraft, setNewDraft] = useState<Draft>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function startEdit(s: Slide) {
    setEditing(s.id);
    setDraft({ image: s.image, video: s.video, alt: s.alt, caption: s.caption });
  }

  async function saveEdit(id: string) {
    setBusy(true);
    setError("");
    const res = await fetch(`/api/admin/hero-slides/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    if (!res.ok) setError("Échec de l'enregistrement.");
    else {
      setItems((prev) => prev.map((s) => (s.id === id ? { ...s, ...draft } : s)));
      setEditing(null);
    }
    setBusy(false);
  }

  async function create() {
    if (!newDraft.image.trim() || !newDraft.alt.trim() || !newDraft.caption.trim()) return;
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/hero-slides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDraft),
    });
    if (!res.ok) setError("Échec de la création.");
    else {
      const data = await res.json();
      setItems((prev) => [...prev, { id: data.slide.id, ...newDraft }]);
      setNewDraft(EMPTY);
      setCreating(false);
    }
    setBusy(false);
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce slide ?")) return;
    setBusy(true);
    await fetch(`/api/admin/hero-slides/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((s) => s.id !== id));
    setBusy(false);
  }

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = items.slice();
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    await fetch("/api/admin/hero-slides/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: next.map((s) => s.id) }),
    });
  }

  function renderForm(d: Draft, onSet: (next: Draft) => void) {
    return (
      <div className="adm-form">
        <ImageField label="Image" value={d.image} onChange={(url) => onSet({ ...d, image: url })} uploadsEnabled={uploadsEnabled} />
        <ImageField
          label="Vidéo (optionnel)"
          value={d.video}
          onChange={(url) => onSet({ ...d, video: url })}
          uploadsEnabled={uploadsEnabled}
          accept="video/*"
        />
        <div className="adm-field">
          <label>Texte alternatif</label>
          <input type="text" value={d.alt} onChange={(e) => onSet({ ...d, alt: e.target.value })} />
        </div>
        <div className="adm-field">
          <label>Légende</label>
          <input type="text" value={d.caption} onChange={(e) => onSet({ ...d, caption: e.target.value })} />
        </div>
      </div>
    );
  }

  return (
    <div className="adm-card">
      {error && <div className="adm-error" style={{ marginBottom: 16 }}>{error}</div>}
      {items.length === 0 && !creating && <div className="adm-empty">Aucun slide pour le moment.</div>}

      <div className="adm-order-list">
        {items.map((s, i) =>
          editing === s.id ? (
            <div key={s.id} className="adm-card" style={{ padding: 14 }}>
              {renderForm(draft, setDraft)}
              <div className="adm-form-actions" style={{ marginTop: 12 }}>
                <button className="adm-btn primary" type="button" disabled={busy} onClick={() => saveEdit(s.id)}>
                  Enregistrer
                </button>
                <button className="adm-btn" type="button" onClick={() => setEditing(null)}>
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <div key={s.id} className="adm-order-row" style={{ alignItems: "flex-start" }}>
              <img src={s.image} alt="" style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 6 }} />
              <div style={{ flex: 1 }}>
                <strong>{s.caption}</strong>
                <div style={{ color: "var(--adm-muted)", fontSize: 13, marginTop: 4 }}>{s.alt}</div>
              </div>
              <div className="mv">
                <button className="adm-btn sm" type="button" onClick={() => move(i, -1)} disabled={i === 0}>
                  ↑
                </button>
                <button className="adm-btn sm" type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1}>
                  ↓
                </button>
                <button className="adm-btn sm" type="button" onClick={() => startEdit(s)}>
                  Modifier
                </button>
                <button className="adm-btn sm danger" type="button" onClick={() => remove(s.id)} disabled={busy}>
                  Supprimer
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {creating ? (
        <div className="adm-card" style={{ padding: 14, marginTop: 16 }}>
          {renderForm(newDraft, setNewDraft)}
          <div className="adm-form-actions" style={{ marginTop: 12 }}>
            <button className="adm-btn primary" type="button" disabled={busy} onClick={create}>
              Ajouter
            </button>
            <button className="adm-btn" type="button" onClick={() => setCreating(false)}>
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <button className="adm-btn primary" type="button" style={{ marginTop: 16 }} onClick={() => setCreating(true)}>
          Ajouter un slide
        </button>
      )}
    </div>
  );
}
