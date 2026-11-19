import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { uploadsConfigured } from "@/lib/upload";
import PostForm from "../PostForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>{post.title}</h1>
          <p>Article</p>
        </div>
        <Link href="/admin/posts" className="adm-btn">
          Retour
        </Link>
      </div>
      <div className="adm-card">
        <PostForm
          postId={post.id}
          uploadsEnabled={uploadsConfigured()}
          initial={{
            title: post.title,
            slug: post.slug,
            category: post.category,
            excerpt: post.excerpt,
            content: post.content,
            coverImage: post.coverImage,
            featured: post.featured,
            published: post.published,
          }}
        />
      </div>
    </>
  );
}
