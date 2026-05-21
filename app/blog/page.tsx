import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "./_posts";

export const metadata: Metadata = {
  title: "Blog — Pet Past Life",
  description:
    "Stories, science, and history about pets, past lives, and the ancient bond between animals and humans.",
};

export default function BlogPage() {
  const sorted = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <main className="page-wrap" style={{ alignItems: "flex-start", paddingTop: "4rem" }}>
      <div style={{ width: "100%", maxWidth: "42rem", margin: "0 auto" }}>
        <div className="card">
          <div className="card-header">
            <h1 className="title" style={{ fontSize: "2.5rem" }}>Blog</h1>
            <p className="subtitle">
              Stories, science, and history about pets and their past lives.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {sorted.map((post) => (
              <article key={post.slug}>
                <div
                  style={{
                    fontSize: "0.7rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#9CA3AF",
                    marginBottom: "0.35rem",
                  }}
                >
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.15rem", lineHeight: 1.3 }}>
                  <Link
                    href={`/blog/${post.slug}`}
                    style={{ color: "#1F2937", textDecoration: "none" }}
                  >
                    {post.title}
                  </Link>
                </h2>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#6B7280", lineHeight: 1.6 }}>
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  style={{
                    display: "inline-block",
                    marginTop: "0.6rem",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "#6B1F2C",
                    textDecoration: "none",
                  }}
                >
                  Read more →
                </Link>

                <div
                  style={{
                    height: "1px",
                    background: "#E5E7EB",
                    marginTop: "1.5rem",
                  }}
                />
              </article>
            ))}
          </div>
        </div>

        <p className="footer-note" style={{ marginTop: "1.5rem" }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.6)" }}>
            ← Try Pet Past Life
          </a>
        </p>
      </div>
    </main>
  );
}
