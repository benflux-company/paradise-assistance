"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Lenis from "lenis";
import Header from "./Header";
import MobileMenu from "./MobileMenu";
import Footer from "./Footer";
import Cta from "./Cta";
import Preloader from "./Preloader";
import Cursor from "./Cursor";
import Magnetic from "./Magnetic";
import ProgressBar from "./ProgressBar";
import { ensureGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { labelFromPathname } from "@/lib/pageMeta";
import { isReducedMotion, isTouchViewport, setLenis, setNavBusy, scrollToTop } from "@/lib/motion";

export default function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const curRef = useRef<HTMLDivElement>(null);
  const curSpanRef = useRef<HTMLSpanElement>(null);
  const busyRef = useRef(false);
  const firstRef = useRef(true);

  useEffect(() => {
    ensureGsap();
    if (isReducedMotion()) document.documentElement.classList.add("nog");
    let lenis: Lenis | null = null;
    if (!isReducedMotion() && !isTouchViewport()) {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time: number) => {
        lenis?.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
    return () => {
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  function navigateWithCurtain(href: string) {
    if (busyRef.current || isReducedMotion()) {
      router.push(href);
      return;
    }
    busyRef.current = true;
    setNavBusy(true);
    setMenuOpen(false);
    const cur = curRef.current;
    const span = curSpanRef.current;
    if (!cur || !span) {
      router.push(href);
      busyRef.current = false;
      setNavBusy(false);
      return;
    }
    span.textContent = labelFromPathname(href);
    gsap
      .timeline({
        onComplete: () => {
          busyRef.current = false;
          setNavBusy(false);
        },
      })
      .set(cur, { transformOrigin: "bottom" })
      .to(cur, { scaleY: 1, duration: 0.8, ease: "expo.inOut" })
      .fromTo(span, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }, "-=.2")
      .add(() => router.push(href));
  }

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = e.target as Element;
      const a = target.closest ? (target.closest("a") as HTMLAnchorElement | null) : null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      let url: URL;
      try {
        url = new URL(a.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin || url.pathname === pathname) return;
      e.preventDefault();
      navigateWithCurtain(url.pathname);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (firstRef.current) {
      firstRef.current = false;
      return;
    }
    scrollToTop();
    const cur = curRef.current;
    const span = curSpanRef.current;
    if (!cur || !span || isReducedMotion()) return;
    const scaleY = gsap.getProperty(cur, "scaleY") as number;
    if (!scaleY || scaleY <= 0.01) return;
    gsap
      .timeline()
      .to(span, { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" }, "+=.15")
      .set(cur, { transformOrigin: "top" })
      .to(cur, { scaleY: 0, duration: 0.9, ease: "expo.inOut" });
  }, [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && menuOpen) setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const isContact = pathname === "/contact";

  return (
    <>
      <Preloader />
      <div id="cur" ref={curRef} aria-hidden="true">
        <span className="sf" ref={curSpanRef}></span>
      </div>
      <Cursor />
      <Magnetic />
      <ProgressBar />
      <div id="flt" aria-hidden="true"></div>
      <Header menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((v) => !v)} />
      <MobileMenu open={menuOpen} />
      {children}
      <Cta hidden={isContact} />
      <Footer />
    </>
  );
}
