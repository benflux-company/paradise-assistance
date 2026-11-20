import type { Metadata } from "next";
import RevealMain from "@/components/RevealMain";
import PageHead from "@/components/PageHead";
import GalleryGrid from "@/components/galerie/GalleryGrid";
import { getProjects } from "@/lib/queries";
import { getSiteContent } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Galerie",
  description: "Toutes nos photos de chantier, réunies au même endroit.",
};

export default async function GaleriePage() {
  const [allProjects, content] = await Promise.all([getProjects(), getSiteContent()]);
  // Les photos de chantier (travaux en cours) sont très similaires entre elles
  // (échafaudages, murs bruts…) : elles donnent une impression de doublons
  // dans une galerie pensée pour montrer des réalisations finies.
  const projects = allProjects.filter((p) => !p.slug.includes("chantier"));

  return (
    <RevealMain id="p-galerie" dataT="Galerie">
      <PageHead
        current="Galerie"
        titleLines={[content.galerie_title_line1, content.galerie_title_line2]}
        description={content.galerie_description}
      />
      <GalleryGrid projects={projects} />
    </RevealMain>
  );
}
