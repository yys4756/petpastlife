import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { Lang } from "@/lib/translations";
import { HoroscopePageClient } from "./HoroscopePageClient";

const BASE = "https://petpastlife.vercel.app";

export const metadata: Metadata = {
  title: "Pet Horoscope | Paw Labo — Daily AI Zodiac Reading",
  description:
    "Get your pet's daily horoscope by star sign. Free AI-powered cosmic readings for cats, dogs, rabbits, and more. Paw Labo.",
  alternates: { canonical: `${BASE}/horoscope` },
  openGraph: {
    title: "Pet Horoscope — Paw Labo",
    description: "Daily cosmic forecast for your pet based on their birthday and star sign.",
    url: `${BASE}/horoscope`,
    type: "website",
    siteName: "Paw Labo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pet Horoscope — Paw Labo",
    description: "Daily cosmic forecast for your pet based on their birthday and star sign.",
  },
};

export default async function HoroscopePage() {
  const cookieStore = await cookies();
  const lang: Lang = (cookieStore.get("NEXT_LOCALE")?.value as Lang) ?? "en";
  return <HoroscopePageClient lang={lang} />;
}
