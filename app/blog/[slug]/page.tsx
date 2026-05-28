import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { posts, getPost } from "../_posts";
import { translations, type Lang } from "@/lib/translations";

const BASE = "https://petpastlife.vercel.app";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const cookieStore = await cookies();
  const lang: Lang = (cookieStore.get("NEXT_LOCALE")?.value as Lang) ?? "en";
  const isKo = lang === "ko";

  const title = isKo ? (post.titleKo ?? post.title) : post.title;
  const description = isKo ? (post.excerptKo ?? post.excerpt) : post.excerpt;
  const siteName = isKo ? "반려동물 전생" : "Pet Past Life";
  const url = `${BASE}/blog/${slug}`;

  return {
    title: `${title} — ${siteName}`,
    description,
    alternates: {
      canonical: url,
      languages: { en: url, ko: url },
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
      siteName,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const cookieStore = await cookies();
  const lang: Lang = (cookieStore.get("NEXT_LOCALE")?.value as Lang) ?? "en";
  const t = translations.post;

  const title = lang === "ko" ? (post.titleKo ?? post.title) : post.title;
  const excerpt = lang === "ko" ? (post.excerptKo ?? post.excerpt) : post.excerpt;
  const content = lang === "ko" ? (post.contentKo ?? post.content) : post.content;
  const locale = lang === "ko" ? "ko-KR" : "en-US";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    author: { "@type": "Organization", name: "Pet Past Life" },
    publisher: {
      "@type": "Organization",
      name: "Pet Past Life",
      url: "https://petpastlife.vercel.app",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://petpastlife.vercel.app/blog/${post.slug}`,
    },
  };

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
            {new Date(post.date).toLocaleDateString(locale, {
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
            {title}
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
            {excerpt}
          </p>

          <div
            style={{
              height: "1px",
              background: "#E5E7EB",
              marginBottom: "2rem",
            }}
          />

          {post.image && (
            <img
              src={post.image}
              alt={title}
              style={{
                width: "100%",
                height: "260px",
                objectFit: "cover",
                borderRadius: "0.5rem",
                marginBottom: "2rem",
                display: "block",
              }}
            />
          )}

          <div className="prose-content">{content}</div>

          <div
            style={{
              marginTop: "2.5rem",
              padding: "1.5rem",
              background: "linear-gradient(135deg, #fdf2f4 0%, #f9e8eb 100%)",
              borderRadius: "0.75rem",
              border: "1px solid #f0d0d5",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-italiana), Georgia, serif",
                fontSize: "1.3rem",
                color: "#6B1F2C",
                margin: "0 0 0.5rem",
                fontWeight: 400,
              }}
            >
              {lang === "ko"
                ? "반려동물의 전생이 궁금하세요?"
                : "Curious about your pet's past life?"}
            </p>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#6B7280",
                margin: "0 0 1.25rem",
                lineHeight: 1.5,
              }}
            >
              {lang === "ko"
                ? "사진을 업로드하면 AI가 30초 만에 전생을 알려드려요. 무료예요."
                : "Upload a photo for an instant AI reading — free, takes 30 seconds."}
            </p>
            <Link
              href="/"
              style={{
                display: "inline-block",
                padding: "0.6rem 1.5rem",
                background: "#6B1F2C",
                color: "#fff",
                borderRadius: "2rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                textDecoration: "none",
                letterSpacing: "0.02em",
              }}
            >
              {lang === "ko" ? "전생 알아보기 →" : "Reveal Past Life →"}
            </Link>
          </div>
        </div>

        <p className="footer-note" style={{ marginTop: "1.5rem" }}>
          <Link href="/blog" style={{ color: "rgba(255,255,255,0.6)" }}>
            {t.allPosts[lang]}
          </Link>
          {" · "}
          <Link href="/" style={{ color: "rgba(255,255,255,0.6)" }}>
            {t.tryPastLife[lang]}
          </Link>
        </p>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
