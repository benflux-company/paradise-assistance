import Link from "next/link";
import type { PostView } from "@/lib/queries";

export default function BlogCard({ post }: { post: PostView }) {
  return (
    <Link href={`/blog/${post.slug}`} className="bcard" data-cur="Lire">
      <div className="im">
        <img src={post.image} alt="" loading="lazy" />
        <span className="tag">{post.category}</span>
      </div>
      <h3 className="sf">{post.title}</h3>
      <p>{post.excerpt}</p>
      <span className="more">
        Lire l&apos;article <i></i>
      </span>
    </Link>
  );
}
