"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardFooter } from "@/components/admin/ui/Card";
import { Input, Textarea, Select, Label, FieldGroup, FieldHint } from "@/components/admin/ui/Field";
import Checkbox from "@/components/admin/ui/Checkbox";
import Button from "@/components/admin/ui/Button";

const CATEGORIES: Array<{ value: string; label: string }> = [
  { value: "CUISINES", label: "Cuisines" },
  { value: "MURS_TV", label: "Murs TV" },
  { value: "DRESSINGS", label: "Dressings" },
  { value: "SALONS", label: "Salons" },
  { value: "SALLES_DE_BAIN", label: "Salles de bain" },
];

export type ProjectFormValues = {
  title: string;
  slug: string;
  category: string;
  shortDesc: string;
  longDesc: string;
  featured: boolean;
  wide: boolean;
  published: boolean;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ProjectForm({
  initial,
  projectId,
}: {
  initial?: Partial<ProjectFormValues>;
  projectId?: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProjectFormValues>({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    category: initial?.category ?? CATEGORIES[0].value,
    shortDesc: initial?.shortDesc ?? "",
    longDesc: initial?.longDesc ?? "",
    featured: initial?.featured ?? false,
    wide: initial?.wide ?? false,
    published: initial?.published ?? true,
  });
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [busy, setBusy] = useState(false);

  function set<K extends keyof ProjectFormValues>(key: K, v: ProjectFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const url = projectId ? `/api/admin/projects/${projectId}` : "/api/admin/projects";
    const method = projectId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Une erreur est survenue.");
      setBusy(false);
      return;
    }
    if (!projectId) {
      const data = await res.json();
      toast.success("Réalisation créée.");
      router.push(`/admin/projects/${data.project.id}`);
    } else {
      toast.success("Réalisation enregistrée.");
      router.refresh();
    }
    setBusy(false);
  }

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardContent className="space-y-4">
          <FieldGroup>
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              required
              value={values.title}
              onChange={(e) => {
                set("title", e.target.value);
                if (!slugTouched) set("slug", slugify(e.target.value));
              }}
            />
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              required
              value={values.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", e.target.value);
              }}
            />
            <FieldHint>Utilisé dans l&apos;adresse de la page et comme identifiant dans la galerie.</FieldHint>
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="category">Catégorie</Label>
            <Select id="category" value={values.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="shortDesc">Description courte</Label>
            <Textarea id="shortDesc" required value={values.shortDesc} onChange={(e) => set("shortDesc", e.target.value)} />
            <FieldHint>Affichée dans la grille du portfolio.</FieldHint>
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="longDesc">Description détaillée</Label>
            <Textarea id="longDesc" required value={values.longDesc} onChange={(e) => set("longDesc", e.target.value)} />
            <FieldHint>Affichée dans l&apos;aperçu détaillé du projet.</FieldHint>
          </FieldGroup>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
            <Checkbox id="featured" checked={values.featured} onChange={(v) => set("featured", v)} label="Mettre en avant (carrousel d'accueil)" />
            <Checkbox id="wide" checked={values.wide} onChange={(v) => set("wide", v)} label="Vignette large dans la grille" />
            <Checkbox id="published" checked={values.published} onChange={(v) => set("published", v)} label="Publié sur le site" />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" loading={busy}>
            {projectId ? "Enregistrer" : "Créer la réalisation"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
