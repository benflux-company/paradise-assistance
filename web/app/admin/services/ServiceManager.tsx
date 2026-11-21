"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowUp, ArrowDown, Pencil, Trash2, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/admin/ui/Card";
import { Input, Textarea, Label, FieldGroup, FieldHint } from "@/components/admin/ui/Field";
import Button from "@/components/admin/ui/Button";
import Dropzone from "@/components/admin/ui/Dropzone";
import { useConfirm } from "@/components/admin/ui/ConfirmDialog";

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
  const confirm = useConfirm();
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [creating, setCreating] = useState(false);
  const [newDraft, setNewDraft] = useState<Draft>(EMPTY);
  const [busy, setBusy] = useState(false);

  function startEdit(s: Service) {
    setEditing(s.id);
    setDraft(toDraft(s));
  }

  async function saveEdit(id: string) {
    setBusy(true);
    const payload = fromDraft(draft);
    const res = await fetch(`/api/admin/services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) toast.error("Échec de l'enregistrement.");
    else {
      setItems((prev) => prev.map((s) => (s.id === id ? { ...s, ...payload } : s)));
      setEditing(null);
      toast.success("Prestation mise à jour.");
    }
    setBusy(false);
  }

  async function create() {
    const payload = fromDraft(newDraft);
    if (!payload.title.trim() || !payload.subtitle.trim() || !payload.description.trim() || !payload.image.trim()) return;
    setBusy(true);
    const res = await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) toast.error("Échec de la création.");
    else {
      const data = await res.json();
      setItems((prev) => [...prev, { id: data.service.id, ...payload }]);
      setNewDraft(EMPTY);
      setCreating(false);
      toast.success("Prestation ajoutée.");
    }
    setBusy(false);
  }

  async function remove(s: Service) {
    const ok = await confirm({
      title: "Supprimer cette prestation ?",
      description: `« ${s.title} » sera retirée définitivement de la page Prestations.`,
      confirmLabel: "Supprimer",
      destructive: true,
    });
    if (!ok) return;
    setBusy(true);
    await fetch(`/api/admin/services/${s.id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((item) => item.id !== s.id));
    setBusy(false);
    toast.success("Prestation supprimée.");
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
      <div className="space-y-3">
        <FieldGroup>
          <Label>Titre</Label>
          <Input value={d.title} onChange={(e) => onSet({ ...d, title: e.target.value })} />
        </FieldGroup>
        <FieldGroup>
          <Label>Sous-titre</Label>
          <Input value={d.subtitle} onChange={(e) => onSet({ ...d, subtitle: e.target.value })} />
        </FieldGroup>
        <FieldGroup>
          <Label>Description</Label>
          <Textarea value={d.description} onChange={(e) => onSet({ ...d, description: e.target.value })} />
        </FieldGroup>
        <FieldGroup>
          <Label>Points clés</Label>
          <Textarea value={d.itemsText} onChange={(e) => onSet({ ...d, itemsText: e.target.value })} />
          <FieldHint>Un point par ligne.</FieldHint>
        </FieldGroup>
        <Dropzone label="Image" value={d.image} onChange={(url) => onSet({ ...d, image: url })} uploadsEnabled={uploadsEnabled} />
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-3">
        {items.length === 0 && !creating && <p className="text-sm text-muted-foreground">Aucune prestation pour le moment.</p>}

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
                <div className="text-sm font-medium text-foreground">{s.title}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.subtitle}</div>
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
            <Plus className="size-4" /> Ajouter une prestation
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
