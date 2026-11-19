"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ensureGsap, gsap } from "@/lib/gsap";
import { isReducedMotion } from "@/lib/motion";
import Arrow from "@/components/icons/Arrow";

const INTRO_TEXT =
  "Nous dessinons chaque espace avec vous, puis nous le construisons. Plans, matériaux, menuiserie, éclairage et finitions sont pris en charge par une seule équipe, du premier rendez-vous à la remise des clés.";

export default function IntroSection() {
  const wrapRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (isReducedMotion() || !wrapRef.current) return;
    ensureGsap();
    const tw = gsap.to(wrapRef.current.querySelectorAll(".wd"), {
      opacity: 1,
      stagger: 0.05,
      ease: "none",
      scrollTrigger: { trigger: wrapRef.current, start: "top 80%", end: "bottom 45%", scrub: true },
    });
    return () => tw.scrollTrigger?.kill();
  }, []);

  const words = INTRO_TEXT.split(/\s+/);

  return (
    <section className="sec">
      <div className="wrap intro">
        <div>
          <div className="lab navy" data-up>
            (01) &nbsp;Le studio
          </div>
        </div>
        <div>
          <p className="sf big" id="wr" ref={wrapRef}>
            {words.map((w, i) => (
              <span className="wd" key={i}>
                {w}
                {i < words.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
          <div className="pic">
            <div className="par" style={{ flex: 1.3, aspectRatio: "4/5" }}>
              <img src="/img/dressing-eclaire.jpg" alt="Dressing aux étagères en bois éclairées" loading="lazy" />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 28 }}>
              <div className="par" style={{ aspectRatio: "1/1" }}>
                <img src="/img/salle-de-bain.jpg" alt="Salle de bain avec mosaïque de verre et accessoires noirs" loading="lazy" />
              </div>
              <Link href="/services" className="btn mag" style={{ alignSelf: "flex-start" }}>
                <span className="t">
                  <span>Nos services</span>
                  <span>Nos services</span>
                </span>
                <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
