import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Outfit, Italiana } from "next/font/google";
import Script from "next/script";
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

const BASE = "https://pawlabo.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "Paw Labo | Your Pet's Past Life — AI Powered, Free",
    template: "%s | Paw Labo",
  },
  description: "Upload a photo of your pet and reveal who they were in a past life. AI readings for cats, dogs, and more. Free forever.",
  openGraph: {
    title: "Paw Labo — Your Pet's Past Life",
    description: "Who was your pet in a past life? Find out in seconds with AI.",
    type: "website",
    url: BASE,
    siteName: "Paw Labo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paw Labo — Your Pet's Past Life",
    description: "Who was your pet in a past life? Find out in seconds with AI.",
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
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-8Y2554H952" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-8Y2554H952');
        `}</Script>
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
                  name: "Paw Labo",
                  description: "Upload a photo of your pet and reveal who they were in a past life.",
                },
                {
                  "@type": "WebApplication",
                  "@id": `${BASE}/#app`,
                  name: "Paw Labo",
                  url: BASE,
                  applicationCategory: "EntertainmentApplication",
                  operatingSystem: "Web",
                  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
                  description: "AI-powered past life story generator for pets.",
                },
                {
                  "@type": "Organization",
                  "@id": `${BASE}/#org`,
                  name: "Paw Labo",
                  url: BASE,
                  sameAs: [`${BASE}`],
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
