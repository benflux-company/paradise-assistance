"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, gsap } from "@/lib/gsap";
import { isFinePointer } from "@/lib/motion";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFinePointer()) return;
    ensureGsap();
    const cd = dotRef.current!;
    const cr = ringRef.current!;
    const xd = gsap.quickTo(cd, "x", { duration: 0.12 });
    const yd = gsap.quickTo(cd, "y", { duration: 0.12 });
    const xr = gsap.quickTo(cr, "x", { duration: 0.5, ease: "power3" });
    const yr = gsap.quickTo(cr, "y", { duration: 0.5, ease: "power3" });

    function onMove(e: MouseEvent) {
      document.body.classList.add("cur-on");
      xd(e.clientX);
      yd(e.clientY);
      xr(e.clientX);
      yr(e.clientY);
    }

    function curState(el: Element | null) {
      const t = el?.closest ? el.closest("[data-cur]") : null;
      const l = el?.closest ? el.closest("a,button,summary,input,textarea") : null;
      const d = el?.closest ? el.closest(".ondark,#lb,#mm") : null;
      const lb = document.getElementById("lb");
      const blocked = lb?.classList.contains("open") || document.body.classList.contains("mo");
      const tt = blocked ? null : t;
      cr.classList.toggle("big", !!tt);
      cr.textContent = tt ? tt.getAttribute("data-cur") ?? "" : "";
      cr.classList.toggle("lnk", !tt && !!l);
      cr.classList.toggle("lt", !!d && !tt);
      cd.classList.toggle("lt", !!d);
    }
    (window as unknown as { __curState?: typeof curState }).__curState = curState;

    function onOver(e: MouseEvent) {
      curState(e.target as Element);
    }
    function onLeaveDoc() {
      document.body.classList.remove("cur-on");
      curState(null);
    }

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeaveDoc);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeaveDoc);
    };
  }, []);

  return (
    <>
      <div id="cd" ref={dotRef} aria-hidden="true"></div>
      <div id="cr" ref={ringRef} aria-hidden="true"></div>
    </>
  );
}
