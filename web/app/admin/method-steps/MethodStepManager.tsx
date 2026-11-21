"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowUp, ArrowDown, Pencil, Trash2, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/admin/ui/Card";
import { Input, Textarea, Label, FieldGroup } from "@/components/admin/ui/Field";
import Button from "@/components/admin/ui/Button";
import Dropzone from "@/components/admin/ui/Dropzone";
import { useConfirm } from "@/components/admin/ui/ConfirmDialog";

type Step = { id: string; title: string; description: string; image: string };
type Draft = { title: string; description: string; image: string };

const EMPTY: Draft = { title: "", description: "", image: "" };

export default function MethodStepManager({ initial, uploadsEnabled }: { initial: Step[]; uploadsEnabled: boolean }) {
  const confirm = useConfirm();
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [creating, setCreating] = useState(false);
  const [newDraft, setNewDraft] = useState<Draft>(EMPTY);
  const [busy, setBusy] = useState(false);

  function startEdit(s: Step) {
    setEditing(s.id);
    setDraft({ title: s.title, description: s.description, image: s.image });
  }

  async function saveEdit(id: string) {
    setBusy(true);
    const res = await fetch(`/api/admin/method-steps/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    if (!res.ok) toast.error("Échec de l'enregistrement.");
    else {
      setItems((prev) => prev.map((s) => (s.id === id ? { ...s, ...draft } : s)));
      setEditing(null);
      toast.success("Étape mise à jour.");
    }
    setBusy(false);
  }

  async function create() {
    if (!newDraft.title.trim() || !newDraft.description.trim() || !newDraft.image.trim()) return;
    setBusy(true);
    const res = await fetch("/api/admin/method-steps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDraft),
    });
    if (!res.ok) toast.error("Échec de la création.");
    else {
      const data = await res.json();
      setItems((prev) => [...prev, { id: data.step.id, ...newDraft }]);
      setNewDraft(EMPTY);
      setCreating(false);
      toast.success("Étape ajoutée.");
    }
    setBusy(false);
  }

  async function remove(s: Step) {
    const ok = await confirm({
      title: "Supprimer cette étape ?",
      description: `« ${s.title} » sera retirée définitivement de la méthode affichée sur le site.`,
      confirmLabel: "Supprimer",
      destructive: true,
    });
    if (!ok) return;
    setBusy(true);
    await fetch(`/api/admin/method-steps/${s.id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((item) => item.id !== s.id));
    setBusy(false);
    toast.success("Étape supprimée.");
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
    <Card>
      <CardContent className="space-y-3">
        {items.length === 0 && !creating && <p className="text-sm text-muted-foreground">Aucune étape pour le moment.</p>}

        {items.map((s, i) =>
          editing === s.id ? (
            <div key={s.id} className="rounded-lg border border-border bg-muted/40 p-4 space-y-3">
              <FieldGroup>
                <Label>Titre</Label>
                <Input value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
              </FieldGroup>
              <FieldGroup>
                <Label>Description</Label>
                <Textarea value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
              </FieldGroup>
              <Dropzone label="Image" value={draft.image} onChange={(url) => setDraft((d) => ({ ...d, image: url }))} uploadsEnabled={uploadsEnabled} />
              <div className="flex gap-2">
                <Button size="sm" loading={busy} onClick={() => saveEdit(s.id)}>
                  Enregistrer
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditing(null)}>
                  Annuler
                </Button>
              </div>
            </div>
          ) : (
            <div key={s.id} className="flex items-start gap-4 rounded-lg border border-border p-4">
              <img src={s.image} alt="" className="size-11 shrink-0 rounded-md object-cover" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-foreground">{s.title}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.description}</div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Monter">
                  <ArrowUp className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Descendre">
                  <ArrowDown className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => startEdit(s)} aria-label="Modifier">
                  <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => remove(s)} disabled={busy} aria-label="Supprimer">
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
          )
        )}

        {creating ? (
          <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-3">
            <FieldGroup>
              <Label>Titre</Label>
              <Input value={newDraft.title} onChange={(e) => setNewDraft((d) => ({ ...d, title: e.target.value }))} />
            </FieldGroup>
            <FieldGroup>
              <Label>Description</Label>
              <Textarea value={newDraft.description} onChange={(e) => setNewDraft((d) => ({ ...d, description: e.target.value }))} />
            </FieldGroup>
            <Dropzone label="Image" value={newDraft.image} onChange={(url) => setNewDraft((d) => ({ ...d, image: url }))} uploadsEnabled={uploadsEnabled} />
            <div className="flex gap-2">
              <Button size="sm" loading={busy} onClick={create}>
                Ajouter
              </Button>
              <Button size="sm" variant="outline" onClick={() => setCreating(false)}>
                Annuler
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setCreating(true)}>
            <Plus className="size-4" /> Ajouter une étape
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
