"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PhotoUpload } from "@/components/PhotoUpload";
import { GenderSelect, type Gender } from "@/components/GenderSelect";
import { PersonalitySelect, type Personality } from "@/components/PersonalitySelect";
import { ResultCard, type PastLifeData } from "@/components/ResultCard";
import { translations, type Lang } from "@/lib/translations";

const t = translations.home;

type RecentPost = { slug: string; title: string; titleKo: string };
type Step = "upload" | "details" | "submitting";

export function HomePageClient({
  lang,
  recentPosts,
}: {
  lang: Lang;
  recentPosts: RecentPost[];
}) {
  const [step, setStep] = useState<Step>("upload");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [personality, setPersonality] = useState<Personality | null>(null);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [result, setResult] = useState<PastLifeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const LOADING_MESSAGES = t.loadingMessages[lang];

  const handlePhotoChange = (file: File | null) => {
    setPhotoUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
    setPhoto(file);
  };

  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (step !== "submitting") {
      setLoadingIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingIndex((i) => Math.min(i + 1, LOADING_MESSAGES.length - 1));
    }, 12000);
    return () => clearInterval(interval);
  }, [step, LOADING_MESSAGES.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo || !name.trim() || !gender) return;

    setStep("submitting");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("photo", photo);
      formData.append("name", name.trim());
      formData.append("gender", gender);
      if (personality) formData.append("personality", personality);

      const res = await fetch("/api/past-life", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong");
      setResult(json.result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      setStep("details");
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setName("");
    setGender(null);
    setPersonality(null);
    handlePhotoChange(null);
    setStep("upload");
  };

  if (result) {
    return (
      <main className="page-wrap">
        <div className="page-inner fade-in">
          <ResultCard
            data={result}
            petName={name}
            photoUrl={photoUrl}
            photoFile={photo}
            onReset={handleReset}
          />
        </div>
      </main>
    );
  }

  const isKo = lang === "ko";

  return (
    <main className="page-wrap" style={{ alignItems: "flex-start" }}>
      <div className="page-inner fade-in" style={{ width: "100%", maxWidth: "36rem", margin: "0 auto", paddingBottom: "2rem" }}>

        {/* Hero */}
        <div className="card" style={{ marginBottom: "1rem" }}>
          <header className="card-header">
            <h1 className="title" style={{ fontSize: "1.75rem" }}>{t.title[lang]}</h1>
            <p className="subtitle">{t.subtitle[lang]}</p>
          </header>

          {step === "upload" && (
            <>
              <PhotoUpload onPhotoSelected={handlePhotoChange} />
              <p style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: "0.5rem", marginBottom: 0, textAlign: "center" }}>
                {t.photoPrivacyNote[lang]}
              </p>
              <button
                type="button"
                onClick={() => setStep("details")}
                disabled={!photo}
                className="cta-button"
                style={{ marginTop: "1rem" }}
              >
                {t.cta[lang]}
              </button>
            </>
          )}

          {(step === "details" || step === "submitting") && (
            <form className="form" onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="name" className="field-label">{t.petName[lang]}</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.petNamePlaceholder[lang]}
                  maxLength={40}
                  disabled={step === "submitting"}
                  className="text-input"
                  autoFocus
                />
              </div>
              <GenderSelect value={gender} onChange={setGender} lang={lang} />
              <PersonalitySelect value={personality} onChange={setPersonality} lang={lang} />
              {error && <div className="error-banner">{error}</div>}
              <button
                type="submit"
                disabled={!name.trim() || !gender || step === "submitting"}
                className={`cta-button${step === "submitting" ? " is-loading" : ""}`}
              >
                {step === "submitting" ? (
                  <span className="loading-text">
                    <span className="loading-dot" />
                    {LOADING_MESSAGES[loadingIndex]}
                  </span>
                ) : (
                  t.cta[lang]
                )}
              </button>
            </form>
          )}
        </div>

        {/* Tools */}
        <div className="card" style={{ marginBottom: "1rem" }}>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9CA3AF", margin: "0 0 0.75rem" }}>
            {isKo ? "더 많은 AI 도구" : "More AI Tools"}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <Link href="/horoscope" style={{ textDecoration: "none" }}>
              <div style={{ border: "1px solid #E5E7EB", borderRadius: "0.5rem", padding: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "#374151" }}>
                ⭐ {isKo ? "내 반려동물 운세" : "My Pet's Horoscope"}
              </div>
            </Link>
            <div style={{ border: "1px solid #E5E7EB", borderRadius: "0.5rem", padding: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "#D1D5DB" }}>
              + {isKo ? "곧 추가" : "Coming soon"}
            </div>
          </div>
        </div>

        {/* Blog */}
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9CA3AF", margin: "0 0 0.25rem" }}>
            {isKo ? "블로그" : "Blog"}
          </p>
          {recentPosts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5625rem 0",
                borderTop: i > 0 ? "1px solid #F3F4F6" : undefined,
                fontSize: "0.8125rem",
                color: "#6B7280",
              }}
            >
              <span style={{ flex: 1 }}>{isKo ? post.titleKo : post.title}</span>
              <span style={{ color: "#9CA3AF", fontSize: "0.75rem", flexShrink: 0 }}>→</span>
            </Link>
          ))}
          <Link
            href="/blog"
            style={{
              textDecoration: "none",
              display: "block",
              textAlign: "center",
              padding: "0.5rem 0 0.25rem",
              borderTop: "1px solid #F3F4F6",
              fontSize: "0.75rem",
              color: "#9CA3AF",
              marginTop: "0.25rem",
            }}
          >
            {isKo ? "더보기 →" : "See all posts →"}
          </Link>
        </div>

        <p className="footer-note">
          <a href="/about" style={{ color: "rgba(255,255,255,0.75)" }}>{t.about[lang]}</a>
          {" · "}
          <a href="/privacy" style={{ color: "rgba(255,255,255,0.75)" }}>{t.privacy[lang]}</a>
          {" · "}
          <a href="/terms" style={{ color: "rgba(255,255,255,0.75)" }}>{t.terms[lang]}</a>
        </p>
      </div>
    </main>
  );
}
