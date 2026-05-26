import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { Lang } from "@/lib/translations";
import { HomePageClient } from "./HomePageClient";

const BASE = "https://petpastlife.vercel.app";

export const metadata: Metadata = {
  title: "Your Pet's Past Life — Discover who your pet was before",
  description:
    "Upload a photo of your pet and reveal who they were in a past life. AI-powered, free, and instant.",
  alternates: { canonical: BASE },
  openGraph: {
    title: "Your Pet's Past Life",
    description: "Who was your pet in a past life? Find out in seconds.",
    url: BASE,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Pet's Past Life",
    description: "Who was your pet in a past life? Find out in seconds.",
  },
};

export default async function HomePage() {
  const cookieStore = await cookies();
  const lang: Lang = (cookieStore.get("NEXT_LOCALE")?.value as Lang) ?? "en";
  return <HomePageClient lang={lang} />;
}
