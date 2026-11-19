"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, gsap } from "@/lib/gsap";
import { isFinePointer, isNavBusy } from "@/lib/motion";
import { SERVICES, pad } from "@/lib/data";
import Arrow from "@/components/icons/Arrow";

export default function ExpertiseList() {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFinePointer() || !listRef.current) return;
    ensureGsap();
    const flt = document.getElementById("flt");
    if (!flt) return;

    let mX = -1;
    let mY = -1;
    let fltOn: Element | null = null;
    // xPercent/yPercent keep the -50%/-50% centering under GSAP's own control instead
    // of relying on parsing the CSS-authored percentage translate() as a baseline.
    gsap.set(flt, { xPercent: -50, yPercent: -50 });
    const fx = gsap.quickTo(flt, "x", { duration: 0.7, ease: "power3" });
    const fy = gsap.quickTo(flt, "y", { duration: 0.7, ease: "power3" });

    function fltHide() {
      fltOn = null;
      gsap.killTweensOf(flt, "opacity,scale");
      gsap.to(flt, { opacity: 0, scale: 0.6, duration: 0.4, ease: "expo.out" });
    }

    function fltShow(it: Element) {
      if (fltOn === it) return;
      fltOn = it;
      const im = document.createElement("img");
      im.src = it.getAttribute("data-img") ?? "";
      im.alt = "";
      flt!.appendChild(im);
      while (flt!.children.length > 2) flt!.removeChild(flt!.firstChild as ChildNode);
      gsap.fromTo(im, { clipPath: "inset(100% 0 0 0)", scale: 1.25 }, { clipPath: "inset(0% 0 0 0)", scale: 1, duration: 0.8, ease: "expo.out" });
      gsap.killTweensOf(flt, "opacity,scale");
      gsap.to(flt, { opacity: 1, scale: 1, duration: 0.6, ease: "expo.out" });
    }

    function hoverCheck() {
      if (mX < 0) return;
      const el = document.elementFromPoint(mX, mY);
      const lb = document.getElementById("lb");
      const blocked = !!lb?.classList.contains("open") || document.body.classList.contains("mo") || isNavBusy();
      const it = !blocked && el ? el.closest(".sitem") : null;
      if (it) fltShow(it);
      else if (fltOn) fltHide();
      const curState = (window as unknown as { __curState?: (el: Element | null) => void }).__curState;
      curState?.(blocked ? null : el);
    }

    function onMove(e: MouseEvent) {
      mX = e.clientX;
      mY = e.clientY;
      fx(mX);
      fy(mY);
      hoverCheck();
    }
    function onLeave() {
      mX = -1;
      fltHide();
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", hoverCheck, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", fltHide);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", hoverCheck);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", fltHide);
      fltHide();
    };
  }, []);

  return (
    <section className="sec">
      <div className="wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 32, flexWrap: "wrap" }}>
          <div>
            <div className="lab navy" data-up>
              (03) &nbsp;Expertises
            </div>
            <h2 className="sf h2" style={{ marginTop: 24 }} data-split>
              <span className="ln">
                <span>Ce que nous</span>
              </span>
              <span className="ln">
                <span>
                  <em>savons faire</em>
                </span>
              </span>
            </h2>
          </div>
          <p style={{ maxWidth: 360, fontSize: 15, lineHeight: 1.8, color: "var(--muted)" }} data-up>
            Survolez une expertise pour voir un exemple de réalisation.
          </p>
        </div>
        <div className="slist" id="slist" ref={listRef}>
          {SERVICES.map((s, k) => (
            <a key={s.title} href="/services" className="sitem" data-img={`/img/${s.image}.jpg`}>
              <span className="n">{pad(k + 1)}</span>
              <h3 className="sf">{s.title}</h3>
              <p>{s.subtitle}</p>
              <span className="go">
                <Arrow />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
