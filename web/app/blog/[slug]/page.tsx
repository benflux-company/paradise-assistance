import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import RevealMain from "@/components/RevealMain";
import { getPostBySlug, getNextPost } from "@/lib/queries";
import { renderMarkdown } from "@/lib/markdown";
import Arrow from "@/components/icons/Arrow";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) redirect("/blog");

  const next = await getNextPost(post.slug);

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
              <img src={post.image} alt="" />
            </div>
            {post.content.trim() ? (
              <div className="body" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />
            ) : (
              <div className="ph-box">[Contenu de l&apos;article à rédiger]</div>
            )}
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
              {next && (
                <Link href={`/blog/${next.slug}`} className="btn fill">
                  <span className="t">
                    <span>Article suivant</span>
                    <span>Article suivant</span>
                  </span>
                  <Arrow />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </RevealMain>
  );
}
