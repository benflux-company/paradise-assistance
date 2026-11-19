import type { Metadata } from "next";
import RevealMain from "@/components/RevealMain";
import PageHead from "@/components/PageHead";
import ServicesList from "@/components/services/ServicesList";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "Services",
  description:
    "De la conception au suivi de chantier, une équipe unique prend en charge votre projet d'intérieur, quelle que soit la pièce.",
};

export default function ServicesPage() {
  return (
    <RevealMain id="p-services" dataT="Services">
      <PageHead
        current="Services"
        titleLines={["Nos", "services"]}
        description="De la conception au suivi de chantier, une équipe unique prend en charge votre projet d'intérieur, quelle que soit la pièce."
      />
      <div className="phimg">
        <img src="/img/tv-gris.jpg" alt="Mur TV en lamelles grises avec éclairage LED" />
      </div>
      <ServicesList />
      <section className="sec" style={{ background: "var(--mist)" }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(380px,100%),1fr))", gap: 80 }}>
          <div>
            <div className="lab navy" data-up>
              Questions fréquentes
            </div>
            <h2 className="sf h2" style={{ marginTop: 24 }} data-split>
              <span className="ln">
                <span>Avant de</span>
              </span>
              <span className="ln">
                <span>
                  <em>commencer</em>
                </span>
              </span>
            </h2>
          </div>
          <FaqAccordion />
        </div>
      </section>
    </RevealMain>
  );
}
