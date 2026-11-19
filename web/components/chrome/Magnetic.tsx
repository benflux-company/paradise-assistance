"use client";

import { useEffect } from "react";
import { ensureGsap, gsap } from "@/lib/gsap";
import { isFinePointer } from "@/lib/motion";

export default function Magnetic() {
  useEffect(() => {
    if (!isFinePointer()) return;
    ensureGsap();

    function onMove(e: MouseEvent) {
      const m = (e.target as Element).closest(".mag") as HTMLElement | null;
      document.querySelectorAll<HTMLElement>(".mag.ma").forEach((x) => {
        if (x !== m) {
          x.classList.remove("ma");
          gsap.to(x, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1,.4)" });
        }
      });
      if (!m) return;
      m.classList.add("ma");
      const r = m.getBoundingClientRect();
      gsap.to(m, {
        x: (e.clientX - r.left - r.width / 2) * 0.28,
        y: (e.clientY - r.top - r.height / 2) * 0.38,
        duration: 0.5,
        ease: "power3",
      });
    }

    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  return null;
}
