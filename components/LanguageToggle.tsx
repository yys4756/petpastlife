"use client";

import type { Lang } from "@/lib/translations";

export function LanguageToggle({ lang }: { lang: Lang }) {
  function setLang(next: Lang) {
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;SameSite=Lax`;
    window.location.reload();
  }

  const btnStyle = (active: boolean): React.CSSProperties => ({
    fontSize: "0.72rem",
    fontWeight: active ? 700 : 400,
    color: active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.65)",
    background: "none",
    border: "none",
    cursor: active ? "default" : "pointer",
    padding: "0.25rem 0.35rem",
    letterSpacing: "0.08em",
    fontFamily: "inherit",
  });

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.1rem" }}>
      <button onClick={() => setLang("en")} style={btnStyle(lang === "en")} disabled={lang === "en"}>
        EN
      </button>
      <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.65rem" }}>|</span>
      <button onClick={() => setLang("ko")} style={btnStyle(lang === "ko")} disabled={lang === "ko"}>
        KO
      </button>
    </div>
  );
}
