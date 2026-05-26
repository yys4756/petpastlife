import { cookies } from "next/headers";
import type { Lang } from "@/lib/translations";
import { HomePageClient } from "./HomePageClient";

export default async function HomePage() {
  const cookieStore = await cookies();
  const lang: Lang = (cookieStore.get("NEXT_LOCALE")?.value as Lang) ?? "en";
  return <HomePageClient lang={lang} />;
}
