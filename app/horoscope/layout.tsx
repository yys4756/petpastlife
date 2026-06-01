import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { Lang } from "@/lib/translations";

const BASE = "https://pawlabo.com";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const lang: Lang = (cookieStore.get("NEXT_LOCALE")?.value as Lang) ?? "en";
  const isKo = lang === "ko";

  const title = isKo
    ? "반려동물 별자리 운세 | Paw Labo — 오늘의 AI 운세"
    : "Pet Horoscope | Paw Labo — Daily AI Zodiac Reading";
  const description = isKo
    ? "반려동물의 생일과 별자리로 오늘의 운세를 확인하세요. 무료 AI 별자리 운세. Paw Labo."
    : "Get your pet's daily horoscope by star sign. Free AI-powered cosmic forecast for cats, dogs, and more. Paw Labo.";
  const ogTitle = isKo ? "반려동물 별자리 운세 — Paw Labo" : "Pet Horoscope — Paw Labo";
  const ogDesc = isKo
    ? "오늘 반려동물의 운세를 확인하세요. 무료 AI 서비스."
    : "Daily cosmic forecast for your pet — free & AI-powered.";

  return {
    title,
    description,
    keywords: isKo
      ? ["반려동물 운세", "강아지 별자리", "고양이 별자리", "펫 운세", "반려동물 별자리 운세", "무료 운세"]
      : ["pet horoscope", "dog zodiac", "cat zodiac", "pet astrology", "daily pet forecast", "free pet horoscope"],
    alternates: {
      canonical: `${BASE}/horoscope`,
    },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: `${BASE}/horoscope`,
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

export default function HoroscopeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
