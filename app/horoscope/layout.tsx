import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pet Horoscope — Daily Cosmic Forecast for Your Pet",
  description:
    "Get your pet's daily horoscope based on their birthday and star sign. Free AI-powered cosmic forecast for cats, dogs, and more.",
  openGraph: {
    title: "Pet Horoscope",
    description: "Daily cosmic forecast for your pet — free & AI-powered.",
  },
  twitter: {
    card: "summary",
    title: "Pet Horoscope",
    description: "Daily cosmic forecast for your pet.",
  },
};

export default function HoroscopeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
