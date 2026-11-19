"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Item = { id: string; title: string };

export default function HomePreviewManager({ posts, allPosts }: { posts: Item[]; allPosts: Item[] }) {
  const router = useRouter();
  const [items, setItems] = useState(posts);
  const [adding, setAdding] = useState("");
  const [busy, setBusy] = useState(false);

  async function save(next: Item[]) {
    setBusy(true);
    await fetch("/api/admin/posts/home-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: next.map((i) => i.id) }),
    });
    setItems(next);
    router.refresh();
    setBusy(false);
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = items.slice();
    [next[index], next[target]] = [next[target], next[index]];
    save(next);
  }

  function remove(id: string) {
    save(items.filter((i) => i.id !== id));
  }

  function add() {
    if (!adding || items.length >= 3) return;
    const post = allPosts.find((p) => p.id === adding);
    if (!post) return;
    save([...items, post]);
    setAdding("");
  }

  const available = allPosts.filter((p) => !items.some((i) => i.id === p.id));

  return (
    <div className="adm-card" style={{ marginBottom: 24 }}>
      <h3 style={{ fontFamily: "Cormorant, serif", fontWeight: 500, fontSize: 18, marginTop: 0 }}>
        Articles à la une de l&apos;accueil
      </h3>
      <p className="hint" style={{ marginBottom: 16 }}>
        Jusqu&apos;à 3 articles, affichés dans cet ordre sur la page d&apos;accueil.
      </p>
      {items.length === 0 ? (
        <div className="adm-empty">Aucun article sélectionné pour l&apos;accueil.</div>
      ) : (
        <div className="adm-order-list" style={{ marginBottom: 16 }}>
          {items.map((item, i) => (
            <div key={item.id} className="adm-order-row">
              <span>{item.title}</span>
              <div className="mv">
                <button className="adm-btn sm" type="button" onClick={() => move(i, -1)} disabled={busy || i === 0}>
                  ↑
                </button>
                <button
                  className="adm-btn sm"
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={busy || i === items.length - 1}
                >
                  ↓
                </button>
                <button className="adm-btn sm danger" type="button" onClick={() => remove(item.id)} disabled={busy}>
                  Retirer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {items.length < 3 && available.length > 0 && (
        <div style={{ display: "flex", gap: 10 }}>
          <select value={adding} onChange={(e) => setAdding(e.target.value)} style={{ flex: 1 }}>
            <option value="">Choisir un article…</option>
            {available.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
          <button className="adm-btn" type="button" onClick={add} disabled={!adding || busy}>
            Ajouter
          </button>
        </div>
      )}
    </div>
  );
}
