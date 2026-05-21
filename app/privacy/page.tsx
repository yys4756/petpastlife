import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Pet Past Life",
};

export default function PrivacyPage() {
  return (
    <main className="page-wrap" style={{ alignItems: "flex-start", paddingTop: "4rem" }}>
      <div style={{ width: "100%", maxWidth: "42rem", margin: "0 auto" }}>
        <div className="card">
          <h1 className="title" style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: "0.8rem", color: "#9CA3AF", marginTop: 0, marginBottom: "2rem" }}>
            Last updated: May 2025
          </p>

          <Section title="Overview">
            Pet Past Life (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;the Service&rdquo;) is a free entertainment tool that
            generates fictional past-life stories for pets. We are committed to
            protecting your privacy.
          </Section>

          <Section title="Information We Collect">
            When you use the Service you submit:
            <ul>
              <li>A photo of your pet</li>
              <li>Your pet&apos;s name and gender</li>
              <li>An optional personality descriptor</li>
            </ul>
            <strong>We do not store any of this data.</strong> Your photo and pet
            details are transmitted directly to Google&apos;s AI API to generate the
            story and are discarded immediately after. Nothing is saved to a
            database or third-party storage.
          </Section>

          <Section title="How We Use Your Data">
            The photo and pet details you submit are used solely to generate the
            fictional past-life story displayed on screen. They are not used for
            training, advertising targeting, or any other purpose.
          </Section>

          <Section title="Third-Party Services">
            We use <strong>Google AI Studio</strong> (Gemma models) to generate
            stories. Your photo is sent to Google&apos;s servers as part of this
            request. Please review{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#6B1F2C" }}
            >
              Google&apos;s Privacy Policy
            </a>{" "}
            for details on how they handle data.
          </Section>

          <Section title="Cookies &amp; Analytics">
            We do not use cookies, tracking pixels, or analytics at this time.
          </Section>

          <Section title="Children's Privacy">
            The Service is not directed at children under 13. We do not
            knowingly collect personal information from children under 13.
          </Section>

          <Section title="Contact">
            If you have questions about this policy, contact us at{" "}
            <a href="mailto:rs21140@hanyang.ac.kr" style={{ color: "#6B1F2C" }}>
              rs21140@hanyang.ac.kr
            </a>
            .
          </Section>
        </div>

        <p className="footer-note" style={{ marginTop: "1.5rem" }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.6)" }}>
            ← Back to Pet Past Life
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
