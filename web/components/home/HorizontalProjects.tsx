"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ensureGsap, gsap } from "@/lib/gsap";
import { isReducedMotion } from "@/lib/motion";
import { PROJECTS, pad } from "@/lib/data";
import Arrow from "@/components/icons/Arrow";
import { openLightbox } from "@/lib/lightbox";

const TRACK_INDICES = [0, 1, 2, 3, 4, 5, 6];

export default function HorizontalProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion() || !sectionRef.current || !trackRef.current) return;
    ensureGsap();
    const section = sectionRef.current;
    const track = trackRef.current;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 901px)", () => {
      const dist = () => track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + dist(),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    });

    mm.add("(max-width: 900px)", () => {
      track.querySelectorAll(".hcard").forEach((c) => {
        gsap.fromTo(
          c,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: c, start: "top 96%", once: true } }
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="hz ondark" id="hz" ref={sectionRef}>
      <div className="wrap top">
        <div>
          <div className="lab" style={{ color: "var(--lav)" }} data-up>
            (02) &nbsp;Réalisations
          </div>
          <h2 className="sf h2" style={{ marginTop: 24 }} data-split>
            <span className="ln">
              <span>Projets</span>
            </span>
            <span className="ln">
              <span>
                <em>choisis</em>
              </span>
            </span>
          </h2>
        </div>
        <p style={{ maxWidth: 360, fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,.75)" }} data-up>
          Faites défiler pour parcourir une sélection de cuisines, murs TV et dressings réalisés sur mesure.
        </p>
      </div>
      <div className="track" id="track" ref={trackRef}>
        {TRACK_INDICES.map((idx, k) => {
          const p = PROJECTS[idx];
          return (
            <button
              key={p.slug}
              type="button"
              className="hcard"
              data-lb={idx}
              data-cur="Voir"
              onClick={() => openLightbox(idx)}
            >
              <div className="im">
                <img src={`/img/${p.image}.jpg`} alt={p.alt} loading="lazy" />
                {p.gallery.length > 1 && <span className="pbadge">{p.gallery.length} photos</span>}
              </div>
              <div className="row">
                <div>
                  <div className="c">
                    {pad(k + 1)} &middot; {p.category}
                  </div>
                  <h3 className="sf">{p.title}</h3>
                  <p className="s">{p.shortDesc}</p>
                </div>
                <span className="go">
                  <Arrow />
                </span>
              </div>
            </button>
          );
        })}
        <div className="hz-end">
          <p className="sf" style={{ fontSize: 44, lineHeight: 1.1 }}>
            Et bien d&apos;autres réalisations à découvrir.
          </p>
          <Link href="/portfolio" className="btn wh mag" style={{ alignSelf: "flex-start" }}>
            <span className="t">
              <span>Tout le portfolio</span>
              <span>Tout le portfolio</span>
            </span>
            <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
