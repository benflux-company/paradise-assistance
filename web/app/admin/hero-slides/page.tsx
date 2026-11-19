import { prisma } from "@/lib/prisma";
import { uploadsConfigured } from "@/lib/upload";
import HeroSlideManager from "./HeroSlideManager";

export const dynamic = "force-dynamic";

export default async function HeroSlidesAdminPage() {
  const slides = await prisma.heroSlide.findMany({ orderBy: { order: "asc" } });
  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Accueil (slides)</h1>
          <p>Les images du grand diaporama de la page d&apos;accueil.</p>
        </div>
      </div>
      <HeroSlideManager
        uploadsEnabled={uploadsConfigured()}
        initial={slides.map((s) => ({ id: s.id, image: s.image, video: s.video ?? "", alt: s.alt, caption: s.caption }))}
      />
    </>
  );
}
