import type { Metadata } from "next";
import { cookies } from "next/headers";
import { translations, type Lang } from "@/lib/translations";

const BASE = "https://petpastlife.vercel.app";

export const metadata: Metadata = {
  title: "Privacy Policy — Pet Past Life",
  description:
    "Pet Past Life privacy policy. We do not store your photos or pet data. Learn how your information is handled.",
  alternates: { canonical: `${BASE}/privacy` },
  openGraph: {
    title: "Privacy Policy — Pet Past Life",
    description: "We do not store your photos or pet data.",
    url: `${BASE}/privacy`,
    type: "website",
  },
  robots: { index: false, follow: true },
};

export default async function PrivacyPage() {
  const cookieStore = await cookies();
  const lang: Lang = (cookieStore.get("NEXT_LOCALE")?.value as Lang) ?? "en";
  const t = translations.privacy;

  return (
    <main className="page-wrap" style={{ alignItems: "flex-start", paddingTop: "4rem" }}>
      <div style={{ width: "100%", maxWidth: "42rem", margin: "0 auto" }}>
        <div className="card">
          <h1 className="title" style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
            {t.title[lang]}
          </h1>
          <p style={{ fontSize: "0.8rem", color: "#9CA3AF", marginTop: 0, marginBottom: "2rem" }}>
            {t.lastUpdated[lang]}
          </p>

          <Section title={t.s1Title[lang]}>
            {t.s1Body[lang]}
          </Section>

          <Section title={t.s2Title[lang]}>
            {t.s2Intro[lang]}
            <ul>
              <li>{t.s2Item1[lang]}</li>
              <li>{t.s2Item2[lang]}</li>
              <li>{t.s2Item3[lang]}</li>
            </ul>
            <strong>{t.s2NoStore[lang]}</strong> {t.s2After[lang]}
          </Section>

          <Section title={t.s3Title[lang]}>
            {t.s3Body[lang]}
          </Section>

          <Section title={t.s4Title[lang]}>
            {t.s4Prefix[lang]}<strong>{t.s4Service[lang]}</strong>
            {t.s4Middle[lang]}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#6B1F2C" }}
            >
              {t.s4Link[lang]}
            </a>
            {t.s4After[lang]}
          </Section>

          <Section title={t.s5Title[lang]}>
            {t.s5Body[lang]}
          </Section>

          <Section title={t.s6Title[lang]}>
            {t.s6Body[lang]}
          </Section>

          <Section title={t.s7Title[lang]}>
            {t.s7Prefix[lang]}{" "}
            <a href="mailto:rs21140@hanyang.ac.kr" style={{ color: "#6B1F2C" }}>
              rs21140@hanyang.ac.kr
            </a>
          </Section>
        </div>

        <p className="footer-note" style={{ marginTop: "1.5rem" }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.6)" }}>
            {t.back[lang]}
          </a>
        </p>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "1.75rem" }}>
      <h2
        style={{
          fontSize: "0.65rem",
          letterSpacing: "0.2em",
          fontWeight: 600,
          textTransform: "uppercase",
          color: "#6B1F2C",
          marginBottom: "0.5rem",
          marginTop: 0,
        }}
      >
        {title}
      </h2>
      <div style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "#374151" }}>
        {children}
      </div>
    </div>
  );
}
