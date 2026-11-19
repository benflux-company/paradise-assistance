import type { Metadata } from "next";
import PageHead from "@/components/PageHead";

export const metadata: Metadata = { title: "Portfolio" };

export default function PortfolioPage() {
  return (
    <main id="p-portfolio" className="pg on" data-t="Portfolio">
      <PageHead
        current="Portfolio"
        titleLines={["Nos", "réalisations"]}
        description="Cuisines, murs TV, dressings et salles de bain. Chaque projet est dessiné, fabriqué et posé par notre équipe. Cliquez sur une image pour l'ouvrir en grand."
      />
      <section style={{ paddingBottom: 160 }}>
        <div className="wrap">
          <p>Grille du portfolio : étape suivante.</p>
        </div>
      </section>
    </main>
  );
}
