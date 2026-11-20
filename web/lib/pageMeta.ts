export type PageKey = "accueil" | "portfolio" | "galerie" | "services" | "blog" | "article" | "contact";

export const PAGES: { key: PageKey; href: string; label: string }[] = [
  { key: "accueil", href: "/", label: "Accueil" },
  { key: "portfolio", href: "/portfolio", label: "Portfolio" },
  { key: "galerie", href: "/galerie", label: "Galerie" },
  { key: "services", href: "/services", label: "Services" },
  { key: "blog", href: "/blog", label: "Blog" },
  { key: "contact", href: "/contact", label: "Contact" },
];

export const NAV_PAGES = PAGES;

export function pageKeyFromPathname(pathname: string): PageKey {
  if (pathname === "/") return "accueil";
  if (pathname.startsWith("/portfolio")) return "portfolio";
  if (pathname.startsWith("/galerie")) return "galerie";
  if (pathname.startsWith("/services")) return "services";
  if (pathname.startsWith("/blog/")) return "article";
  if (pathname.startsWith("/blog")) return "blog";
  if (pathname.startsWith("/contact")) return "contact";
  return "accueil";
}

export function labelFromPathname(pathname: string, articleTitle?: string): string {
  const key = pageKeyFromPathname(pathname);
  if (key === "article") return articleTitle ?? "Journal";
  const found = PAGES.find((p) => p.key === key);
  return found ? found.label : "Accueil";
}

export function isDarkHeaderPage(pathname: string): boolean {
  return pathname === "/";
}
