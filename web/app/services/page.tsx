import type { Metadata } from "next";
import RevealMain from "@/components/RevealMain";
import PageHead from "@/components/PageHead";
import ServicesList from "@/components/services/ServicesList";
import FaqAccordion from "@/components/FaqAccordion";
import FadeImg from "@/components/FadeImg";
import { getServices, getFaqs } from "@/lib/queries";
import { getSiteContent } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Services",
  description:
    "De la conception au suivi de chantier, une équipe unique prend en charge votre projet d'intérieur, quelle que soit la pièce.",
};

export default async function ServicesPage() {
  const [services, faqs, content] = await Promise.all([getServices(), getFaqs(), getSiteContent()]);

  return (
    <RevealMain id="p-services" dataT="Services">
      <PageHead
        current="Services"
        titleLines={[content.services_title_line1, content.services_title_line2]}
        description={content.services_description}
      />
      <div className="phimg">
        <FadeImg src={content.services_header_image} alt="" />
      </div>
      <ServicesList services={services} />
      <section className="sec" style={{ background: "var(--mist)" }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(380px,100%),1fr))", gap: 80 }}>
          <div>
            <div className="lab navy" data-up>
              {content.faq_section_label}
            </div>
            <h2 className="sf h2" style={{ marginTop: 24 }} data-split>
              <span className="ln">
                <span>{content.faq_section_title_line1}</span>
              </span>
              <span className="ln">
                <span>
                  <em>{content.faq_section_title_line2}</em>
                </span>
              </span>
            </h2>
          </div>
          <FaqAccordion faqs={faqs} />
        </div>
      </section>
    </RevealMain>
  );
}
