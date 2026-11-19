"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS: Array<{ group: string; items: Array<{ href: string; label: string }> }> = [
  {
    group: "Vue d'ensemble",
    items: [{ href: "/admin", label: "Tableau de bord" }],
  },
  {
    group: "Contenu",
    items: [
      { href: "/admin/projects", label: "Réalisations" },
      { href: "/admin/posts", label: "Blog & actualités" },
      { href: "/admin/services", label: "Prestations" },
      { href: "/admin/method-steps", label: "Méthode" },
      { href: "/admin/hero-slides", label: "Accueil (slides)" },
      { href: "/admin/faqs", label: "FAQ" },
      { href: "/admin/site-content", label: "Contenu du site" },
    ],
  },
  {
    group: "Site",
    items: [
      { href: "/admin/contact-requests", label: "Demandes de contact" },
      { href: "/admin/settings", label: "Paramètres" },
    ],
  },
  {
    group: "Compte",
    items: [{ href: "/admin/account", label: "Mon compte" }],
  },
];

export default function AdminNav({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <nav className="adm-side">
      <div className="adm-brand">
        Paradis Assistance
        <span>Administration</span>
      </div>
      <div className="adm-nav">
        {LINKS.map((section) => (
          <div key={section.group}>
            <div className="grp">{section.group}</div>
            {section.items.map((item) => {
              const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} className={active ? "active" : undefined}>
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
      <div className="adm-side-foot">
        <div className="who">{userName}</div>
        <button type="button" className="adm-btn sm" onClick={logout}>
          Se déconnecter
        </button>
      </div>
    </nav>
  );
}
