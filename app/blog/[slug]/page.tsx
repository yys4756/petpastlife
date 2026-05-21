import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { posts, getPost } from "../_posts";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Pet Past Life`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <main className="page-wrap" style={{ alignItems: "flex-start", paddingTop: "4rem" }}>
      <div style={{ width: "100%", maxWidth: "42rem", margin: "0 auto" }}>
        <div className="card">
          <div
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#9CA3AF",
              marginBottom: "0.75rem",
            }}
          >
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          <h1
            style={{
              fontFamily: "var(--font-italiana), Georgia, serif",
              fontSize: "2rem",
              lineHeight: 1.2,
              color: "#1F2937",
              margin: "0 0 1rem",
              fontWeight: 400,
            }}
          >
            {post.title}
          </h1>

          <p
            style={{
              fontSize: "1rem",
              color: "#6B7280",
              lineHeight: 1.6,
              margin: "0 0 2rem",
              fontStyle: "italic",
            }}
          >
            {post.excerpt}
          </p>

          <div
            style={{
              height: "1px",
              background: "#E5E7EB",
              marginBottom: "2rem",
            }}
          />

          <div className="prose-content">{post.content}</div>
        </div>

        <p className="footer-note" style={{ marginTop: "1.5rem" }}>
          <Link href="/blog" style={{ color: "rgba(255,255,255,0.6)" }}>
            ← All posts
          </Link>
          {" · "}
          <Link href="/" style={{ color: "rgba(255,255,255,0.6)" }}>
            Try Pet Past Life
          </Link>
        </p>
      </div>
    </main>
  );
}
