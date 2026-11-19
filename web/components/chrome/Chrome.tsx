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
import Lightbox from "@/components/Lightbox";
import { ensureGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { setupSharedAnims } from "@/lib/animations";
import { labelFromPathname } from "@/lib/pageMeta";
import { isReducedMotion, isTouchViewport, setLenis, setNavBusy, scrollToTop } from "@/lib/motion";
import type { ProjectView, SettingsView } from "@/lib/queries";

export default function Chrome({
  children,
  projects,
  settings,
}: {
  children: React.ReactNode;
  projects: ProjectView[];
  settings: SettingsView;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const curRef = useRef<HTMLDivElement>(null);
  const curSpanRef = useRef<HTMLSpanElement>(null);
  const busyRef = useRef(false);
  const firstRef = useRef(true);
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
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
    // isAdmin is derived from pathname only to gate this mount-once effect;
    // Chrome persists across client navigations as part of the root layout,
    // so re-running it on an admin<->site transition isn't needed in practice.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (isAdmin) return;
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
      if (url.origin !== window.location.origin) return;
      if (url.pathname === pathname) {
        // Same page (e.g. tapping "Accueil" from the mobile menu while
        // already on "/"): no curtain/navigation needed, but the menu must
        // still close — nothing else in the click path does that for a
        // same-URL link, since no route change ever happens to trigger it.
        if (menuOpen) {
          e.preventDefault();
          setMenuOpen(false);
        }
        return;
      }
      e.preventDefault();
      navigateWithCurtain(url.pathname);
    }
    // Capture phase, not bubble: Next's own <Link> click handler runs on
    // the bubble phase and calls preventDefault()+navigates natively before
    // a bubble-phase document listener ever sees the event (React's root
    // listener is registered well before this effect's). Capture on
    // document fires first, letting us intercept before Link acts on it —
    // this is what the curtain transition and menu-close-on-nav depend on.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, menuOpen]);

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

  useEffect(() => {
    if (isAdmin || isReducedMotion()) return;
    ensureGsap();
    return setupSharedAnims(isTouchViewport());
  }, [pathname, isAdmin]);

  const isContact = pathname === "/contact";

  if (isAdmin) return <>{children}</>;

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
      <MobileMenu open={menuOpen} settings={settings} />
      {children}
      <Cta hidden={isContact} />
      <Footer settings={settings} />
      <Lightbox projects={projects} />
    </>
  );
}
