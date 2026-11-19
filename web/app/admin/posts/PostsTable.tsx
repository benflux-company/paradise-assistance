"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Row = {
  id: string;
  title: string;
  slug: string;
  category: string;
  featured: boolean;
  published: boolean;
  cover: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  CONSEILS: "Conseils",
  CHANTIERS: "Chantiers",
  INSPIRATIONS: "Inspirations",
};

export default function PostsTable({ posts }: { posts: Row[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(posts);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function reorder(next: Row[]) {
    setRows(next);
    await fetch("/api/admin/posts/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: next.map((r) => r.id) }),
    });
    router.refresh();
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= rows.length) return;
    const next = rows.slice();
    [next[index], next[target]] = [next[target], next[index]];
    reorder(next);
  }

  async function togglePublished(row: Row) {
    setBusyId(row.id);
    await fetch(`/api/admin/posts/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !row.published }),
    });
    setRows((r) => r.map((x) => (x.id === row.id ? { ...x, published: !x.published } : x)));
    setBusyId(null);
  }

  async function remove(row: Row) {
    if (!confirm(`Supprimer définitivement « ${row.title} » ?`)) return;
    setBusyId(row.id);
    await fetch(`/api/admin/posts/${row.id}`, { method: "DELETE" });
    setRows((r) => r.filter((x) => x.id !== row.id));
    setBusyId(null);
  }

  if (rows.length === 0) return <div className="adm-empty">Aucun article pour le moment.</div>;

  return (
    <table className="adm-table">
      <thead>
        <tr>
          <th></th>
          <th>Photo</th>
          <th>Titre</th>
          <th>Catégorie</th>
          <th>À la une</th>
          <th>Statut</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={row.id}>
            <td>
              <div className="adm-row-actions">
                <button className="adm-btn sm" type="button" onClick={() => move(i, -1)} disabled={i === 0}>
                  ↑
                </button>
                <button className="adm-btn sm" type="button" onClick={() => move(i, 1)} disabled={i === rows.length - 1}>
                  ↓
                </button>
              </div>
            </td>
            <td>{row.cover ? <img className="thumb" src={row.cover} alt="" /> : "—"}</td>
            <td>{row.title}</td>
            <td>{CATEGORY_LABELS[row.category] ?? row.category}</td>
            <td>{row.featured ? <span className="adm-badge ok">Oui</span> : <span className="adm-badge">Non</span>}</td>
            <td>
              <button
                type="button"
                className={`adm-badge ${row.published ? "ok" : "warn"}`}
                style={{ border: "none", cursor: "pointer" }}
                onClick={() => togglePublished(row)}
                disabled={busyId === row.id}
              >
                {row.published ? "Publié" : "Brouillon"}
              </button>
            </td>
            <td>
              <div className="adm-row-actions">
                <Link href={`/admin/posts/${row.id}`} className="adm-btn sm">
                  Modifier
                </Link>
                <button className="adm-btn sm danger" type="button" onClick={() => remove(row)} disabled={busyId === row.id}>
                  Supprimer
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
