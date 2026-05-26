import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Outfit, Italiana } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { NavBar } from "@/components/NavBar";
import { LanguageToggle } from "@/components/LanguageToggle";
import type { Lang } from "@/lib/translations";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const italiana = Italiana({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-italiana",
  display: "swap",
});

const BASE = "https://petpastlife.vercel.app";

export const metadata: Metadata = {
  title: "Your Pet's Past Life — Discover who your pet was before",
  description:
    "Upload a photo of your pet and reveal who they were in a past life. Powered by AI.",
  metadataBase: new URL(BASE),
  openGraph: {
    title: "Your Pet's Past Life",
    description: "Who was your pet in a past life?",
    type: "website",
    url: BASE,
    siteName: "Your Pet's Past Life",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Pet's Past Life",
    description: "Who was your pet in a past life?",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const lang: Lang = (cookieStore.get("NEXT_LOCALE")?.value as Lang) ?? "en";

  return (
    <html
      lang={lang}
      className={`${outfit.variable} ${italiana.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <NavBar lang={lang} />
        {children}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingBottom: "1.5rem",
          }}
        >
          <LanguageToggle lang={lang} />
        </div>
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${BASE}/#website`,
                  url: BASE,
                  name: "Pet Past Life",
                  description: "Upload a photo of your pet and reveal who they were in a past life.",
                },
                {
                  "@type": "WebApplication",
                  "@id": `${BASE}/#app`,
                  name: "Pet Past Life",
                  url: BASE,
                  applicationCategory: "EntertainmentApplication",
                  operatingSystem: "Web",
                  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
                  description: "AI-powered past life story generator for pets.",
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
