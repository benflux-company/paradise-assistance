"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ensureGsap, gsap } from "@/lib/gsap";
import { getLenis } from "@/lib/motion";
import { setLightboxHandler, getLightboxScope } from "@/lib/lightbox";
import { pad } from "@/lib/data";
import type { ProjectView } from "@/lib/queries";
import Arrow from "@/components/icons/Arrow";

export default function Lightbox({ projects }: { projects: ProjectView[] }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  // Logic reads/writes this ref synchronously (fine in handlers/effects).
  // `nav` state mirrors it for render — refs must never be read during render.
  const state = useRef({
    lbSlug: "",
    lbImg: 0,
    lbList: [] as string[],
  });
  const [nav, setNav] = useState({ lbSlug: "", lbList: [] as string[] });
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [activeThumb, setActiveThumb] = useState(0);

  function findProject(slug: string) {
    return projects.find((p) => p.slug === slug) ?? null;
  }

  function renderPhoto(j: number) {
    const p = findProject(state.current.lbSlug);
    if (!p) return;
    state.current.lbImg = j;
    const src = p.gallery[j];
    const sw = () => {
      if (imgRef.current) {
        imgRef.current.src = src;
        imgRef.current.alt = p.alt + (p.gallery.length > 1 ? ` (photo ${j + 1})` : "");
      }
    };
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ensureGsap();
      gsap.to(imgRef.current, {
        opacity: 0,
        duration: 0.25,
        onComplete: () => {
          sw();
          gsap.to(imgRef.current, { opacity: 1, duration: 0.5 });
        },
      });
    } else {
      sw();
    }
    setActiveThumb(j);
  }

  function showProject(slug: string, dir?: number) {
    const p = findProject(slug);
    if (!p) return;
    state.current.lbSlug = slug;
    state.current.lbImg = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const set = () => {
      if (imgRef.current) {
        imgRef.current.src = p.gallery[0];
        imgRef.current.alt = p.alt;
      }
      if (titleRef.current) titleRef.current.textContent = p.title;
      setThumbs(p.gallery);
      setActiveThumb(0);
      if (descRef.current) descRef.current.textContent = p.longDesc;
      setNav({ lbSlug: state.current.lbSlug, lbList: state.current.lbList });
    };

    if (!reduced && dir) {
      ensureGsap();
      gsap.to(imgRef.current, {
        opacity: 0,
        x: -40 * dir,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => {
          set();
          gsap.fromTo(imgRef.current, { opacity: 0, x: 40 * dir }, { opacity: 1, x: 0, duration: 0.7, ease: "expo.out" });
        },
      });
      gsap.fromTo(
        [titleRef.current, descRef.current],
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.3, stagger: 0.06, ease: "expo.out" }
      );
    } else {
      set();
    }
  }

  function openAt(slug: string) {
    lastFocusRef.current = document.activeElement as HTMLElement;
    const scope = getLightboxScope();
    state.current.lbList = scope && scope.includes(slug) ? scope.slice() : projects.map((p) => p.slug);
    showProject(slug);
    setOpen(true);
    const curState = (window as unknown as { __curState?: (el: Element | null) => void }).__curState;
    curState?.(null);
    getLenis()?.stop();
    // eslint-disable-next-line react-hooks/immutability -- document.body is a real external DOM node, not component state
    document.body.style.overflow = "hidden";
  }

  function close() {
    const done = () => {
      setOpen(false);
      getLenis()?.start();
      document.body.style.overflow = "";
      lastFocusRef.current?.focus();
    };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && rootRef.current) {
      ensureGsap();
      gsap.to(rootRef.current, { clipPath: "inset(0 0 100% 0)", duration: 0.7, ease: "expo.inOut", onComplete: done });
    } else {
      done();
    }
  }

  function step(d: number) {
    const list = state.current.lbList;
    const p = list.indexOf(state.current.lbSlug);
    showProject(list[(p + d + list.length) % list.length], d);
  }

  useEffect(() => {
    setLightboxHandler(openAt);
    return () => setLightboxHandler(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open || !rootRef.current) return;
    document.getElementById("lbx")?.focus();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    ensureGsap();
    const root = rootRef.current;
    gsap.fromTo(root, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 0.9, ease: "expo.inOut" });
    gsap.fromTo(imgRef.current, { scale: 1.15, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, delay: 0.4, ease: "expo.out" });
    gsap.from(root.querySelectorAll(".side > *"), { opacity: 0, y: 24, stagger: 0.06, duration: 0.8, delay: 0.5, ease: "expo.out" });
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "Tab") {
        const focusable = Array.from(rootRef.current?.querySelectorAll<HTMLElement>("button,a") ?? []);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const touchX = useRef<number | null>(null);

  const p = nav.lbSlug ? findProject(nav.lbSlug) : null;
  const pos = p ? nav.lbList.indexOf(nav.lbSlug) : -1;

  return (
    <div id="lb" className={open ? "open" : undefined} role="dialog" aria-modal="true" aria-label="Aperçu du projet" ref={rootRef}>
      <div
        className="stage"
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        <img id="lbi" ref={imgRef} src={thumbs[activeThumb] ?? undefined} alt="" />
      </div>
      <div className="side">
        <div className="cnt" id="lbn">
          Projet {pad(pos + 1)} / {pad(nav.lbList.length)}
        </div>
        <div>
          <div className="lab c" id="lbc">
            {p?.category}
          </div>
          <h3 className="sf" id="lbt" style={{ marginTop: 14 }} ref={titleRef}>
            {p?.title}
          </h3>
        </div>
        <p id="lbd" ref={descRef}>
          {p?.longDesc}
        </p>
        <div>
          <div className="lab" id="lbpc" style={{ color: "var(--lav)", marginBottom: 12 }}>
            {thumbs.length > 1 ? `Photo ${activeThumb + 1} / ${thumbs.length}` : ""}
          </div>
          <div className="th" id="lbth" hidden={thumbs.length < 2}>
            {thumbs.map((src, j) => (
              <button key={src} type="button" aria-label={`Photo ${j + 1}`} aria-current={j === activeThumb} onClick={() => renderPhoto(j)}>
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </div>
        <div className="nv">
          <button className="arr" type="button" id="lbp" aria-label="Projet précédent" onClick={() => step(-1)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <path d="M20 12H5M11 6l-6 6 6 6" />
            </svg>
          </button>
          <button className="arr" type="button" id="lbx2" aria-label="Projet suivant" onClick={() => step(1)}>
            <Arrow width={18} height={18} />
          </button>
          <Link href="/contact" className="btn wh sm" id="lbq" style={{ marginLeft: "auto" }} onClick={close}>
            <span className="t">
              <span>Projet similaire</span>
              <span>Projet similaire</span>
            </span>
          </Link>
        </div>
      </div>
      <button className="arr x" type="button" id="lbx" aria-label="Fermer" onClick={close}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  );
}
