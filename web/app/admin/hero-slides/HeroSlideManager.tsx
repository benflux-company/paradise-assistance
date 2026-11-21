"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowUp, ArrowDown, Pencil, Trash2, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/admin/ui/Card";
import { Input, Label, FieldGroup } from "@/components/admin/ui/Field";
import Button from "@/components/admin/ui/Button";
import Dropzone from "@/components/admin/ui/Dropzone";
import { useConfirm } from "@/components/admin/ui/ConfirmDialog";

type Slide = { id: string; image: string; video: string; alt: string; caption: string };
type Draft = { image: string; video: string; alt: string; caption: string };

const EMPTY: Draft = { image: "", video: "", alt: "", caption: "" };

export default function HeroSlideManager({ initial, uploadsEnabled }: { initial: Slide[]; uploadsEnabled: boolean }) {
  const confirm = useConfirm();
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [creating, setCreating] = useState(false);
  const [newDraft, setNewDraft] = useState<Draft>(EMPTY);
  const [busy, setBusy] = useState(false);

  function startEdit(s: Slide) {
    setEditing(s.id);
    setDraft({ image: s.image, video: s.video, alt: s.alt, caption: s.caption });
  }

  async function saveEdit(id: string) {
    setBusy(true);
    const res = await fetch(`/api/admin/hero-slides/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    if (!res.ok) toast.error("Échec de l'enregistrement.");
    else {
      setItems((prev) => prev.map((s) => (s.id === id ? { ...s, ...draft } : s)));
      setEditing(null);
      toast.success("Slide mis à jour.");
    }
    setBusy(false);
  }

  async function create() {
    if (!newDraft.image.trim() || !newDraft.alt.trim() || !newDraft.caption.trim()) return;
    setBusy(true);
    const res = await fetch("/api/admin/hero-slides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDraft),
    });
    if (!res.ok) toast.error("Échec de la création.");
    else {
      const data = await res.json();
      setItems((prev) => [...prev, { id: data.slide.id, ...newDraft }]);
      setNewDraft(EMPTY);
      setCreating(false);
      toast.success("Slide ajouté.");
    }
    setBusy(false);
  }

  async function remove(s: Slide) {
    const ok = await confirm({
      title: "Supprimer ce slide ?",
      description: `« ${s.caption} » sera retiré définitivement du diaporama d'accueil.`,
      confirmLabel: "Supprimer",
      destructive: true,
    });
    if (!ok) return;
    setBusy(true);
    await fetch(`/api/admin/hero-slides/${s.id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((item) => item.id !== s.id));
    setBusy(false);
    toast.success("Slide supprimé.");
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
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Dropzone label="Image" value={d.image} onChange={(url) => onSet({ ...d, image: url })} uploadsEnabled={uploadsEnabled} />
          <Dropzone
            label="Vidéo (optionnel)"
            value={d.video}
            onChange={(url) => onSet({ ...d, video: url })}
            uploadsEnabled={uploadsEnabled}
            accept="video/*"
          />
        </div>
        <FieldGroup>
          <Label>Texte alternatif</Label>
          <Input value={d.alt} onChange={(e) => onSet({ ...d, alt: e.target.value })} />
        </FieldGroup>
        <FieldGroup>
          <Label>Légende</Label>
          <Input value={d.caption} onChange={(e) => onSet({ ...d, caption: e.target.value })} />
        </FieldGroup>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-3">
        {items.length === 0 && !creating && <p className="text-sm text-muted-foreground">Aucun slide pour le moment.</p>}

        {items.map((s, i) =>
          editing === s.id ? (
            <div key={s.id} className="rounded-lg border border-border bg-muted/40 p-4">
              {renderForm(draft, setDraft)}
              <div className="mt-3 flex gap-2">
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
                <div className="text-sm font-medium text-foreground">{s.caption}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.alt}</div>
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
          <div className="rounded-lg border border-border bg-muted/40 p-4">
            {renderForm(newDraft, setNewDraft)}
            <div className="mt-3 flex gap-2">
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
            <Plus className="size-4" /> Ajouter un slide
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
