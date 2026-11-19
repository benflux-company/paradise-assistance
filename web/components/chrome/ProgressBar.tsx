"use client";

import { useEffect, useRef } from "react";

export default function ProgressBar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() {
      const el = ref.current;
      if (!el) return;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      el.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div id="prog" ref={ref} aria-hidden="true"></div>;
}
