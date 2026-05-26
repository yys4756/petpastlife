"use client";

import { useState, useEffect } from "react";
import { PhotoUpload } from "@/components/PhotoUpload";
import { GenderSelect, type Gender } from "@/components/GenderSelect";
import { PersonalitySelect, type Personality } from "@/components/PersonalitySelect";
import { ResultCard, type PastLifeData } from "@/components/ResultCard";
import { translations, type Lang } from "@/lib/translations";

const t = translations.home;

export function HomePageClient({ lang }: { lang: Lang }) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [personality, setPersonality] = useState<Personality | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [result, setResult] = useState<PastLifeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const LOADING_MESSAGES = t.loadingMessages[lang];

  const canSubmit = Boolean(photo && name.trim() && gender && !isSubmitting);

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
    if (!isSubmitting) {
      setLoadingIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingIndex((i) => Math.min(i + 1, LOADING_MESSAGES.length - 1));
    }, 12000);
    return () => clearInterval(interval);
  }, [isSubmitting, LOADING_MESSAGES.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !photo || !gender) return;

    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("photo", photo);
      formData.append("name", name.trim());
      formData.append("gender", gender);
      if (personality) formData.append("personality", personality);

      const res = await fetch("/api/past-life", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? "Something went wrong");
      }
      setResult(json.result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setName("");
    setGender(null);
    setPersonality(null);
    handlePhotoChange(null);
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

  return (
    <main className="page-wrap">
      <div className="page-inner fade-in">
        <div className="card">
          <header className="card-header">
            <div style={{ fontSize: "2.5rem", lineHeight: 1, marginBottom: "1rem" }}>🐾</div>
            <h1 className="title" style={{ fontSize: "2rem" }}>{t.title[lang]}</h1>
            <p className="subtitle">{t.subtitle[lang]}</p>
          </header>

          <form className="form" onSubmit={handleSubmit}>
            <PhotoUpload onPhotoSelected={handlePhotoChange} />

            <div className="field">
              <label htmlFor="name" className="field-label">
                {t.petName[lang]}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.petNamePlaceholder[lang]}
                maxLength={40}
                disabled={isSubmitting}
                className="text-input"
              />
            </div>

            <GenderSelect value={gender} onChange={setGender} lang={lang} />

            <PersonalitySelect value={personality} onChange={setPersonality} lang={lang} />

            {error && <div className="error-banner">{error}</div>}

            <button
              type="submit"
              disabled={!canSubmit}
              className={`cta-button${isSubmitting ? " is-loading" : ""}`}
            >
              {isSubmitting ? (
                <span className="loading-text">
                  <span className="loading-dot" />
                  {LOADING_MESSAGES[loadingIndex]}
                </span>
              ) : (
                t.cta[lang]
              )}
            </button>
          </form>
        </div>

        <p className="footer-note">{t.footerNote[lang]}</p>
        <p className="footer-note" style={{ marginTop: "0.5rem" }}>
          <a href="/about" style={{ color: "rgba(255,255,255,0.5)" }}>{t.about[lang]}</a>
          {" · "}
          <a href="/privacy" style={{ color: "rgba(255,255,255,0.5)" }}>{t.privacy[lang]}</a>
          {" · "}
          <a href="/terms" style={{ color: "rgba(255,255,255,0.5)" }}>{t.terms[lang]}</a>
        </p>
      </div>
    </main>
  );
}
