import type { Metadata } from "next";
import RevealMain from "@/components/RevealMain";
import PageHead from "@/components/PageHead";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import { getProjects } from "@/lib/queries";
import { getSiteContent } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Cuisines, murs TV, dressings et salles de bain. Chaque projet est dessiné, fabriqué et posé par notre équipe.",
};

export default async function PortfolioPage() {
  const [projects, content] = await Promise.all([getProjects(), getSiteContent()]);

  return (
    <RevealMain id="p-portfolio" dataT="Portfolio">
      <PageHead
        current="Portfolio"
        titleLines={[content.portfolio_title_line1, content.portfolio_title_line2]}
        description={content.portfolio_description}
      />
      <PortfolioGrid projects={projects} />
    </RevealMain>
  );
}
