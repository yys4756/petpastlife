import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { Lang } from "@/lib/translations";

const BASE = "https://petpastlife.vercel.app";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const lang: Lang = (cookieStore.get("NEXT_LOCALE")?.value as Lang) ?? "en";
  const isKo = lang === "ko";

  return {
    title: isKo
      ? "반려동물 별자리 운세 — 오늘의 우주 예보"
      : "Pet Horoscope — Daily Cosmic Forecast for Your Pet",
    description: isKo
      ? "반려동물의 생일과 별자리로 오늘의 운세를 확인하세요. 무료 AI 별자리 운세."
      : "Get your pet's daily horoscope based on their birthday and star sign. Free AI-powered cosmic forecast for cats, dogs, and more.",
    alternates: {
      canonical: `${BASE}/horoscope`,
      languages: { en: `${BASE}/horoscope`, ko: `${BASE}/horoscope` },
    },
    openGraph: {
      title: isKo ? "반려동물 별자리 운세" : "Pet Horoscope",
      description: isKo
        ? "오늘 반려동물의 운세를 확인하세요. 무료 AI 서비스."
        : "Daily cosmic forecast for your pet — free & AI-powered.",
    },
    twitter: {
      card: "summary",
      title: isKo ? "반려동물 별자리 운세" : "Pet Horoscope",
      description: isKo
        ? "오늘 반려동물의 운세를 확인하세요."
        : "Daily cosmic forecast for your pet.",
    },
  };
}

export default function HoroscopeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
