import Link from "next/link";
import { uploadsConfigured } from "@/lib/upload";
import PostForm from "../PostForm";

export default function NewPostPage() {
  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Nouvel article</h1>
        </div>
        <Link href="/admin/posts" className="adm-btn">
          Retour
        </Link>
      </div>
      <div className="adm-card">
        <PostForm uploadsEnabled={uploadsConfigured()} />
      </div>
    </>
  );
}
