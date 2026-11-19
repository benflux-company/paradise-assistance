import type { Metadata } from "next";
import RevealMain from "@/components/RevealMain";
import PageHead from "@/components/PageHead";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Cuisines, murs TV, dressings et salles de bain. Chaque projet est dessiné, fabriqué et posé par notre équipe.",
};

export default function PortfolioPage() {
  return (
    <RevealMain id="p-portfolio" dataT="Portfolio">
      <PageHead
        current="Portfolio"
        titleLines={["Nos", "réalisations"]}
        description="Cuisines, murs TV, dressings et salles de bain. Chaque projet est dessiné, fabriqué et posé par notre équipe. Cliquez sur une image pour l'ouvrir en grand."
      />
      <PortfolioGrid />
    </RevealMain>
  );
}
