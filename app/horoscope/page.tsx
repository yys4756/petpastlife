"use client";

import { useState } from "react";

const SPECIES = ["Cat", "Dog", "Rabbit", "Bird", "Hamster", "Guinea Pig", "Other"];

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

export default function HoroscopePage() {
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

  if (result) {
    return (
      <main className="page-wrap" style={{ alignItems: "flex-start", paddingTop: "3rem" }}>
        <div style={{ width: "100%", maxWidth: "28rem", margin: "0 auto" }}>
          <div className="card fade-in">
            {/* Header */}
            <div className="card-header">
              <div style={{ fontSize: "2.5rem", lineHeight: 1, marginBottom: "0.75rem" }}>
                {ELEMENT_EMOJI[result.element] ?? "⭐"}
              </div>
              <div className="result-eyebrow">
                {result.zodiac_sign} · {result.element}
              </div>
              <h1 className="result-name">{name}'s Horoscope</h1>
              <p className="result-title-line">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
            </div>

            <div className="result-divider" />

            {/* Summary */}
            <div className="result-section">
              <div className="result-section-label">Today</div>
              <p className="result-section-body">{result.today_summary}</p>
            </div>

            {/* Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
              <MiniSection label="Energy" value={result.energy} />
              <MiniSection label="Love" value={result.love} />
              <MiniSection label="Fortune" value={result.fortune} />
              <MiniSection label="Lucky Item" value={result.lucky_item} />
            </div>

            <div className="result-divider" />

            {/* Advice */}
            <div className="result-section" style={{ marginBottom: "0.5rem" }}>
              <div className="result-section-label">Advice</div>
              <p className="result-section-body" style={{ fontStyle: "italic" }}>
                "{result.advice}"
              </p>
            </div>

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <span style={{ fontSize: "0.7rem", letterSpacing: "0.15em", color: "#9CA3AF", textTransform: "uppercase" }}>
                Lucky Number
              </span>
              <div style={{ fontFamily: "var(--font-italiana)", fontSize: "3rem", color: "#1F2937", lineHeight: 1.1 }}>
                {result.lucky_number}
              </div>
            </div>

            <div className="result-divider" />

            <button className="try-again-button" onClick={handleReset}>
              Check again tomorrow
            </button>
          </div>

          <p className="footer-note" style={{ marginTop: "1.5rem" }}>
            <a href="/" style={{ color: "rgba(255,255,255,0.6)" }}>← Past Life</a>
            {" · "}
            <a href="/blog" style={{ color: "rgba(255,255,255,0.6)" }}>Blog</a>
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
            <h1 className="title" style={{ fontSize: "2rem" }}>Pet Horoscope</h1>
            <p className="subtitle">Daily cosmic forecast for your pet.</p>
          </header>

          <form className="form" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="field">
              <label htmlFor="name" className="field-label">Pet name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Luna"
                maxLength={40}
                disabled={loading}
                className="text-input"
              />
            </div>

            {/* Species */}
            <div className="field">
              <label htmlFor="species" className="field-label">Species</label>
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

            {/* Birthday */}
            <div className="field">
              <label className="field-label">Birthday</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  disabled={loading}
                  className="text-input"
                  style={{ cursor: "pointer" }}
                >
                  <option value="">Month</option>
                  {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
                    .map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                </select>
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  disabled={loading}
                  className="text-input"
                  style={{ cursor: "pointer" }}
                >
                  <option value="">Day</option>
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
                  Reading the stars…
                </span>
              ) : "Read My Pet's Stars"}
            </button>
          </form>
        </div>

        <p className="footer-note">
          <a href="/" style={{ color: "rgba(255,255,255,0.5)" }}>← Past Life</a>
          {" · "}
          <a href="/blog" style={{ color: "rgba(255,255,255,0.5)" }}>Blog</a>
          {" · "}
          <a href="/privacy" style={{ color: "rgba(255,255,255,0.5)" }}>Privacy</a>
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
