import Link from "next/link";
import type { PostView } from "@/lib/queries";
import BlogCard from "@/components/BlogCard";
import Arrow from "@/components/icons/Arrow";

export default function BlogPreview({ posts }: { posts: PostView[] }) {
  return (
    <section className="sec" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 32, flexWrap: "wrap", marginBottom: 72 }}>
          <div>
            <div className="lab navy" data-up>
              (05) &nbsp;Journal
            </div>
            <h2 className="sf h2" style={{ marginTop: 24 }} data-split>
              <span className="ln">
                <span>Idées &amp;</span>
              </span>
              <span className="ln">
                <span>
                  <em>conseils</em>
                </span>
              </span>
            </h2>
          </div>
          <Link href="/blog" className="btn mag">
            <span className="t">
              <span>Tout le journal</span>
              <span>Tout le journal</span>
            </span>
            <Arrow />
          </Link>
        </div>
        <div className="bgrid" id="hblog">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
