import Link from "next/link";
import type { PostData } from "@/lib/data";

export default function BlogCard({ post }: { post: PostData }) {
  return (
    <Link href={`/blog/${post.slug}`} className="bcard" data-cur="Lire">
      <div className="im">
        <img src={`/img/${post.image}.jpg`} alt="" loading="lazy" />
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
