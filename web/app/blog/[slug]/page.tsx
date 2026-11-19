import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import RevealMain from "@/components/RevealMain";
import { POSTS } from "@/lib/data";
import Arrow from "@/components/icons/Arrow";

function findPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) redirect("/blog");

  const next = POSTS[(POSTS.indexOf(post) + 1) % POSTS.length];

  return (
    <RevealMain id="p-article" dataT="Article">
      <section className="ph" style={{ paddingBottom: 40 }}>
        <div className="wrap">
          <div className="art">
            <Link href="/blog" className="ul lab navy">
              &larr; Retour au journal
            </Link>
            <div className="lab navy" style={{ marginTop: 56 }}>
              {post.category}
            </div>
            <h1 className="sf">{post.title}</h1>
            <p className="lead">{post.excerpt}</p>
          </div>
        </div>
      </section>
      <section style={{ paddingBottom: 160 }}>
        <div className="wrap">
          <div className="art">
            <div className="hero-i par">
              <img src={`/img/${post.image}.jpg`} alt="" />
            </div>
            <div className="ph-box">[Contenu de l&apos;article à rédiger]</div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 24,
                flexWrap: "wrap",
                marginTop: 72,
                paddingTop: 32,
                borderTop: "1px solid var(--line)",
              }}
            >
              <Link href="/blog" className="btn">
                <span className="t">
                  <span>Tous les articles</span>
                  <span>Tous les articles</span>
                </span>
              </Link>
              <Link href={`/blog/${next.slug}`} className="btn fill">
                <span className="t">
                  <span>Article suivant</span>
                  <span>Article suivant</span>
                </span>
                <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </RevealMain>
  );
}
