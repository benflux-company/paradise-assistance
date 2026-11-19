"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ensureGsap, gsap } from "@/lib/gsap";
import { NAV_PAGES } from "@/lib/pageMeta";
import { getLenis, isReducedMotion } from "@/lib/motion";
import { orPlaceholder } from "@/lib/placeholders";
import type { SettingsView } from "@/lib/queries";

export default function MobileMenu({ open, settings }: { open: boolean; settings: SettingsView }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    document.body.classList.toggle("mo", open);
    const lenis = getLenis();
    if (lenis) {
      if (open) lenis.stop();
      else lenis.start();
    }
    if (!isReducedMotion()) {
      ensureGsap();
      gsap.to(el, { clipPath: open ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut" });
      if (open) {
        gsap.fromTo(
          el.querySelectorAll("a.big span"),
          { yPercent: 110 },
          { yPercent: 0, stagger: 0.06, duration: 1, delay: 0.35, ease: "expo.out" }
        );
      }
    } else {
      el.style.clipPath = open ? "inset(0)" : "inset(0 0 100% 0)";
    }
  }, [open]);

  return (
    <div id="mm" ref={ref} aria-label="Menu">
      <nav>
        {NAV_PAGES.map((p) => (
          <Link key={p.key} href={p.href} className="big sf">
            <span>{p.label}</span>
          </Link>
        ))}
      </nav>
      <div className="mi">
        <span>{orPlaceholder(settings.phone, "[TÉLÉPHONE]")}</span>
        <span>{orPlaceholder(settings.email, "[ADRESSE E-MAIL]")}</span>
      </div>
    </div>
  );
}
