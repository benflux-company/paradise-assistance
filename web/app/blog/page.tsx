import type { Metadata } from "next";
import PageHead from "@/components/PageHead";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPage() {
  return (
    <main id="p-blog" className="pg on" data-t="Blog">
      <PageHead
        current="Blog"
        titleLines={["Le", "journal"]}
        description="Conseils de fabrication, coulisses de chantier et idées d'aménagement pour mieux préparer votre projet."
      />
      <section style={{ paddingBottom: 160 }}>
        <div className="wrap">
          <p>Liste des articles : étape suivante.</p>
        </div>
      </section>
    </main>
  );
}
