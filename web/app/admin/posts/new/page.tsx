import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { uploadsConfigured } from "@/lib/upload";
import PageHeader from "@/components/admin/layout/PageHeader";
import Button from "@/components/admin/ui/Button";
import PostForm from "../PostForm";

export default function NewPostPage() {
  return (
    <>
      <PageHeader
        title="Nouvel article"
        actions={
          <Link href="/admin/posts">
            <Button variant="outline">
              <ArrowLeft className="size-4" /> Retour
            </Button>
          </Link>
        }
      />
      <PostForm uploadsEnabled={uploadsConfigured()} />
    </>
  );
}
