import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [projects, posts, newRequests, totalRequests] = await Promise.all([
    prisma.project.count(),
    prisma.post.count(),
    prisma.contactRequest.count({ where: { status: "NOUVEAU" } }),
    prisma.contactRequest.count(),
  ]);

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Tableau de bord</h1>
          <p>Vue d&apos;ensemble du contenu du site.</p>
        </div>
      </div>

      <div className="adm-grid cols-3">
        <Link href="/admin/projects" className="adm-card">
          <div className="adm-stat">{projects}</div>
          <div className="adm-stat-label">Réalisations publiées</div>
        </Link>
        <Link href="/admin/posts" className="adm-card">
          <div className="adm-stat">{posts}</div>
          <div className="adm-stat-label">Articles de blog</div>
        </Link>
        <Link href="/admin/contact-requests" className="adm-card">
          <div className="adm-stat">
            {newRequests}
            {totalRequests > 0 && <span style={{ fontSize: 16, color: "var(--adm-muted)" }}> / {totalRequests}</span>}
          </div>
          <div className="adm-stat-label">Nouvelles demandes de contact</div>
        </Link>
      </div>
    </>
  );
}
