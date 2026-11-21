"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowUp, ArrowDown, Pencil, Trash2, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/admin/ui/Card";
import { Input, Textarea, Label, FieldGroup } from "@/components/admin/ui/Field";
import Button from "@/components/admin/ui/Button";
import { useConfirm } from "@/components/admin/ui/ConfirmDialog";

type Faq = { id: string; question: string; answer: string };

export default function FaqManager({ initial }: { initial: Faq[] }) {
  const confirm = useConfirm();
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ question: string; answer: string }>({ question: "", answer: "" });
  const [creating, setCreating] = useState(false);
  const [newDraft, setNewDraft] = useState({ question: "", answer: "" });
  const [busy, setBusy] = useState(false);

  function startEdit(f: Faq) {
    setEditing(f.id);
    setDraft({ question: f.question, answer: f.answer });
  }

  async function saveEdit(id: string) {
    setBusy(true);
    const res = await fetch(`/api/admin/faqs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    if (!res.ok) {
      toast.error("Échec de l'enregistrement.");
    } else {
      setItems((prev) => prev.map((f) => (f.id === id ? { ...f, ...draft } : f)));
      setEditing(null);
      toast.success("Question mise à jour.");
    }
    setBusy(false);
  }

  async function createFaq() {
    if (!newDraft.question.trim() || !newDraft.answer.trim()) return;
    setBusy(true);
    const res = await fetch("/api/admin/faqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDraft),
    });
    if (!res.ok) {
      toast.error("Échec de la création.");
    } else {
      const data = await res.json();
      setItems((prev) => [...prev, { id: data.faq.id, question: data.faq.question, answer: data.faq.answer }]);
      setNewDraft({ question: "", answer: "" });
      setCreating(false);
      toast.success("Question ajoutée.");
    }
    setBusy(false);
  }

  async function remove(f: Faq) {
    const ok = await confirm({
      title: "Supprimer cette question ?",
      description: `« ${f.question} » sera retirée définitivement de la FAQ du site.`,
      confirmLabel: "Supprimer",
      destructive: true,
    });
    if (!ok) return;
    setBusy(true);
    await fetch(`/api/admin/faqs/${f.id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((item) => item.id !== f.id));
    setBusy(false);
    toast.success("Question supprimée.");
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
    <Card>
      <CardContent className="space-y-3">
        {items.length === 0 && !creating && <p className="text-sm text-muted-foreground">Aucune question pour le moment.</p>}

        {items.map((f, i) =>
          editing === f.id ? (
            <div key={f.id} className="rounded-lg border border-border bg-muted/40 p-4 space-y-3">
              <FieldGroup>
                <Label>Question</Label>
                <Input value={draft.question} onChange={(e) => setDraft((d) => ({ ...d, question: e.target.value }))} />
              </FieldGroup>
              <FieldGroup>
                <Label>Réponse</Label>
                <Textarea value={draft.answer} onChange={(e) => setDraft((d) => ({ ...d, answer: e.target.value }))} />
              </FieldGroup>
              <div className="flex gap-2">
                <Button size="sm" loading={busy} onClick={() => saveEdit(f.id)}>
                  Enregistrer
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditing(null)}>
                  Annuler
                </Button>
              </div>
            </div>
          ) : (
            <div key={f.id} className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-foreground">{f.question}</div>
                <div className="mt-1 text-sm text-muted-foreground">{f.answer}</div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Monter">
                  <ArrowUp className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Descendre">
                  <ArrowDown className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => startEdit(f)} aria-label="Modifier">
                  <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => remove(f)} disabled={busy} aria-label="Supprimer">
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
          )
        )}

        {creating ? (
          <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-3">
            <FieldGroup>
              <Label>Question</Label>
              <Input value={newDraft.question} onChange={(e) => setNewDraft((d) => ({ ...d, question: e.target.value }))} />
            </FieldGroup>
            <FieldGroup>
              <Label>Réponse</Label>
              <Textarea value={newDraft.answer} onChange={(e) => setNewDraft((d) => ({ ...d, answer: e.target.value }))} />
            </FieldGroup>
            <div className="flex gap-2">
              <Button size="sm" loading={busy} onClick={createFaq}>
                Ajouter
              </Button>
              <Button size="sm" variant="outline" onClick={() => setCreating(false)}>
                Annuler
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setCreating(true)}>
            <Plus className="size-4" /> Ajouter une question
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
