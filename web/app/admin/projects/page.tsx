import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProjectsTable from "./ProjectsTable";

export const dynamic = "force-dynamic";

export default async function ProjectsAdminPage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
    include: { images: { where: { cover: true }, take: 1 } },
  });

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Réalisations</h1>
          <p>{projects.length} réalisation(s).</p>
        </div>
        <Link href="/admin/projects/new" className="adm-btn primary">
          Nouvelle réalisation
        </Link>
      </div>
      <div className="adm-card" style={{ padding: 0, overflowX: "auto" }}>
        <ProjectsTable
          projects={projects.map((p) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            category: p.category,
            featured: p.featured,
            published: p.published,
            cover: p.images[0]?.url ?? null,
          }))}
        />
      </div>
    </>
  );
}
