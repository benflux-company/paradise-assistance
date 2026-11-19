"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { isReducedMotion, isTouchViewport } from "@/lib/motion";
import { METHOD_STEPS, pad } from "@/lib/data";

export default function ProcessSteps() {
  const stkRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const pnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion() || !stkRef.current || !stepsRef.current) return;
    ensureGsap();
    const touch = isTouchViewport();
    const pis = Array.from(stkRef.current.querySelectorAll<HTMLDivElement>(".pi"));
    let active = 0;
    pis.forEach((p, j) => gsap.set(p, { clipPath: "inset(0% 0 0 0)", zIndex: j === 0 ? 3 : 0 }));

    const stepEls = Array.from(stepsRef.current.querySelectorAll<HTMLDivElement>(".step"));
    const triggers: ScrollTrigger[] = stepEls.map((st, k) =>
      ScrollTrigger.create({
        trigger: st,
        start: touch ? "top 80%" : "top 55%",
        end: touch ? "bottom 80%" : "bottom 55%",
        onToggle: (s) => {
          if (!s.isActive || active === k) return;
          const prev = active;
          active = k;
          stepEls.forEach((x) => x.classList.toggle("on", x === st));
          if (pnRef.current) pnRef.current.textContent = `ÉTAPE ${pad(k + 1)} / ${pad(METHOD_STEPS.length)}`;
          pis.forEach((p, j) => gsap.set(p, { zIndex: j === k ? 3 : j === prev ? 2 : 1 }));
          const p = pis[k];
          gsap.fromTo(p, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.1, ease: "expo.inOut" });
          const image = p.querySelector("img");
          gsap.fromTo(image, { scale: 1.3 }, { scale: 1, duration: 1.6, ease: "expo.out" });
        },
      })
    );

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <section className="sec">
      <div className="wrap">
        <div className="lab navy" data-up>
          (04) &nbsp;Méthode
        </div>
        <h2 className="sf h2" style={{ margin: "24px 0 80px" }} data-split>
          <span className="ln">
            <span>Du croquis</span>
          </span>
          <span className="ln">
            <span>
              <em>à la livraison</em>
            </span>
          </span>
        </h2>
        <div className="proc">
          <div className="stk" id="stk" ref={stkRef}>
            {METHOD_STEPS.map((s, k) => (
              <div className={`pi${k === 0 ? " on" : ""}`} key={s.title}>
                <img src={`/img/${s.image}.jpg`} alt="" loading="lazy" />
              </div>
            ))}
            <div className="pn" id="pn" ref={pnRef}>
              ÉTAPE 01 / {pad(METHOD_STEPS.length)}
            </div>
          </div>
          <div id="steps" ref={stepsRef}>
            {METHOD_STEPS.map((s, k) => (
              <div className={`step${k === 0 ? " on" : ""}`} data-k={k} key={s.title}>
                <div className="k sf">{pad(k + 1)}</div>
                <h3 className="sf">{s.title}</h3>
                <p>{s.longDesc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
