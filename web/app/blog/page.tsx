import type { Metadata } from "next";
import Link from "next/link";
import RevealMain from "@/components/RevealMain";
import PageHead from "@/components/PageHead";
import BlogList from "@/components/blog/BlogList";
import { POSTS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Conseils de fabrication, coulisses de chantier et idées d'aménagement pour mieux préparer votre projet.",
};

export default function BlogPage() {
  const featured = POSTS.find((p) => p.id === 1)!;

  return (
    <RevealMain id="p-blog" dataT="Blog">
      <PageHead
        current="Blog"
        titleLines={["Le", "journal"]}
        description="Conseils de fabrication, coulisses de chantier et idées d'aménagement pour mieux préparer votre projet."
      />
      <section style={{ paddingBottom: 120 }}>
        <div className="wrap">
          <Link href={`/blog/${featured.slug}`} className="feat">
            <div className="im par">
              <img src={`/img/${featured.image}.jpg`} alt="Mur TV en lamelles noires avec panneau laqué blanc" />
            </div>
            <div>
              <div className="lab navy">À la une &middot; {featured.category}</div>
              <h2 className="sf">
                Mur TV en lamelles&nbsp;: comment il se construit
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--muted)", marginBottom: 36 }}>
                De l&apos;ossature aux lamelles, en passant par le panneau laqué et l&apos;éclairage LED : les étapes d&apos;un mur TV sur
                mesure.
              </p>
              <span className="btn fill">
                <span className="t">
                  <span>Lire l&apos;article</span>
                  <span>Lire l&apos;article</span>
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                  <path d="M4 12h15M13 6l6 6-6 6" />
                </svg>
              </span>
            </div>
          </Link>
        </div>
      </section>
      <BlogList />
    </RevealMain>
  );
}
