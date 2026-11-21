"use client";

import { Fragment, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/admin/ui/Table";
import { Select, Textarea, Label, FieldGroup } from "@/components/admin/ui/Field";
import Button from "@/components/admin/ui/Button";
import Badge from "@/components/admin/ui/Badge";
import { useConfirm } from "@/components/admin/ui/ConfirmDialog";

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

const STATUS_BADGE: Record<string, "warning" | "muted" | "success"> = {
  NOUVEAU: "warning",
  EN_COURS: "muted",
  TRAITE: "success",
  ARCHIVE: "muted",
};

export default function RequestsTable({ requests }: { requests: Row[] }) {
  const confirm = useConfirm();
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
    toast.success("Statut mis à jour.");
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
    toast.success("Note enregistrée.");
  }

  async function remove(row: Row) {
    const ok = await confirm({
      title: "Supprimer cette demande ?",
      description: `La demande de « ${row.name} » sera supprimée définitivement, note interne comprise.`,
      confirmLabel: "Supprimer",
      destructive: true,
    });
    if (!ok) return;
    setBusyId(row.id);
    await fetch(`/api/admin/contact-requests/${row.id}`, { method: "DELETE" });
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    setBusyId(null);
    toast.success("Demande supprimée.");
  }

  if (rows.length === 0) return <p className="text-sm text-muted-foreground">Aucune demande pour le moment.</p>;

  return (
    <Table>
      <Thead>
        <tr>
          <Th>Date</Th>
          <Th>Nom</Th>
          <Th>Contact</Th>
          <Th>Projet</Th>
          <Th>Statut</Th>
          <Th />
        </tr>
      </Thead>
      <Tbody>
        {rows.map((row) => (
          <Fragment key={row.id}>
            <Tr>
              <Td className="whitespace-nowrap">{new Date(row.createdAt).toLocaleDateString("fr-FR")}</Td>
              <Td>{row.name}</Td>
              <Td>{row.contact}</Td>
              <Td>
                {row.projectType}
                <div className="mt-0.5 text-xs text-muted-foreground">{row.budget}</div>
              </Td>
              <Td>
                <div className="flex items-center gap-2">
                  <Badge variant={STATUS_BADGE[row.status]}>{STATUS_LABELS[row.status]}</Badge>
                  <Select
                    value={row.status}
                    onChange={(e) => updateStatus(row.id, e.target.value)}
                    disabled={busyId === row.id}
                    className="h-8 w-auto text-xs"
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Select>
                </div>
              </Td>
              <Td>
                <div className="flex items-center justify-end gap-1">
                  <Button size="sm" variant="outline" onClick={() => toggle(row)}>
                    {open === row.id ? "Fermer" : "Détails"}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(row)} disabled={busyId === row.id} aria-label="Supprimer">
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </Td>
            </Tr>
            {open === row.id && (
              <Tr>
                <Td colSpan={6} className="bg-muted/40">
                  <div className="space-y-3 py-2">
                    <div>
                      <span className="text-xs font-medium text-foreground">Message</span>
                      <p className="mt-1 text-sm text-muted-foreground">{row.message}</p>
                    </div>
                    <FieldGroup>
                      <Label>Note interne</Label>
                      <Textarea value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} />
                    </FieldGroup>
                    <Button size="sm" loading={busyId === row.id} onClick={() => saveNote(row.id)}>
                      Enregistrer la note
                    </Button>
                  </div>
                </Td>
              </Tr>
            )}
          </Fragment>
        ))}
      </Tbody>
    </Table>
  );
}
