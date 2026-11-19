import type { Metadata } from "next";
import RevealMain from "@/components/RevealMain";
import PageHead from "@/components/PageHead";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import { getProjects } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Cuisines, murs TV, dressings et salles de bain. Chaque projet est dessiné, fabriqué et posé par notre équipe.",
};

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <RevealMain id="p-portfolio" dataT="Portfolio">
      <PageHead
        current="Portfolio"
        titleLines={["Nos", "réalisations"]}
        description="Cuisines, murs TV, dressings et salles de bain. Chaque projet est dessiné, fabriqué et posé par notre équipe. Cliquez sur une image pour l'ouvrir en grand."
      />
      <PortfolioGrid projects={projects} />
    </RevealMain>
  );
}
