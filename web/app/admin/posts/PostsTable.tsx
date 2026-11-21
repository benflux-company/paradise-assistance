"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowUp, ArrowDown, Pencil, Trash2 } from "lucide-react";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/admin/ui/Table";
import Button from "@/components/admin/ui/Button";
import Badge from "@/components/admin/ui/Badge";
import { useConfirm } from "@/components/admin/ui/ConfirmDialog";

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
  const confirm = useConfirm();
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
    toast.success(row.published ? "Article repassé en brouillon." : "Article publié.");
  }

  async function remove(row: Row) {
    const ok = await confirm({
      title: "Supprimer cet article ?",
      description: `« ${row.title} » sera supprimé définitivement du blog.`,
      confirmLabel: "Supprimer",
      destructive: true,
    });
    if (!ok) return;
    setBusyId(row.id);
    await fetch(`/api/admin/posts/${row.id}`, { method: "DELETE" });
    setRows((r) => r.filter((x) => x.id !== row.id));
    setBusyId(null);
    toast.success("Article supprimé.");
  }

  if (rows.length === 0) return <p className="text-sm text-muted-foreground">Aucun article pour le moment.</p>;

  return (
    <Table>
      <Thead>
        <tr>
          <Th />
          <Th>Photo</Th>
          <Th>Titre</Th>
          <Th>Catégorie</Th>
          <Th>À la une</Th>
          <Th>Statut</Th>
          <Th />
        </tr>
      </Thead>
      <Tbody>
        {rows.map((row, i) => (
          <Tr key={row.id}>
            <Td>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Monter">
                  <ArrowUp className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => move(i, 1)} disabled={i === rows.length - 1} aria-label="Descendre">
                  <ArrowDown className="size-4" />
                </Button>
              </div>
            </Td>
            <Td>{row.cover ? <img className="size-11 rounded-md object-cover" src={row.cover} alt="" /> : "—"}</Td>
            <Td className="font-medium">{row.title}</Td>
            <Td>{CATEGORY_LABELS[row.category] ?? row.category}</Td>
            <Td>{row.featured ? <Badge variant="success">Oui</Badge> : <Badge variant="muted">Non</Badge>}</Td>
            <Td>
              <button type="button" onClick={() => togglePublished(row)} disabled={busyId === row.id}>
                <Badge variant={row.published ? "success" : "warning"} className="cursor-pointer">
                  {row.published ? "Publié" : "Brouillon"}
                </Badge>
              </button>
            </Td>
            <Td>
              <div className="flex items-center justify-end gap-1">
                <Link href={`/admin/posts/${row.id}`}>
                  <Button variant="ghost" size="icon" aria-label="Modifier">
                    <Pencil className="size-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => remove(row)} disabled={busyId === row.id} aria-label="Supprimer">
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
