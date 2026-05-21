import type { Metadata } from "next";
import { Outfit, Italiana } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
  title: "Pet Past Life — Discover who your pet was before",
  description:
    "Upload a photo of your pet and reveal who they were in a past life. Powered by AI.",
  metadataBase: new URL(BASE),
  openGraph: {
    title: "Pet Past Life",
    description: "Who was your pet in a past life?",
    type: "website",
    url: BASE,
    siteName: "Pet Past Life",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pet Past Life",
    description: "Who was your pet in a past life?",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${italiana.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        {children}
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
