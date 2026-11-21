"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FolderKanban,
  Newspaper,
  Wrench,
  ListChecks,
  GalleryHorizontal,
  HelpCircle,
  FileText,
  Mail,
  Settings,
  UserCircle,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/admin/cn";

const LINKS: Array<{ group: string; items: Array<{ href: string; label: string; icon: React.ComponentType<{ className?: string }> }> }> = [
  {
    group: "Contenu",
    items: [
      { href: "/admin/projects", label: "Réalisations", icon: FolderKanban },
      { href: "/admin/posts", label: "Blog & actualités", icon: Newspaper },
      { href: "/admin/services", label: "Prestations", icon: Wrench },
      { href: "/admin/method-steps", label: "Méthode", icon: ListChecks },
      { href: "/admin/hero-slides", label: "Accueil (slides)", icon: GalleryHorizontal },
      { href: "/admin/faqs", label: "FAQ", icon: HelpCircle },
      { href: "/admin/site-content", label: "Contenu du site", icon: FileText },
    ],
  },
  {
    group: "Site",
    items: [
      { href: "/admin/contact-requests", label: "Demandes de contact", icon: Mail },
      { href: "/admin/settings", label: "Paramètres", icon: Settings },
    ],
  },
  {
    group: "Compte",
    items: [{ href: "/admin/account", label: "Mon compte", icon: UserCircle }],
  },
];

export default function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-5 py-6">
        <div className="text-sm font-semibold tracking-wide text-white">Paradis Assistance</div>
        <div className="mt-0.5 text-xs text-sidebar-muted">Administration</div>
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
        {LINKS.map((section) => (
          <div key={section.group}>
            <div className="px-3 pb-2 text-2xs font-semibold uppercase tracking-widest text-sidebar-muted">{section.group}</div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                      active ? "bg-sidebar-accent text-white" : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-sidebar-border px-5 py-4">
        <div className="mb-2 truncate text-xs text-sidebar-muted">{userName}</div>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent/60"
        >
          <LogOut className="size-4" /> Se déconnecter
        </button>
      </div>
    </aside>
  );
}
