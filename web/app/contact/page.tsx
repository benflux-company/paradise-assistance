import type { Metadata } from "next";
import RevealMain from "@/components/RevealMain";
import PageHead from "@/components/PageHead";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Décrivez-nous votre espace et vos envies. Nous vous recontactons pour convenir d'une visite et établir un devis.",
};

export default function ContactPage() {
  return (
    <RevealMain id="p-contact" dataT="Contact">
      <PageHead
        current="Contact"
        titleLines={["Parlons de", "votre projet"]}
        description="Décrivez-nous votre espace et vos envies. Nous vous recontactons pour convenir d'une visite et établir un devis."
      />
      <section style={{ paddingBottom: 140 }}>
        <div className="wrap cgrid">
          <div className="cinfo">
            <div className="it" data-up>
              <div className="lab navy">Téléphone</div>
              <div className="v sf">[TÉLÉPHONE]</div>
            </div>
            <div className="it" data-up>
              <div className="lab navy">E-mail</div>
              <div className="v sf">[ADRESSE E-MAIL]</div>
            </div>
            <div className="it" data-up>
              <div className="lab navy">Adresse</div>
              <div className="v sf">[ADRESSE DU BUREAU]</div>
            </div>
            <div className="it" data-up>
              <div className="lab navy">Horaires</div>
              <div className="v sf">[HORAIRES D&apos;OUVERTURE]</div>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
      <section style={{ paddingBottom: 160 }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(380px,100%),1fr))", gap: 24 }}>
          <div className="par" style={{ height: 460 }}>
            <img src="/img/chantier-cuisine.jpg" alt="Pose d'une cuisine sur mesure en cours de chantier" loading="lazy" />
          </div>
          <div className="map">
            Carte de localisation
            <br />
            [À INTÉGRER]
          </div>
        </div>
      </section>
    </RevealMain>
  );
}
