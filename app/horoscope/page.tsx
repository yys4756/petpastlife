import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { Lang } from "@/lib/translations";
import { HoroscopePageClient } from "./HoroscopePageClient";

const BASE = "https://petpastlife.vercel.app";

export const metadata: Metadata = {
  title: "Pet Horoscope — Daily Cosmic Forecast for Your Pet",
  description:
    "Get your pet's daily horoscope based on their zodiac sign. Free AI-powered cosmic readings for cats, dogs, rabbits, and more.",
  alternates: { canonical: `${BASE}/horoscope` },
  openGraph: {
    title: "Pet Horoscope — Pet Past Life",
    description: "Daily cosmic forecast for your pet based on their birthday and star sign.",
    url: `${BASE}/horoscope`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pet Horoscope — Pet Past Life",
    description: "Daily cosmic forecast for your pet based on their birthday and star sign.",
  },
};

export default async function HoroscopePage() {
  const cookieStore = await cookies();
  const lang: Lang = (cookieStore.get("NEXT_LOCALE")?.value as Lang) ?? "en";
  return <HoroscopePageClient lang={lang} />;
}
