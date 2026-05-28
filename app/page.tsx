import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { Lang } from "@/lib/translations";
import { HomePageClient } from "./HomePageClient";

const BASE = "https://petpastlife.vercel.app";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const lang: Lang = (cookieStore.get("NEXT_LOCALE")?.value as Lang) ?? "en";
  const isKo = lang === "ko";

  return {
    title: isKo
      ? "내 반려동물의 전생은? — AI 반려동물 전생 알아보기"
      : "Your Pet's Past Life — Discover who your pet was before",
    description: isKo
      ? "반려동물 사진을 업로드하면 AI가 전생을 즉시 알려드려요. 무료."
      : "Upload a photo of your pet and reveal who they were in a past life. AI-powered, free, and instant.",
    alternates: {
      canonical: BASE,
      languages: { en: BASE, ko: BASE },
    },
    openGraph: {
      title: isKo ? "내 반려동물의 전생은?" : "Your Pet's Past Life",
      description: isKo
        ? "반려동물의 전생을 AI로 알아보세요. 몇 초면 충분해요."
        : "Who was your pet in a past life? Find out in seconds.",
      url: BASE,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: isKo ? "내 반려동물의 전생은?" : "Your Pet's Past Life",
      description: isKo
        ? "반려동물의 전생을 AI로 알아보세요. 몇 초면 충분해요."
        : "Who was your pet in a past life? Find out in seconds.",
    },
  };
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const lang: Lang = (cookieStore.get("NEXT_LOCALE")?.value as Lang) ?? "en";
  return <HomePageClient lang={lang} />;
}
