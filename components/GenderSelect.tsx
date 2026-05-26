"use client";

import { translations, type Lang } from "@/lib/translations";

export type Gender = "boy" | "girl" | "unknown";

interface GenderSelectProps {
  value: Gender | null;
  onChange: (gender: Gender) => void;
  lang: Lang;
}

export function GenderSelect({ value, onChange, lang }: GenderSelectProps) {
  const t = translations.home;
  const OPTIONS: { value: Gender; label: string }[] = [
    { value: "boy", label: t.genderBoy[lang] },
    { value: "girl", label: t.genderGirl[lang] },
    { value: "unknown", label: t.genderUnknown[lang] },
  ];

  const activeIndex = value === null ? -1 : OPTIONS.findIndex((o) => o.value === value);
  const hasSelection = activeIndex >= 0;

  return (
    <div className="field">
      <label className="field-label">{t.gender[lang]}</label>

      <div className="switch-container">
        <div
          className="switch-indicator"
          style={{
            transform: `translateX(${Math.max(0, activeIndex) * 100}%)`,
            opacity: hasSelection ? 1 : 0,
          }}
        />

        {OPTIONS.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`switch-btn ${
                selected ? "switch-btn-active" : "switch-btn-inactive"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
