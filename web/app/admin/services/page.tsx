import { prisma } from "@/lib/prisma";
import { uploadsConfigured } from "@/lib/upload";
import PageHeader from "@/components/admin/layout/PageHeader";
import ServiceManager from "./ServiceManager";

export const dynamic = "force-dynamic";

export default async function ServicesAdminPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  return (
    <>
      <PageHeader title="Prestations" description="Les services présentés sur la page d'accueil et la page prestations." />
      <ServiceManager
        uploadsEnabled={uploadsConfigured()}
        initial={services.map((s) => ({
          id: s.id,
          title: s.title,
          subtitle: s.subtitle,
          description: s.description,
          items: s.items,
          image: s.image,
        }))}
      />
    </>
  );
}
