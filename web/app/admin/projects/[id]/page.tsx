import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { uploadsConfigured } from "@/lib/upload";
import ProjectForm from "../ProjectForm";
import ImageManager from "../ImageManager";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id }, include: { images: { orderBy: { order: "asc" } } } });
  if (!project) notFound();

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>{project.title}</h1>
          <p>Réalisation</p>
        </div>
        <Link href="/admin/projects" className="adm-btn">
          Retour
        </Link>
      </div>
      <div className="adm-card" style={{ marginBottom: 24 }}>
        <ProjectForm
          projectId={project.id}
          initial={{
            title: project.title,
            slug: project.slug,
            category: project.category,
            shortDesc: project.shortDesc,
            longDesc: project.longDesc,
            featured: project.featured,
            wide: project.wide,
            published: project.published,
          }}
        />
      </div>
      <ImageManager
        projectId={project.id}
        uploadsEnabled={uploadsConfigured()}
        images={project.images.map((i) => ({ id: i.id, url: i.url, alt: i.alt, cover: i.cover }))}
      />
    </>
  );
}
