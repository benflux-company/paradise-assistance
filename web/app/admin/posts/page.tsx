import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/admin/layout/PageHeader";
import Button from "@/components/admin/ui/Button";
import PostsTable from "./PostsTable";
import HomePreviewManager from "./HomePreviewManager";

export const dynamic = "force-dynamic";

export default async function PostsAdminPage() {
  const posts = await prisma.post.findMany({ orderBy: { order: "asc" } });

  return (
    <>
      <PageHeader
        title="Blog & actualités"
        description={`${posts.length} article(s).`}
        actions={
          <Link href="/admin/posts/new">
            <Button>
              <Plus className="size-4" /> Nouvel article
            </Button>
          </Link>
        }
      />

      <HomePreviewManager
        posts={posts
          .filter((p) => p.homeOrder !== null)
          .sort((a, b) => (a.homeOrder ?? 0) - (b.homeOrder ?? 0))
          .map((p) => ({ id: p.id, title: p.title }))}
        allPosts={posts.map((p) => ({ id: p.id, title: p.title }))}
      />

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
    </>
  );
}
