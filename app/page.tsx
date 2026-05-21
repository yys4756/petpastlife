"use client";

import { useState, useEffect } from "react";
import { PhotoUpload } from "@/components/PhotoUpload";
import { GenderSelect, type Gender } from "@/components/GenderSelect";
import { PersonalitySelect, type Personality } from "@/components/PersonalitySelect";
import { ResultCard, type PastLifeData } from "@/components/ResultCard";

const LOADING_MESSAGES = [
  "Looking into their eyes…",
  "Searching across centuries…",
  "Finding their past life…",
  "Almost there…",
];

export default function HomePage() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [personality, setPersonality] = useState<Personality | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [result, setResult] = useState<PastLifeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = Boolean(photo && name.trim() && gender && !isSubmitting);

  // 사진 → 미리보기 URL 자동 동기화
  const handlePhotoChange = (file: File | null) => {
    setPhotoUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
    setPhoto(file);
  };

  // 언마운트 시 blob URL 정리
  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 로딩 메시지 회전
  useEffect(() => {
    if (!isSubmitting) {
      setLoadingIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingIndex((i) => Math.min(i + 1, LOADING_MESSAGES.length - 1));
    }, 12000);
    return () => clearInterval(interval);
  }, [isSubmitting]);

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

  // ──── Result view (photo + 8 fields) ────
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

  // ──── Form view ────
  return (
    <main className="page-wrap">
      <div className="page-inner fade-in">
        <div className="card">
          <header className="card-header">
            <div style={{ fontSize: "2.5rem", lineHeight: 1, marginBottom: "0.5rem" }}>🐾</div>
            <h1 className="title">Your Pet's Past Life</h1>
            <p className="subtitle">
              Upload a photo to discover who your pet was before.
            </p>
          </header>

          <form className="form" onSubmit={handleSubmit}>
            <PhotoUpload onPhotoSelected={handlePhotoChange} />

            <div className="field">
              <label htmlFor="name" className="field-label">
                Pet name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Mochi"
                maxLength={40}
                disabled={isSubmitting}
                className="text-input"
              />
            </div>

            <GenderSelect value={gender} onChange={setGender} />

            <PersonalitySelect value={personality} onChange={setPersonality} />

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
                "Reveal Past Life"
              )}
            </button>
          </form>
        </div>

        <p className="footer-note">
          One reading per day · For entertainment only
        </p>
        <p className="footer-note" style={{ marginTop: "0.5rem" }}>
          <a href="/blog" style={{ color: "rgba(255,255,255,0.5)" }}>Blog</a>
          {" · "}
          <a href="/about" style={{ color: "rgba(255,255,255,0.5)" }}>About</a>
          {" · "}
          <a href="/privacy" style={{ color: "rgba(255,255,255,0.5)" }}>Privacy</a>
          {" · "}
          <a href="/terms" style={{ color: "rgba(255,255,255,0.5)" }}>Terms</a>
        </p>
      </div>
    </main>
  );
}
