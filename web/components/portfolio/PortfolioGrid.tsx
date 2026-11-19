"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ensureGsap, gsap, Flip, ScrollTrigger } from "@/lib/gsap";
import { isReducedMotion } from "@/lib/motion";
import { PROJECT_CATEGORIES, pad } from "@/lib/data";
import type { ProjectView } from "@/lib/queries";
import { openLightbox, setLightboxScope } from "@/lib/lightbox";

type FlipMode = "filter" | "view";

export default function PortfolioGrid({ projects }: { projects: ProjectView[] }) {
  const [pf, setPf] = useState<(typeof PROJECT_CATEGORIES)[number]>("Tous");
  const [view, setView] = useState<"grid" | "list">("grid");
  const gridRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const flipMode = useRef<FlipMode | null>(null);

  const shownSlugs = useMemo(
    () => projects.filter((p) => pf === "Tous" || p.category === pf).map((p) => p.slug),
    [projects, pf]
  );
  const shownSet = useMemo(() => new Set(shownSlugs), [shownSlugs]);

  useEffect(() => {
    setLightboxScope(shownSlugs);
    return () => setLightboxScope(null);
  }, [shownSlugs]);

  function captureFlip(mode: FlipMode) {
    if (isReducedMotion() || !gridRef.current) return;
    ensureGsap();
    flipState.current = Flip.getState(gridRef.current.querySelectorAll(".pitem"));
    flipMode.current = mode;
  }

  function changeFilter(v: (typeof PROJECT_CATEGORIES)[number]) {
    captureFlip("filter");
    setPf(v);
  }

  function changeView(v: "grid" | "list") {
    captureFlip("view");
    setView(v);
  }

  useLayoutEffect(() => {
    if (!flipState.current || !flipMode.current) return;
    const state = flipState.current;
    const mode = flipMode.current;
    flipState.current = null;
    flipMode.current = null;
    if (mode === "filter") {
      Flip.from(state, {
        duration: 0.9,
        ease: "expo.inOut",
        absolute: true,
        scale: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" }),
        onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.4 }),
        onComplete: () => ScrollTrigger.refresh(),
      });
    } else {
      Flip.from(state, {
        duration: 0.9,
        ease: "expo.inOut",
        absolute: true,
        onComplete: () => ScrollTrigger.refresh(),
      });
    }
  }, [pf, view]);

  return (
    <section style={{ paddingBottom: 160 }}>
      <div className="wrap">
        <div className="fbar">
          <div className="fl" id="pf" role="group" aria-label="Filtrer les projets">
            {PROJECT_CATEGORIES.map((c) => (
              <button key={c} type="button" className="chip" aria-pressed={c === pf} onClick={() => changeFilter(c)}>
                {c}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span id="pc" style={{ fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--muted)" }} aria-live="polite">
              {pad(shownSlugs.length)}
              {shownSlugs.length > 1 ? " projets" : " projet"}
            </span>
            <div className="vtog" role="group" aria-label="Affichage">
              <button type="button" id="vg" aria-pressed={view === "grid"} aria-label="Affichage en grille" onClick={() => changeView("grid")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              </button>
              <button type="button" id="vl" aria-pressed={view === "list"} aria-label="Affichage en liste" onClick={() => changeView("list")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                  <path d="M3 6h18M3 12h18M3 18h18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className={`pgrid${view === "list" ? " list" : ""}`} id="pgrid" ref={gridRef}>
          {projects.map((p, k) => (
            <button
              key={p.slug}
              type="button"
              className={`pitem${p.wide ? " wide" : ""}`}
              data-lb={p.slug}
              data-c={p.category}
              data-cur="Voir"
              hidden={!shownSet.has(p.slug)}
              onClick={() => openLightbox(p.slug)}
            >
              <div className="im">
                <img src={p.image} alt={p.alt} loading="lazy" />
                <div className="hv">
                  <span>Voir le projet</span>
                </div>
                {p.gallery.length > 1 && <span className="pbadge">{p.gallery.length} photos</span>}
              </div>
              <div className="row">
                <div>
                  <h3 className="sf">{p.title}</h3>
                  <div className="c">{p.category}</div>
                  <p className="s">{p.shortDesc}</p>
                </div>
                <span className="n">{pad(k + 1)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
