"use client";

import { useState } from "react";
import ImageField from "../ImageField";

type Service = { id: string; title: string; subtitle: string; description: string; items: string[]; image: string };
type Draft = { title: string; subtitle: string; description: string; itemsText: string; image: string };

const EMPTY: Draft = { title: "", subtitle: "", description: "", itemsText: "", image: "" };

function toDraft(s: Service): Draft {
  return { title: s.title, subtitle: s.subtitle, description: s.description, itemsText: s.items.join("\n"), image: s.image };
}

function fromDraft(d: Draft) {
  return {
    title: d.title,
    subtitle: d.subtitle,
    description: d.description,
    items: d.itemsText.split("\n").map((s) => s.trim()).filter(Boolean),
    image: d.image,
  };
}

export default function ServiceManager({ initial, uploadsEnabled }: { initial: Service[]; uploadsEnabled: boolean }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [creating, setCreating] = useState(false);
  const [newDraft, setNewDraft] = useState<Draft>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function startEdit(s: Service) {
    setEditing(s.id);
    setDraft(toDraft(s));
  }

  async function saveEdit(id: string) {
    setBusy(true);
    setError("");
    const payload = fromDraft(draft);
    const res = await fetch(`/api/admin/services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) setError("Échec de l'enregistrement.");
    else {
      setItems((prev) => prev.map((s) => (s.id === id ? { ...s, ...payload } : s)));
      setEditing(null);
    }
    setBusy(false);
  }

  async function create() {
    const payload = fromDraft(newDraft);
    if (!payload.title.trim() || !payload.subtitle.trim() || !payload.description.trim() || !payload.image.trim()) return;
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) setError("Échec de la création.");
    else {
      const data = await res.json();
      setItems((prev) => [...prev, { id: data.service.id, ...payload }]);
      setNewDraft(EMPTY);
      setCreating(false);
    }
    setBusy(false);
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette prestation ?")) return;
    setBusy(true);
    await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((s) => s.id !== id));
    setBusy(false);
  }

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = items.slice();
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    await fetch("/api/admin/services/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: next.map((s) => s.id) }),
    });
  }

  function renderForm(d: Draft, onSet: (next: Draft) => void) {
    return (
      <div className="adm-form">
        <div className="adm-field">
          <label>Titre</label>
          <input type="text" value={d.title} onChange={(e) => onSet({ ...d, title: e.target.value })} />
        </div>
        <div className="adm-field">
          <label>Sous-titre</label>
          <input type="text" value={d.subtitle} onChange={(e) => onSet({ ...d, subtitle: e.target.value })} />
        </div>
        <div className="adm-field">
          <label>Description</label>
          <textarea value={d.description} onChange={(e) => onSet({ ...d, description: e.target.value })} />
        </div>
        <div className="adm-field">
          <label>Points clés</label>
          <textarea value={d.itemsText} onChange={(e) => onSet({ ...d, itemsText: e.target.value })} />
          <div className="hint">Un point par ligne.</div>
        </div>
        <ImageField label="Image" value={d.image} onChange={(url) => onSet({ ...d, image: url })} uploadsEnabled={uploadsEnabled} />
      </div>
    );
  }

  return (
    <div className="adm-card">
      {error && <div className="adm-error" style={{ marginBottom: 16 }}>{error}</div>}
      {items.length === 0 && !creating && <div className="adm-empty">Aucune prestation pour le moment.</div>}

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
                <strong>{s.title}</strong>
                <div style={{ color: "var(--adm-muted)", fontSize: 13, marginTop: 4 }}>{s.subtitle}</div>
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
          Ajouter une prestation
        </button>
      )}
    </div>
  );
}
