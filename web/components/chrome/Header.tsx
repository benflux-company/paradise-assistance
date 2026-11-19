"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { NAV_PAGES, isDarkHeaderPage, pageKeyFromPathname } from "@/lib/pageMeta";

export default function Header({
  menuOpen,
  onToggleMenu,
}: {
  menuOpen: boolean;
  onToggleMenu: () => void;
}) {
  const pathname = usePathname();
  const hdRef = useRef<HTMLElement>(null);
  const activeKey = pageKeyFromPathname(pathname);
  const navActiveKey = activeKey === "article" ? "blog" : activeKey;

  useEffect(() => {
    function onScroll() {
      const hd = hdRef.current;
      if (!hd) return;
      const y = window.scrollY;
      const dark = isDarkHeaderPage(pathname) && y < window.innerHeight - 100;
      hd.classList.toggle("tr", !!dark || menuOpen);
      hd.classList.toggle("sol", !dark && !menuOpen && y > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname, menuOpen]);

  return (
    <header id="hd" ref={hdRef}>
      <div className="wrap in">
        <Link href="/" className="logo" aria-label="Ets Paradis Assistance, accueil">
          <img className="m" src="/img/logo-marine.png" alt="Ets Paradis Assistance" />
          <img className="w" src="/img/logo-blanc.png" alt="" />
        </Link>
        <nav id="nav" aria-label="Navigation principale">
          {NAV_PAGES.map((p) => (
            <Link
              key={p.key}
              href={p.href}
              className={`ul${navActiveKey === p.key ? " on" : ""}`}
              data-r={p.key}
              aria-current={navActiveKey === p.key ? "page" : undefined}
            >
              {p.label}
            </Link>
          ))}
        </nav>
        <div className="hdr-r">
          <Link href="/contact" className="btn sm mag">
            <span className="t">
              <span>Demander un devis</span>
              <span>Demander un devis</span>
            </span>
          </Link>
          <button
            className="burger"
            id="burger"
            type="button"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            aria-controls="mm"
            onClick={onToggleMenu}
          >
            <i></i>
            <i></i>
          </button>
        </div>
      </div>
    </header>
  );
}
