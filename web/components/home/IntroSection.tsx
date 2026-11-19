"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ensureGsap, gsap } from "@/lib/gsap";
import { isReducedMotion } from "@/lib/motion";
import Arrow from "@/components/icons/Arrow";
import FadeImg from "@/components/FadeImg";

export default function IntroSection({
  label,
  text,
  image1,
  image2,
}: {
  label: string;
  text: string;
  image1: string;
  image2: string;
}) {
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

  const words = text.split(/\s+/);

  return (
    <section className="sec">
      <div className="wrap intro">
        <div>
          <div className="lab navy" data-up>
            (01) &nbsp;{label}
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
              <FadeImg src={image1} alt="" loading="lazy" />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 28 }}>
              <div className="par" style={{ aspectRatio: "1/1" }}>
                <FadeImg src={image2} alt="" loading="lazy" />
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
