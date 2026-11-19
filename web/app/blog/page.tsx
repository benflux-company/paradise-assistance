import type { Metadata } from "next";
import Link from "next/link";
import RevealMain from "@/components/RevealMain";
import PageHead from "@/components/PageHead";
import BlogList from "@/components/blog/BlogList";
import { getFeaturedPost, getPosts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Conseils de fabrication, coulisses de chantier et idées d'aménagement pour mieux préparer votre projet.",
};

export default async function BlogPage() {
  const [featured, posts] = await Promise.all([getFeaturedPost(), getPosts()]);

  return (
    <RevealMain id="p-blog" dataT="Blog">
      <PageHead
        current="Blog"
        titleLines={["Le", "journal"]}
        description="Conseils de fabrication, coulisses de chantier et idées d'aménagement pour mieux préparer votre projet."
      />
      {featured && (
        <section style={{ paddingBottom: 120 }}>
          <div className="wrap">
            <Link href={`/blog/${featured.slug}`} className="feat">
              <div className="im par">
                <img src={featured.image} alt="" />
              </div>
              <div>
                <div className="lab navy">À la une &middot; {featured.category}</div>
                <h2 className="sf">{featured.title}</h2>
                <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--muted)", marginBottom: 36 }}>{featured.excerpt}</p>
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
      )}
      <BlogList posts={posts} />
    </RevealMain>
  );
}
