"use client";

import { useState } from "react";

type Faq = { id: string; question: string; answer: string };

export default function FaqManager({ initial }: { initial: Faq[] }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ question: string; answer: string }>({ question: "", answer: "" });
  const [creating, setCreating] = useState(false);
  const [newDraft, setNewDraft] = useState({ question: "", answer: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function startEdit(f: Faq) {
    setEditing(f.id);
    setDraft({ question: f.question, answer: f.answer });
  }

  async function saveEdit(id: string) {
    setBusy(true);
    setError("");
    const res = await fetch(`/api/admin/faqs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    if (!res.ok) {
      setError("Échec de l'enregistrement.");
    } else {
      setItems((prev) => prev.map((f) => (f.id === id ? { ...f, ...draft } : f)));
      setEditing(null);
    }
    setBusy(false);
  }

  async function createFaq() {
    if (!newDraft.question.trim() || !newDraft.answer.trim()) return;
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/faqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDraft),
    });
    if (!res.ok) {
      setError("Échec de la création.");
    } else {
      const data = await res.json();
      setItems((prev) => [...prev, { id: data.faq.id, question: data.faq.question, answer: data.faq.answer }]);
      setNewDraft({ question: "", answer: "" });
      setCreating(false);
    }
    setBusy(false);
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette question ?")) return;
    setBusy(true);
    await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((f) => f.id !== id));
    setBusy(false);
  }

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = items.slice();
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    await fetch("/api/admin/faqs/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: next.map((f) => f.id) }),
    });
  }

  return (
    <div className="adm-card">
      {error && <div className="adm-error" style={{ marginBottom: 16 }}>{error}</div>}
      {items.length === 0 && !creating && <div className="adm-empty">Aucune question pour le moment.</div>}

      <div className="adm-order-list">
        {items.map((f, i) =>
          editing === f.id ? (
            <div key={f.id} className="adm-card" style={{ padding: 14 }}>
              <div className="adm-form">
                <div className="adm-field">
                  <label>Question</label>
                  <input
                    type="text"
                    value={draft.question}
                    onChange={(e) => setDraft((d) => ({ ...d, question: e.target.value }))}
                  />
                </div>
                <div className="adm-field">
                  <label>Réponse</label>
                  <textarea value={draft.answer} onChange={(e) => setDraft((d) => ({ ...d, answer: e.target.value }))} />
                </div>
                <div className="adm-form-actions">
                  <button className="adm-btn primary" type="button" disabled={busy} onClick={() => saveEdit(f.id)}>
                    Enregistrer
                  </button>
                  <button className="adm-btn" type="button" onClick={() => setEditing(null)}>
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div key={f.id} className="adm-order-row" style={{ alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <strong>{f.question}</strong>
                <div style={{ color: "var(--adm-muted)", fontSize: 13, marginTop: 4 }}>{f.answer}</div>
              </div>
              <div className="mv">
                <button className="adm-btn sm" type="button" onClick={() => move(i, -1)} disabled={i === 0}>
                  ↑
                </button>
                <button className="adm-btn sm" type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1}>
                  ↓
                </button>
                <button className="adm-btn sm" type="button" onClick={() => startEdit(f)}>
                  Modifier
                </button>
                <button className="adm-btn sm danger" type="button" onClick={() => remove(f.id)} disabled={busy}>
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
              <label>Question</label>
              <input
                type="text"
                value={newDraft.question}
                onChange={(e) => setNewDraft((d) => ({ ...d, question: e.target.value }))}
              />
            </div>
            <div className="adm-field">
              <label>Réponse</label>
              <textarea
                value={newDraft.answer}
                onChange={(e) => setNewDraft((d) => ({ ...d, answer: e.target.value }))}
              />
            </div>
            <div className="adm-form-actions">
              <button className="adm-btn primary" type="button" disabled={busy} onClick={createFaq}>
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
          Ajouter une question
        </button>
      )}
    </div>
  );
}
