"use client";

import { useState } from "react";
import { translations, type Lang } from "@/lib/translations";

const t = translations.horoscope;

const SPECIES_EN = ["Cat", "Dog", "Rabbit", "Bird", "Hamster", "Guinea Pig", "Other"];
const SPECIES_KO = ["고양이", "강아지", "토끼", "새", "햄스터", "기니피그", "기타"];

const ELEMENT_EMOJI: Record<string, string> = {
  Fire: "🔥", Earth: "🌿", Air: "💨", Water: "💧",
};

type HoroscopeData = {
  zodiac_sign: string;
  element: string;
  today_summary: string;
  energy: string;
  love: string;
  fortune: string;
  lucky_item: string;
  lucky_number: number;
  advice: string;
};

export function HoroscopePageClient({ lang }: { lang: Lang }) {
  const SPECIES = lang === "ko" ? SPECIES_KO : SPECIES_EN;

  const [name, setName]       = useState("");
  const [species, setSpecies] = useState(SPECIES[0]);
  const [month, setMonth]     = useState("");
  const [day, setDay]         = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<HoroscopeData | null>(null);
  const [error, setError]     = useState<string | null>(null);

  const canSubmit = Boolean(name.trim() && month && day && !loading);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res  = await fetch("/api/horoscope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), species, month: Number(month), day: Number(day) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong");
      setResult(json.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  const MONTHS_EN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const MONTHS_KO = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
  const MONTHS = lang === "ko" ? MONTHS_KO : MONTHS_EN;

  if (result) {
    return (
      <main className="page-wrap" style={{ alignItems: "flex-start", paddingTop: "3rem" }}>
        <div style={{ width: "100%", maxWidth: "28rem", margin: "0 auto" }}>
          <div className="card fade-in">
            <div className="card-header">
              <div style={{ fontSize: "2.5rem", lineHeight: 1, marginBottom: "0.75rem" }}>
                {ELEMENT_EMOJI[result.element] ?? "⭐"}
              </div>
              <div className="result-eyebrow">
                {result.zodiac_sign} · {result.element}
              </div>
              <h1 className="result-name">{name}{t.horoscopeOf[lang]}</h1>
              <p className="result-title-line">
                {new Date().toLocaleDateString(lang === "ko" ? "ko-KR" : "en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
            </div>

            <div className="result-divider" />

            <div className="result-section">
              <div className="result-section-label">{t.today[lang]}</div>
              <p className="result-section-body">{result.today_summary}</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
              <MiniSection label={t.energy[lang]} value={result.energy} />
              <MiniSection label={t.love[lang]} value={result.love} />
              <MiniSection label={t.fortune[lang]} value={result.fortune} />
              <MiniSection label={t.luckyItem[lang]} value={result.lucky_item} />
            </div>

            <div className="result-divider" />

            <div className="result-section" style={{ marginBottom: "0.5rem" }}>
              <div className="result-section-label">{t.advice[lang]}</div>
              <p className="result-section-body" style={{ fontStyle: "italic" }}>
                &ldquo;{result.advice}&rdquo;
              </p>
            </div>

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <span style={{ fontSize: "0.7rem", letterSpacing: "0.15em", color: "#9CA3AF", textTransform: "uppercase" }}>
                {t.luckyNumber[lang]}
              </span>
              <div style={{ fontFamily: "var(--font-italiana)", fontSize: "3rem", color: "#1F2937", lineHeight: 1.1 }}>
                {result.lucky_number}
              </div>
            </div>

            <div className="result-divider" />

            <button className="try-again-button" onClick={handleReset}>
              {t.checkAgain[lang]}
            </button>
          </div>

          <p className="footer-note" style={{ marginTop: "1.5rem" }}>
            <a href="/" style={{ color: "rgba(255,255,255,0.6)" }}>{t.backPastLife[lang]}</a>
            {" · "}
            <a href="/blog" style={{ color: "rgba(255,255,255,0.6)" }}>{translations.nav.blog[lang]}</a>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-wrap">
      <div className="page-inner fade-in">
        <div className="card">
          <header className="card-header">
            <div style={{ fontSize: "2.5rem", lineHeight: 1, marginBottom: "1rem" }}>⭐</div>
            <h1 className="title" style={{ fontSize: "2rem" }}>{t.title[lang]}</h1>
            <p className="subtitle">{t.subtitle[lang]}</p>
          </header>

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
                disabled={loading}
                className="text-input"
              />
            </div>

            <div className="field">
              <label htmlFor="species" className="field-label">{t.species[lang]}</label>
              <select
                id="species"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                disabled={loading}
                className="text-input"
                style={{ cursor: "pointer" }}
              >
                {SPECIES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="field">
              <label className="field-label">{t.birthday[lang]}</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  disabled={loading}
                  className="text-input"
                  style={{ cursor: "pointer" }}
                >
                  <option value="">{t.monthPlaceholder[lang]}</option>
                  {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                </select>
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  disabled={loading}
                  className="text-input"
                  style={{ cursor: "pointer" }}
                >
                  <option value="">{t.dayPlaceholder[lang]}</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1)
                    .map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {error && <div className="error-banner">{error}</div>}

            <button
              type="submit"
              disabled={!canSubmit}
              className={`cta-button${loading ? " is-loading" : ""}`}
            >
              {loading ? (
                <span className="loading-text">
                  <span className="loading-dot" />
                  {t.loading[lang]}
                </span>
              ) : t.cta[lang]}
            </button>
          </form>
        </div>

        <p className="footer-note">
          <a href="/" style={{ color: "rgba(255,255,255,0.5)" }}>{t.backPastLife[lang]}</a>
          {" · "}
          <a href="/blog" style={{ color: "rgba(255,255,255,0.5)" }}>{translations.nav.blog[lang]}</a>
          {" · "}
          <a href="/privacy" style={{ color: "rgba(255,255,255,0.5)" }}>{translations.home.privacy[lang]}</a>
        </p>
      </div>
    </main>
  );
}

function MiniSection({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      background: "#F9FAFB",
      borderRadius: "0.75rem",
      padding: "0.75rem",
    }}>
      <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", fontWeight: 600, textTransform: "uppercase", color: "#6B1F2C", marginBottom: "0.3rem" }}>
        {label}
      </div>
      <div style={{ fontSize: "0.8rem", color: "#374151", lineHeight: 1.5 }}>
        {value}
      </div>
    </div>
  );
}
