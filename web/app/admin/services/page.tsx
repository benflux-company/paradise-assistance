import { prisma } from "@/lib/prisma";
import { uploadsConfigured } from "@/lib/upload";
import ServiceManager from "./ServiceManager";

export const dynamic = "force-dynamic";

export default async function ServicesAdminPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Prestations</h1>
          <p>Les services présentés sur la page d&apos;accueil et la page prestations.</p>
        </div>
      </div>
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
