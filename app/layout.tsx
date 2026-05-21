import type { Metadata } from "next";
import { Outfit, Italiana } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Pet Past Life — Discover who your pet was before",
  description:
    "Upload a photo of your pet and reveal who they were in a past life.",
  openGraph: {
    title: "Pet Past Life",
    description: "Who was your pet in a past life?",
    type: "website",
  },
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
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
