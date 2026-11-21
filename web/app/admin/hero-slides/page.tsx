import { prisma } from "@/lib/prisma";
import { uploadsConfigured } from "@/lib/upload";
import PageHeader from "@/components/admin/layout/PageHeader";
import HeroSlideManager from "./HeroSlideManager";

export const dynamic = "force-dynamic";

export default async function HeroSlidesAdminPage() {
  const slides = await prisma.heroSlide.findMany({ orderBy: { order: "asc" } });
  return (
    <>
      <PageHeader title="Accueil (slides)" description="Les images du grand diaporama de la page d'accueil." />
      <HeroSlideManager
        uploadsEnabled={uploadsConfigured()}
        initial={slides.map((s) => ({ id: s.id, image: s.image, video: s.video ?? "", alt: s.alt, caption: s.caption }))}
      />
    </>
  );
}
