"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { isReducedMotion } from "@/lib/motion";

export default function Marquee({ items }: { items: string[] }) {
  const REPEATED = [...items, ...items];
  const sectionRef = useRef<HTMLDivElement>(null);
  const mqRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion() || !sectionRef.current || !mqRef.current) return;
    ensureGsap();
    const section = sectionRef.current;
    const mq = mqRef.current;

    let mx = 0;
    let dirn = 1;
    let half = 0;
    const calc = () => {
      half = mq.scrollWidth / 2;
    };
    calc();

    let mqVis = false;
    const visTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onToggle: (s) => {
        mqVis = s.isActive;
      },
    });

    const tick = () => {
      if (!mqVis) return;
      if (!half) calc();
      mx -= 0.6 * dirn;
      if (mx <= -half) mx += half;
      if (mx > 0) mx -= half;
      gsap.set(mq, { x: mx });
    };
    gsap.ticker.add(tick);

    const velocityTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (s) => {
        const v = s.getVelocity();
        dirn = s.direction;
        mx -= (v / 220) * s.direction * s.direction;
      },
    });

    return () => {
      gsap.ticker.remove(tick);
      visTrigger.kill();
      velocityTrigger.kill();
    };
  }, []);

  return (
    <div className="mq" aria-hidden="true" ref={sectionRef}>
      <div className="in sf" id="mq" ref={mqRef}>
        {REPEATED.map((w, i) => (
          <span key={i} className={i % 2 ? "o" : undefined}>
            {w}
            <b></b>
          </span>
        ))}
      </div>
    </div>
  );
}
