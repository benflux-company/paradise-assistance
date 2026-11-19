"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ensureGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { isReducedMotion } from "@/lib/motion";
import { POSTS, type PostCategory } from "@/lib/data";
import BlogCard from "@/components/BlogCard";

const CATEGORIES: ("Tous" | PostCategory)[] = ["Tous", "Conseils", "Chantiers", "Inspirations"];

export default function BlogList() {
  const [bf, setBf] = useState<(typeof CATEGORIES)[number]>("Tous");
  const [bq, setBq] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);

  const list = useMemo(() => {
    const q = bq.toLowerCase();
    return POSTS.filter(
      (b) => b.id !== 1 && (bf === "Tous" || b.category === bf) && (!q || (b.title + " " + b.excerpt).toLowerCase().includes(q))
    );
  }, [bf, bq]);

  useEffect(() => {
    if (isReducedMotion() || !gridRef.current) return;
    ensureGsap();
    const cards = gridRef.current.querySelectorAll(".bcard");
    const tw = gsap.fromTo(cards, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "expo.out" });
    ScrollTrigger.refresh();
    return () => {
      tw.kill();
    };
  }, [list]);

  return (
    <section style={{ paddingBottom: 160 }}>
      <div className="wrap">
        <div className="fbar">
          <div className="fl" id="bf" role="group" aria-label="Filtrer les articles">
            {CATEGORIES.map((c) => (
              <button key={c} type="button" className="chip" aria-pressed={c === bf} onClick={() => setBf(c)}>
                {c}
              </button>
            ))}
          </div>
          <div className="srch">
            <label htmlFor="bq" className="lab" style={{ position: "absolute", left: -9999 }}>
              Rechercher un article
            </label>
            <input id="bq" type="search" placeholder="Rechercher un article" value={bq} onChange={(e) => setBq(e.target.value)} />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
          </div>
        </div>
        <div className="bgrid" id="bgrid" ref={gridRef}>
          {list.length ? (
            list.map((post) => <BlogCard key={post.id} post={post} />)
          ) : (
            <p className="empty sf">Aucun article ne correspond à cette recherche.</p>
          )}
        </div>
      </div>
    </section>
  );
}
