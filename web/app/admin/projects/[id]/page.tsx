import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { uploadsConfigured } from "@/lib/upload";
import PageHeader from "@/components/admin/layout/PageHeader";
import Button from "@/components/admin/ui/Button";
import ProjectForm from "../ProjectForm";
import ImageManager from "../ImageManager";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id }, include: { images: { orderBy: { order: "asc" } } } });
  if (!project) notFound();

  return (
    <>
      <PageHeader
        title={project.title}
        description="Réalisation"
        actions={
          <Link href="/admin/projects">
            <Button variant="outline">
              <ArrowLeft className="size-4" /> Retour
            </Button>
          </Link>
        }
      />
      <div className="space-y-6">
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
        <ImageManager
          projectId={project.id}
          uploadsEnabled={uploadsConfigured()}
          images={project.images.map((i) => ({ id: i.id, url: i.url, alt: i.alt, cover: i.cover }))}
        />
      </div>
    </>
  );
}
