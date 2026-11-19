"use client";

import { useState } from "react";
import ImageField from "../ImageField";

type Step = { id: string; title: string; description: string; image: string };
type Draft = { title: string; description: string; image: string };

const EMPTY: Draft = { title: "", description: "", image: "" };

export default function MethodStepManager({ initial, uploadsEnabled }: { initial: Step[]; uploadsEnabled: boolean }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [creating, setCreating] = useState(false);
  const [newDraft, setNewDraft] = useState<Draft>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function startEdit(s: Step) {
    setEditing(s.id);
    setDraft({ title: s.title, description: s.description, image: s.image });
  }

  async function saveEdit(id: string) {
    setBusy(true);
    setError("");
    const res = await fetch(`/api/admin/method-steps/${id}`, {
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
    if (!newDraft.title.trim() || !newDraft.description.trim() || !newDraft.image.trim()) return;
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/method-steps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDraft),
    });
    if (!res.ok) setError("Échec de la création.");
    else {
      const data = await res.json();
      setItems((prev) => [...prev, { id: data.step.id, ...newDraft }]);
      setNewDraft(EMPTY);
      setCreating(false);
    }
    setBusy(false);
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette étape ?")) return;
    setBusy(true);
    await fetch(`/api/admin/method-steps/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((s) => s.id !== id));
    setBusy(false);
  }

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = items.slice();
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    await fetch("/api/admin/method-steps/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: next.map((s) => s.id) }),
    });
  }

  return (
    <div className="adm-card">
      {error && <div className="adm-error" style={{ marginBottom: 16 }}>{error}</div>}
      {items.length === 0 && !creating && <div className="adm-empty">Aucune étape pour le moment.</div>}

      <div className="adm-order-list">
        {items.map((s, i) =>
          editing === s.id ? (
            <div key={s.id} className="adm-card" style={{ padding: 14 }}>
              <div className="adm-form">
                <div className="adm-field">
                  <label>Titre</label>
                  <input type="text" value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
                </div>
                <div className="adm-field">
                  <label>Description</label>
                  <textarea value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
                </div>
                <ImageField
                  label="Image"
                  value={draft.image}
                  onChange={(url) => setDraft((d) => ({ ...d, image: url }))}
                  uploadsEnabled={uploadsEnabled}
                />
                <div className="adm-form-actions">
                  <button className="adm-btn primary" type="button" disabled={busy} onClick={() => saveEdit(s.id)}>
                    Enregistrer
                  </button>
                  <button className="adm-btn" type="button" onClick={() => setEditing(null)}>
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div key={s.id} className="adm-order-row" style={{ alignItems: "flex-start" }}>
              <img src={s.image} alt="" style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 6 }} />
              <div style={{ flex: 1 }}>
                <strong>{s.title}</strong>
                <div style={{ color: "var(--adm-muted)", fontSize: 13, marginTop: 4 }}>{s.description}</div>
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
          <div className="adm-form">
            <div className="adm-field">
              <label>Titre</label>
              <input type="text" value={newDraft.title} onChange={(e) => setNewDraft((d) => ({ ...d, title: e.target.value }))} />
            </div>
            <div className="adm-field">
              <label>Description</label>
              <textarea
                value={newDraft.description}
                onChange={(e) => setNewDraft((d) => ({ ...d, description: e.target.value }))}
              />
            </div>
            <ImageField
              label="Image"
              value={newDraft.image}
              onChange={(url) => setNewDraft((d) => ({ ...d, image: url }))}
              uploadsEnabled={uploadsEnabled}
            />
            <div className="adm-form-actions">
              <button className="adm-btn primary" type="button" disabled={busy} onClick={create}>
                Ajouter
              </button>
              <button className="adm-btn" type="button" onClick={() => setCreating(false)}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button className="adm-btn primary" type="button" style={{ marginTop: 16 }} onClick={() => setCreating(true)}>
          Ajouter une étape
        </button>
      )}
    </div>
  );
}
