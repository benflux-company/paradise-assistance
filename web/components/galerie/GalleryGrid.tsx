"use client";

import { useMemo, useState } from "react";
import FadeImg from "@/components/FadeImg";
import { openLightbox, setLightboxScope } from "@/lib/lightbox";
import type { ProjectView } from "@/lib/queries";

type Photo = {
  url: string;
  alt: string;
  title: string;
  category: string;
  slug: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  CUISINES: "Cuisines",
  MURS_TV: "Murs TV",
  DRESSINGS: "Dressings",
  SALONS: "Salons",
  SALLES_DE_BAIN: "Salles de bain",
};

export default function GalleryGrid({ projects }: { projects: ProjectView[] }) {
  const [query, setQuery] = useState("");

  const photos: Photo[] = useMemo(
    () =>
      projects.flatMap((p) =>
        p.gallery.map((url) => ({
          url,
          alt: p.title,
          title: p.title,
          category: p.category,
          slug: p.slug,
        }))
      ),
    [projects]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return photos;
    return photos.filter(
      (p) => p.title.toLowerCase().includes(q) || (CATEGORY_LABELS[p.category] ?? p.category).toLowerCase().includes(q)
    );
  }, [photos, query]);

  function openPhoto(slug: string) {
    setLightboxScope(projects.map((p) => p.slug));
    openLightbox(slug);
  }

  return (
    <section style={{ paddingBottom: 140 }}>
      <div className="wrap">
        <div className="gsearch">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher : cuisine, mur TV, bois, marbre…"
            aria-label="Rechercher dans la galerie"
          />
          <span className="gcount">
            {filtered.length} photo{filtered.length > 1 ? "s" : ""}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="adm-empty" style={{ padding: "80px 0" }}>
            Aucune photo ne correspond à « {query} ».
          </div>
        ) : (
          <div className="gmasonry">
            {filtered.map((p, i) => (
              <button
                key={`${p.slug}-${i}`}
                type="button"
                className="g-item"
                onClick={() => openPhoto(p.slug)}
                aria-label={`Voir ${p.title}`}
              >
                <FadeImg src={p.url} alt={p.alt} loading="lazy" />
                <span className="g-cap">{p.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
