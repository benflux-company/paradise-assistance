"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function set<K extends keyof ProjectFormValues>(key: K, v: ProjectFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
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
      setError(data.error ?? "Une erreur est survenue.");
      setBusy(false);
      return;
    }
    if (!projectId) {
      const data = await res.json();
      router.push(`/admin/projects/${data.project.id}`);
    } else {
      router.refresh();
    }
    setBusy(false);
  }

  return (
    <form className="adm-form" onSubmit={onSubmit}>
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
        <div className="hint">Utilisé dans l&apos;adresse de la page et comme identifiant dans la galerie.</div>
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

      <div className="adm-field">
        <label htmlFor="shortDesc">Description courte</label>
        <textarea
          id="shortDesc"
          required
          value={values.shortDesc}
          onChange={(e) => set("shortDesc", e.target.value)}
        />
        <div className="hint">Affichée dans la grille du portfolio.</div>
      </div>

      <div className="adm-field">
        <label htmlFor="longDesc">Description détaillée</label>
        <textarea id="longDesc" required value={values.longDesc} onChange={(e) => set("longDesc", e.target.value)} />
        <div className="hint">Affichée dans l&apos;aperçu détaillé du projet.</div>
      </div>

      <div className="adm-field row">
        <input
          id="featured"
          type="checkbox"
          checked={values.featured}
          onChange={(e) => set("featured", e.target.checked)}
        />
        <label htmlFor="featured">Mettre en avant (carrousel d&apos;accueil)</label>
      </div>

      <div className="adm-field row">
        <input id="wide" type="checkbox" checked={values.wide} onChange={(e) => set("wide", e.target.checked)} />
        <label htmlFor="wide">Vignette large dans la grille</label>
      </div>

      <div className="adm-field row">
        <input
          id="published"
          type="checkbox"
          checked={values.published}
          onChange={(e) => set("published", e.target.checked)}
        />
        <label htmlFor="published">Publié sur le site</label>
      </div>

      <div className="adm-form-actions">
        <button type="submit" className="adm-btn primary" disabled={busy}>
          {busy ? "Enregistrement…" : projectId ? "Enregistrer" : "Créer la réalisation"}
        </button>
      </div>
    </form>
  );
}
