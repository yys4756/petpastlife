import { cookies } from "next/headers";
import type { Lang } from "@/lib/translations";
import { HoroscopePageClient } from "./HoroscopePageClient";

export default async function HoroscopePage() {
  const cookieStore = await cookies();
  const lang: Lang = (cookieStore.get("NEXT_LOCALE")?.value as Lang) ?? "en";
  return <HoroscopePageClient lang={lang} />;
}
