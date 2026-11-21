import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { uploadsConfigured } from "@/lib/upload";
import PageHeader from "@/components/admin/layout/PageHeader";
import Button from "@/components/admin/ui/Button";
import PostForm from "../PostForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <>
      <PageHeader
        title={post.title}
        description="Article"
        actions={
          <Link href="/admin/posts">
            <Button variant="outline">
              <ArrowLeft className="size-4" /> Retour
            </Button>
          </Link>
        }
      />
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
    </>
  );
}
