import type { Metadata } from "next";
import RevealMain from "@/components/RevealMain";
import PageHead from "@/components/PageHead";
import ContactForm from "@/components/contact/ContactForm";
import { getSettings } from "@/lib/queries";
import { orPlaceholder } from "@/lib/placeholders";

export const metadata: Metadata = {
  title: "Contact",
  description: "Décrivez-nous votre espace et vos envies. Nous vous recontactons pour convenir d'une visite et établir un devis.",
};

export default async function ContactPage() {
  const settings = await getSettings();

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
              <div className="v sf">{orPlaceholder(settings.phone, "[TÉLÉPHONE]")}</div>
            </div>
            <div className="it" data-up>
              <div className="lab navy">E-mail</div>
              <div className="v sf">{orPlaceholder(settings.email, "[ADRESSE E-MAIL]")}</div>
            </div>
            <div className="it" data-up>
              <div className="lab navy">Adresse</div>
              <div className="v sf">{orPlaceholder(settings.address, "[ADRESSE DU BUREAU]")}</div>
            </div>
            <div className="it" data-up>
              <div className="lab navy">Horaires</div>
              <div className="v sf">{orPlaceholder(settings.hours, "[HORAIRES D'OUVERTURE]")}</div>
            </div>
          </div>
          <ContactForm projectTypes={settings.projectTypes} budgetRanges={settings.budgetRanges} />
        </div>
      </section>
      <section style={{ paddingBottom: 160 }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(380px,100%),1fr))", gap: 24 }}>
          <div className="par" style={{ height: 460 }}>
            <img src="/img/chantier-cuisine.jpg" alt="Pose d'une cuisine sur mesure en cours de chantier" loading="lazy" />
          </div>
          {settings.mapEmbed ? (
            <iframe
              src={settings.mapEmbed}
              title="Carte de localisation"
              style={{ height: 460, border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="map">
              Carte de localisation
              <br />
              [À INTÉGRER]
            </div>
          )}
        </div>
      </section>
    </RevealMain>
  );
}
