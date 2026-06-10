import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { Lang } from "@/lib/translations";
import { HomePageClient } from "./HomePageClient";
import { posts } from "./blog/_posts";

const BASE = "https://pawlabo.com";

export const metadata: Metadata = {
  title: "Paw Labo | Your Pet's Past Life — AI Powered, Free",
  description: "Upload your pet's photo and discover who they were in a past life. AI readings for cats, dogs, and more. Free forever.",
  keywords: ["pet past life", "cat past life", "dog past life", "AI pet reading", "past life test", "free pet horoscope"],
  alternates: {
    canonical: BASE,
  },
  openGraph: {
    title: "Paw Labo — Your Pet's Past Life",
    description: "Who was your pet in a past life? Find out in seconds with AI.",
    url: BASE,
    type: "website",
    siteName: "Paw Labo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paw Labo — Your Pet's Past Life",
    description: "Who was your pet in a past life? Find out in seconds with AI.",
  },
};

export default async function HomePage() {
  const cookieStore = await cookies();
  const lang: Lang = (cookieStore.get("NEXT_LOCALE")?.value as Lang) ?? "en";
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)
    .map((p) => ({ slug: p.slug, title: p.title, titleKo: p.titleKo }));
  return <HomePageClient lang={lang} recentPosts={recentPosts} />;
}
