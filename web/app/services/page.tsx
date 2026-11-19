import type { Metadata } from "next";
import PageHead from "@/components/PageHead";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <main id="p-services" className="pg on" data-t="Services">
      <PageHead
        current="Services"
        titleLines={["Nos", "services"]}
        description="De la conception au suivi de chantier, une équipe unique prend en charge votre projet d'intérieur, quelle que soit la pièce."
      />
      <section style={{ padding: "40px 0 80px" }}>
        <div className="wrap">
          <p>Liste des services : étape suivante.</p>
        </div>
      </section>
    </main>
  );
}
