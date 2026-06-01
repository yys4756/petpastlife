import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { Lang } from "@/lib/translations";
import { HomePageClient } from "./HomePageClient";
import { posts } from "./blog/_posts";

const BASE = "https://petpastlife.vercel.app";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const lang: Lang = (cookieStore.get("NEXT_LOCALE")?.value as Lang) ?? "en";
  const isKo = lang === "ko";

  const title = isKo
    ? "Paw Labo | 반려동물 전생 AI — 무료, 즉시 확인"
    : "Paw Labo | Your Pet's Past Life — AI Powered, Free";
  const description = isKo
    ? "반려동물 사진을 업로드하면 AI가 전생을 즉시 알려드려요. 고양이, 강아지 등 모든 반려동물. 무료."
    : "Upload your pet's photo and discover who they were in a past life. AI readings for cats, dogs, and more. Free forever.";
  const ogTitle = isKo ? "Paw Labo — 반려동물 전생 AI" : "Paw Labo — Your Pet's Past Life";
  const ogDesc = isKo
    ? "반려동물의 전생을 AI로 알아보세요. 몇 초면 충분해요."
    : "Who was your pet in a past life? Find out in seconds with AI.";

  return {
    title,
    description,
    alternates: {
      canonical: BASE,
      languages: { en: BASE, ko: BASE },
    },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: BASE,
      type: "website",
      siteName: "Paw Labo",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDesc,
    },
  };
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const lang: Lang = (cookieStore.get("NEXT_LOCALE")?.value as Lang) ?? "en";
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)
    .map((p) => ({ slug: p.slug, title: p.title, titleKo: p.titleKo }));
  return <HomePageClient lang={lang} recentPosts={recentPosts} />;
}
