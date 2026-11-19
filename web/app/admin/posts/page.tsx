import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PostsTable from "./PostsTable";
import HomePreviewManager from "./HomePreviewManager";

export const dynamic = "force-dynamic";

export default async function PostsAdminPage() {
  const posts = await prisma.post.findMany({ orderBy: { order: "asc" } });

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Blog & actualités</h1>
          <p>{posts.length} article(s).</p>
        </div>
        <Link href="/admin/posts/new" className="adm-btn primary">
          Nouvel article
        </Link>
      </div>

      <HomePreviewManager
        posts={posts
          .filter((p) => p.homeOrder !== null)
          .sort((a, b) => (a.homeOrder ?? 0) - (b.homeOrder ?? 0))
          .map((p) => ({ id: p.id, title: p.title }))}
        allPosts={posts.map((p) => ({ id: p.id, title: p.title }))}
      />

      <div className="adm-card" style={{ padding: 0, overflowX: "auto" }}>
        <PostsTable
          posts={posts.map((p) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            category: p.category,
            featured: p.featured,
            published: p.published,
            cover: p.coverImage,
          }))}
        />
      </div>
    </>
  );
}
