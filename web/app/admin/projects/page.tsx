import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/admin/layout/PageHeader";
import Button from "@/components/admin/ui/Button";
import ProjectsTable from "./ProjectsTable";

export const dynamic = "force-dynamic";

export default async function ProjectsAdminPage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
    include: { images: { where: { cover: true }, take: 1 } },
  });

  return (
    <>
      <PageHeader
        title="Réalisations"
        description={`${projects.length} réalisation(s).`}
        actions={
          <Link href="/admin/projects/new">
            <Button>
              <Plus className="size-4" /> Nouvelle réalisation
            </Button>
          </Link>
        }
      />
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
    </>
  );
}
