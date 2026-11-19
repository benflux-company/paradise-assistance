"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageField from "../ImageField";

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
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function set<K extends keyof PostFormValues>(key: K, v: PostFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
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
      setError(data.error ?? "Une erreur est survenue.");
      setBusy(false);
      return;
    }
    if (!postId) {
      const data = await res.json();
      router.push(`/admin/posts/${data.post.id}`);
    } else {
      router.refresh();
    }
    setBusy(false);
  }

  return (
    <form className="adm-form" onSubmit={onSubmit} style={{ maxWidth: 820 }}>
      {error && <div className="adm-error">{error}</div>}

      <div className="adm-field">
        <label htmlFor="title">Titre</label>
        <input
          id="title"
          type="text"
          required
          value={values.title}
          onChange={(e) => {
            set("title", e.target.value);
            if (!slugTouched) set("slug", slugify(e.target.value));
          }}
        />
      </div>

      <div className="adm-field">
        <label htmlFor="slug">Slug (URL)</label>
        <input
          id="slug"
          type="text"
          required
          value={values.slug}
          onChange={(e) => {
            setSlugTouched(true);
            set("slug", e.target.value);
          }}
        />
      </div>

      <div className="adm-field">
        <label htmlFor="category">Catégorie</label>
        <select id="category" value={values.category} onChange={(e) => set("category", e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <ImageField label="Photo de couverture" value={values.coverImage} onChange={(url) => set("coverImage", url)} uploadsEnabled={uploadsEnabled} />

      <div className="adm-field">
        <label htmlFor="excerpt">Résumé</label>
        <textarea id="excerpt" required value={values.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
        <div className="hint">Affiché dans la liste des articles et en aperçu sur l&apos;accueil.</div>
      </div>

      <div className="adm-field">
        <label htmlFor="content">Contenu de l&apos;article</label>
        <textarea
          id="content"
          required
          value={values.content}
          onChange={(e) => set("content", e.target.value)}
          style={{ minHeight: 320, fontFamily: "monospace", fontSize: 13 }}
        />
        <div className="hint">
          Format Markdown : **gras**, *italique*, titres avec ##, listes avec -, liens avec [texte](url).
        </div>
      </div>

      <div className="adm-field row">
        <input id="featured" type="checkbox" checked={values.featured} onChange={(e) => set("featured", e.target.checked)} />
        <label htmlFor="featured">Mettre à la une (en haut de la page blog)</label>
      </div>

      <div className="adm-field row">
        <input id="published" type="checkbox" checked={values.published} onChange={(e) => set("published", e.target.checked)} />
        <label htmlFor="published">Publié sur le site</label>
      </div>

      <div className="adm-form-actions">
        <button type="submit" className="adm-btn primary" disabled={busy}>
          {busy ? "Enregistrement…" : postId ? "Enregistrer" : "Créer l'article"}
        </button>
      </div>
    </form>
  );
}
