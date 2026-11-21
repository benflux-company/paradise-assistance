"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, ArrowDown, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/admin/ui/Card";
import { Select } from "@/components/admin/ui/Field";
import Button from "@/components/admin/ui/Button";
import { useConfirm } from "@/components/admin/ui/ConfirmDialog";

type Item = { id: string; title: string };

export default function HomePreviewManager({ posts, allPosts }: { posts: Item[]; allPosts: Item[] }) {
  const confirm = useConfirm();
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

  async function remove(item: Item) {
    const ok = await confirm({
      title: "Retirer cet article de l'accueil ?",
      description: `« ${item.title} » ne sera plus affiché à la une de la page d'accueil (l'article lui-même n'est pas supprimé).`,
      confirmLabel: "Retirer",
      destructive: true,
    });
    if (!ok) return;
    save(items.filter((i) => i.id !== item.id));
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
    <Card>
      <CardHeader className="flex-col items-start">
        <CardTitle>Articles à la une de l&apos;accueil</CardTitle>
        <CardDescription>Jusqu&apos;à 3 articles, affichés dans cet ordre sur la page d&apos;accueil.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun article sélectionné pour l&apos;accueil.</p>
        ) : (
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5">
                <span className="text-sm text-foreground">{item.title}</span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => move(i, -1)} disabled={busy || i === 0} aria-label="Monter">
                    <ArrowUp className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => move(i, 1)} disabled={busy || i === items.length - 1} aria-label="Descendre">
                    <ArrowDown className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(item)} disabled={busy} aria-label="Retirer">
                    <X className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {items.length < 3 && available.length > 0 && (
          <div className="flex gap-2">
            <Select value={adding} onChange={(e) => setAdding(e.target.value)} className="flex-1">
              <option value="">Choisir un article…</option>
              {available.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </Select>
            <Button variant="outline" onClick={add} disabled={!adding || busy}>
              Ajouter
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
