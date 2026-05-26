import type { Metadata } from "next";
import { cookies } from "next/headers";
import { translations, type Lang } from "@/lib/translations";

export const metadata: Metadata = {
  title: "About — Pet Past Life",
  description:
    "Learn how Pet Past Life uses AI to generate fun fictional past-life stories for your pet.",
};

export default async function AboutPage() {
  const cookieStore = await cookies();
  const lang: Lang = (cookieStore.get("NEXT_LOCALE")?.value as Lang) ?? "en";
  const t = translations.about;

  return (
    <main className="page-wrap" style={{ alignItems: "flex-start", paddingTop: "4rem" }}>
      <div style={{ width: "100%", maxWidth: "42rem", margin: "0 auto" }}>
        <div className="card">
          <div className="card-header">
            <h1 className="title">{t.title[lang]}</h1>
            <p className="subtitle">{t.subtitle[lang]}</p>
          </div>

          <Section title={t.s1Title[lang]}>
            {t.s1Body[lang]}
          </Section>

          <Section title={t.s2Title[lang]}>
            {t.s2Prefix[lang]}<strong>{t.s2Body[lang]}</strong>{t.s2After[lang]}
          </Section>

          <Section title={t.s3Title[lang]}>
            {t.s3Body[lang]}
          </Section>

          <Section title={t.s4Title[lang]}>
            {t.s4Body[lang]}
          </Section>

          <Section title={t.s5Title[lang]}>
            {t.s5Body[lang]}{" "}
            <a href="mailto:rs21140@hanyang.ac.kr" style={{ color: "#6B1F2C" }}>
              rs21140@hanyang.ac.kr
            </a>
          </Section>
        </div>

        <p className="footer-note" style={{ marginTop: "1.5rem" }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.6)" }}>
            {t.tryItNow[lang]}
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
