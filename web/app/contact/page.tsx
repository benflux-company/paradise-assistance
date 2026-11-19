import type { Metadata } from "next";
import PageHead from "@/components/PageHead";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <main id="p-contact" className="pg on" data-t="Contact">
      <PageHead
        current="Contact"
        titleLines={["Parlons de", "votre projet"]}
        description="Décrivez-nous votre espace et vos envies. Nous vous recontactons pour convenir d'une visite et établir un devis."
      />
      <section style={{ paddingBottom: 140 }}>
        <div className="wrap">
          <p>Formulaire de contact : étape suivante.</p>
        </div>
      </section>
    </main>
  );
}
