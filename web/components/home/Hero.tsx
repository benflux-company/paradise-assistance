"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, gsap } from "@/lib/gsap";
import { isReducedMotion, isTouchViewport } from "@/lib/motion";
import { pad } from "@/lib/data";
import type { HeroSlideView } from "@/lib/queries";
import Arrow from "@/components/icons/Arrow";

export default function Hero({
  slides,
  eyebrow,
  titleLine1,
  titleLine2,
  intro,
}: {
  slides: HeroSlideView[];
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  intro: string;
}) {
  const heroRef = useRef<HTMLElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const capTextRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const trkRef = useRef<HTMLSpanElement>(null);
  const ctRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion()) return;
    ensureGsap();
    const touch = isTouchViewport();
    const HS = slideRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!HS.length) return;
    const state = { hi: 0, paused: false, timer: null as gsap.core.Tween | null };
    let disposed = false;

    function htimer() {
      if (state.timer) state.timer.kill();
      const tl = gsap.fromTo(
        trkRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 6,
          ease: "none",
          onComplete: () => {
            if (!disposed) hgo(state.hi + 1, 1);
          },
        }
      );
      state.timer = tl;
      if (state.paused) tl.pause();
    }

    function hgo(n: number, dir: number) {
      const prev = HS[state.hi];
      state.hi = ((n % HS.length) + HS.length) % HS.length;
      const cur = HS[state.hi];
      if (numRef.current) numRef.current.textContent = `${pad(state.hi + 1)} / ${pad(HS.length)}`;

      gsap.set(cur, {
        visibility: "visible",
        opacity: 1,
        zIndex: 3,
        clipPath: dir < 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)",
      });
      gsap.set(prev, { zIndex: 2 });
      HS.forEach((s) => {
        if (s !== cur && s !== prev) gsap.set(s, { zIndex: 0 });
      });

      const media = cur.querySelector("img,video");
      gsap.fromTo(media, { scale: 1.3 }, { scale: 1.12, duration: 2, ease: "expo.out" });

      gsap.to(cur, {
        clipPath: "inset(0 0% 0 0%)",
        duration: 1.4,
        ease: "expo.inOut",
        onComplete: () => {
          prev.classList.remove("on");
          gsap.set(prev, { visibility: "hidden", opacity: 0, zIndex: 0 });
          gsap.set(cur, { zIndex: 1 });
          cur.classList.add("on");
        },
      });

      gsap.fromTo(
        capTextRef.current,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          delay: 0.5,
          ease: "expo.out",
          onStart: () => {
            if (capTextRef.current) capTextRef.current.textContent = slides[state.hi].caption;
          },
        }
      );
      htimer();
    }

    gsap.fromTo(".hero .sl.on img,.hero .sl.on video", { scale: 1.35 }, { scale: 1.12, duration: 2.6, ease: "expo.out" });

    const scrollTweens: gsap.core.Tween[] = [];
    if (!touch && heroRef.current) {
      scrollTweens.push(
        gsap.to(ctRef.current, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true },
        })
      );
      scrollTweens.push(
        gsap.to(
          HS.map((s) => s.querySelector("img,video")),
          { yPercent: 12, ease: "none", scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true } }
        )
      );
    }

    htimer();

    const onNext = () => hgo(state.hi + 1, 1);
    const onPrev = () => hgo(state.hi - 1, -1);
    const onFocusIn = () => {
      state.paused = true;
      state.timer?.pause();
    };
    const onFocusOut = () => {
      state.paused = false;
      state.timer?.resume();
    };
    const heroEl = heroRef.current;
    const nextBtn = heroEl?.querySelector("#hnext");
    const prevBtn = heroEl?.querySelector("#hprev");
    nextBtn?.addEventListener("click", onNext);
    prevBtn?.addEventListener("click", onPrev);
    heroEl?.addEventListener("focusin", onFocusIn);
    heroEl?.addEventListener("focusout", onFocusOut);

    return () => {
      disposed = true;
      state.timer?.kill();
      scrollTweens.forEach((t) => t.scrollTrigger?.kill());
      nextBtn?.removeEventListener("click", onNext);
      prevBtn?.removeEventListener("click", onPrev);
      heroEl?.removeEventListener("focusin", onFocusIn);
      heroEl?.removeEventListener("focusout", onFocusOut);
    };
  }, [slides]);

  return (
    <section className="hero ondark" aria-label="Présentation" ref={heroRef}>
      {slides.map((slide, i) => (
        <div
          key={slide.image + slide.caption}
          className={`sl${i === 0 ? " on" : ""}`}
          ref={(el) => {
            slideRefs.current[i] = el;
          }}
        >
          {slide.video ? (
            <video
              src={slide.video}
              poster={slide.image}
              autoPlay
              muted
              loop
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <img src={slide.image} alt={slide.alt} />
          )}
        </div>
      ))}
      <div className="ov"></div>
      <div className="cap" id="hcap">
        <div className="lab" style={{ opacity: 0.75 }}>
          Projet
        </div>
        <div className="sf" style={{ fontSize: 24, letterSpacing: 0, textTransform: "none", marginTop: 6 }} ref={capTextRef}>
          {slides[0]?.caption}
        </div>
      </div>
      <div className="ct" ref={ctRef}>
        <div className="wrap">
          <div className="lab" data-hi style={{ marginBottom: 28, opacity: 0.9 }}>
            {eyebrow}
          </div>
          <h1 className="sf" data-split>
            <span className="ln">
              <span>{titleLine1}</span>
            </span>
            <span className="ln">
              <span>
                <em>{titleLine2}</em>
              </span>
            </span>
          </h1>
          <div className="meta" data-hi>
            <p>{intro}</p>
            <div className="hctl">
              <button className="arr" type="button" id="hprev" aria-label="Image précédente">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                  <path d="M20 12H5M11 6l-6 6 6 6" />
                </svg>
              </button>
              <span className="num" ref={numRef} id="hnum">
                {pad(1)} / {pad(slides.length)}
              </span>
              <span className="trk">
                <i ref={trkRef} id="htrk"></i>
              </span>
              <button className="arr" type="button" id="hnext" aria-label="Image suivante">
                <Arrow width={18} height={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="scr">
        <i></i>
      </div>
    </section>
  );
}
