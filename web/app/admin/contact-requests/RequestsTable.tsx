"use client";

import { Fragment, useState } from "react";

type Row = {
  id: string;
  name: string;
  contact: string;
  projectType: string;
  budget: string;
  message: string;
  status: string;
  note: string;
  createdAt: string;
};

const STATUS_LABELS: Record<string, string> = {
  NOUVEAU: "Nouveau",
  EN_COURS: "En cours",
  TRAITE: "Traité",
  ARCHIVE: "Archivé",
};

const STATUS_BADGE: Record<string, string> = {
  NOUVEAU: "warn",
  EN_COURS: "",
  TRAITE: "ok",
  ARCHIVE: "",
};

export default function RequestsTable({ requests }: { requests: Row[] }) {
  const [rows, setRows] = useState(requests);
  const [open, setOpen] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  function toggle(row: Row) {
    if (open === row.id) {
      setOpen(null);
      return;
    }
    setOpen(row.id);
    setNoteDraft(row.note);
  }

  async function updateStatus(id: string, status: string) {
    setBusyId(id);
    await fetch(`/api/admin/contact-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setBusyId(null);
  }

  async function saveNote(id: string) {
    setBusyId(id);
    await fetch(`/api/admin/contact-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: noteDraft }),
    });
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, note: noteDraft } : r)));
    setBusyId(null);
  }

  async function remove(id: string) {
    if (!confirm("Supprimer définitivement cette demande ?")) return;
    setBusyId(id);
    await fetch(`/api/admin/contact-requests/${id}`, { method: "DELETE" });
    setRows((prev) => prev.filter((r) => r.id !== id));
    setBusyId(null);
  }

  if (rows.length === 0) return <div className="adm-empty">Aucune demande pour le moment.</div>;

  return (
    <table className="adm-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Nom</th>
          <th>Contact</th>
          <th>Projet</th>
          <th>Statut</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <Fragment key={row.id}>
            <tr>
              <td>{new Date(row.createdAt).toLocaleDateString("fr-FR")}</td>
              <td>{row.name}</td>
              <td>{row.contact}</td>
              <td>
                {row.projectType}
                <div style={{ color: "var(--adm-muted)", fontSize: 12 }}>{row.budget}</div>
              </td>
              <td>
                <select
                  value={row.status}
                  onChange={(e) => updateStatus(row.id, e.target.value)}
                  disabled={busyId === row.id}
                  className={`adm-badge ${STATUS_BADGE[row.status]}`}
                  style={{ border: "1px solid var(--adm-line)", cursor: "pointer" }}
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <div className="adm-row-actions">
                  <button className="adm-btn sm" type="button" onClick={() => toggle(row)}>
                    {open === row.id ? "Fermer" : "Détails"}
                  </button>
                  <button className="adm-btn sm danger" type="button" onClick={() => remove(row.id)} disabled={busyId === row.id}>
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
            {open === row.id && (
              <tr>
                <td colSpan={6} style={{ background: "var(--adm-bg)" }}>
                  <div style={{ padding: "12px 4px" }}>
                    <strong>Message :</strong>
                    <p style={{ margin: "6px 0 16px" }}>{row.message}</p>
                    <div className="adm-field">
                      <label>Note interne</label>
                      <textarea value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} />
                    </div>
                    <button className="adm-btn primary sm" type="button" onClick={() => saveNote(row.id)} disabled={busyId === row.id}>
                      Enregistrer la note
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}
