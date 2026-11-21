"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardFooter } from "@/components/admin/ui/Card";
import { Input, Textarea, Select, Label, FieldGroup, FieldHint } from "@/components/admin/ui/Field";
import Dropzone from "@/components/admin/ui/Dropzone";
import Checkbox from "@/components/admin/ui/Checkbox";
import Button from "@/components/admin/ui/Button";

const CATEGORIES: Array<{ value: string; label: string }> = [
  { value: "CONSEILS", label: "Conseils" },
  { value: "CHANTIERS", label: "Chantiers" },
  { value: "INSPIRATIONS", label: "Inspirations" },
];

export type PostFormValues = {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage: string;
  featured: boolean;
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

export default function PostForm({
  initial,
  postId,
  uploadsEnabled,
}: {
  initial?: Partial<PostFormValues>;
  postId?: string;
  uploadsEnabled: boolean;
}) {
  const router = useRouter();
  const [values, setValues] = useState<PostFormValues>({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    category: initial?.category ?? CATEGORIES[0].value,
    excerpt: initial?.excerpt ?? "",
    content: initial?.content ?? "",
    coverImage: initial?.coverImage ?? "",
    featured: initial?.featured ?? false,
    published: initial?.published ?? true,
  });
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [busy, setBusy] = useState(false);

  function set<K extends keyof PostFormValues>(key: K, v: PostFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const url = postId ? `/api/admin/posts/${postId}` : "/api/admin/posts";
    const method = postId ? "PATCH" : "POST";
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
    if (!postId) {
      const data = await res.json();
      toast.success("Article créé.");
      router.push(`/admin/posts/${data.post.id}`);
    } else {
      toast.success("Article enregistré.");
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

          <Dropzone label="Photo de couverture" value={values.coverImage} onChange={(url) => set("coverImage", url)} uploadsEnabled={uploadsEnabled} />

          <FieldGroup>
            <Label htmlFor="excerpt">Résumé</Label>
            <Textarea id="excerpt" required value={values.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
            <FieldHint>Affiché dans la liste des articles et en aperçu sur l&apos;accueil.</FieldHint>
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="content">Contenu de l&apos;article</Label>
            <Textarea
              id="content"
              required
              value={values.content}
              onChange={(e) => set("content", e.target.value)}
              className="min-h-80 font-mono text-xs"
            />
            <FieldHint>Format Markdown : **gras**, *italique*, titres avec ##, listes avec -, liens avec [texte](url).</FieldHint>
          </FieldGroup>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
            <Checkbox id="featured" checked={values.featured} onChange={(v) => set("featured", v)} label="Mettre à la une (en haut de la page blog)" />
            <Checkbox id="published" checked={values.published} onChange={(v) => set("published", v)} label="Publié sur le site" />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" loading={busy}>
            {postId ? "Enregistrer" : "Créer l'article"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
