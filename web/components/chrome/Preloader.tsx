"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ensureGsap, gsap } from "@/lib/gsap";
import { isReducedMotion } from "@/lib/motion";

const KEY = "pa-visited";

export default function Preloader() {
  const [show, setShow] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage is only readable client-side
    if (sessionStorage.getItem(KEY)) setShow(false);
  }, []);

  useEffect(() => {
    if (!show) return;
    const pre = rootRef.current;
    if (!pre) return;

    function markVisited() {
      sessionStorage.setItem(KEY, "1");
    }

    if (isReducedMotion()) {
      markVisited();
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reduced-motion skips the preloader entirely
      setShow(false);
      return;
    }

    ensureGsap();
    const heroImgs = Array.from(document.querySelectorAll<HTMLImageElement>(".hero img"));
    const imgs = heroImgs.length
      ? heroImgs
      : Array.from(document.images).filter((im) => im.loading !== "lazy");
    let loaded = 0;
    let done = false;
    const barI = pre.querySelector(".bar i");
    const nEl = pre.querySelector(".n");
    const progObj = { v: 0 };

    gsap.to(pre.querySelector("img"), { opacity: 1, duration: 1, ease: "power2.out" });

    const target = () => (imgs.length ? Math.round((loaded / imgs.length) * 100) : 100);
    const upd = gsap.to(progObj, {
      v: 100,
      duration: 1.8,
      ease: "power2.inOut",
      paused: true,
      onUpdate: () => {
        const v = Math.min(Math.round(progObj.v), Math.max(target(), Math.round(progObj.v * 0.6)));
        if (nEl) nEl.textContent = v + "%";
        gsap.set(barI, { scaleX: v / 100 });
      },
    });
    upd.play();

    let finished = false;
    function go() {
      if (done) return;
      done = true;
      if (nEl) nEl.textContent = "100%";
      gsap.set(barI, { scaleX: 1 });
      const finishNow = () => {
        if (!pre || finished) return;
        finished = true;
        gsap
          .timeline()
          .to(pre.querySelectorAll("img,.bar,.n"), { opacity: 0, y: -20, duration: 0.5, stagger: 0.05, ease: "power2.in" })
          .to(pre, { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "expo.inOut" })
          .add(() => {
            markVisited();
            setShow(false);
          });
      };
      // Backstop: don't depend solely on GSAP's rAF-driven onComplete, which
      // never fires if the frame loop is throttled or suspended.
      const remainingMs = Math.max(0, (1 - upd.progress()) * 1800) + 200;
      const backstop = setTimeout(finishNow, remainingMs);
      upd.eventCallback("onComplete", () => {
        clearTimeout(backstop);
        finishNow();
      });
      if (upd.progress() >= 1) {
        clearTimeout(backstop);
        finishNow();
      }
    }

    function onImgDone() {
      loaded++;
      if (loaded >= imgs.length) go();
    }

    if (imgs.length === 0) {
      go();
    } else {
      imgs.forEach((im) => {
        if (im.complete) loaded++;
        else {
          im.addEventListener("load", onImgDone);
          im.addEventListener("error", onImgDone);
        }
      });
      if (loaded >= imgs.length) go();
    }
    const safety = setTimeout(go, 4000);
    return () => {
      done = true;
      clearTimeout(safety);
      imgs.forEach((im) => {
        im.removeEventListener("load", onImgDone);
        im.removeEventListener("error", onImgDone);
      });
      upd.kill();
      gsap.killTweensOf(pre);
      gsap.killTweensOf(pre.querySelectorAll("*"));
    };
  }, [show]);

  if (!show) return null;

  return (
    <div id="pre" ref={rootRef} aria-hidden="true">
      <img src="/img/logo-blanc.png" alt="" />
      <div className="bar">
        <i></i>
      </div>
      <div className="n">0%</div>
    </div>
  );
}
