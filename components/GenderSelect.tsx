"use client";

export type Gender = "boy" | "girl" | "unknown";

interface GenderSelectProps {
  value: Gender | null;
  onChange: (gender: Gender) => void;
}

const OPTIONS: { value: Gender; label: string }[] = [
  { value: "boy", label: "Boy" },
  { value: "girl", label: "Girl" },
  { value: "unknown", label: "Not sure" },
];

export function GenderSelect({ value, onChange }: GenderSelectProps) {
  const activeIndex =
    value === null ? -1 : OPTIONS.findIndex((o) => o.value === value);
  const hasSelection = activeIndex >= 0;

  return (
    <div className="field">
      <label className="field-label">Gender</label>

      <div className="switch-container">
        {/* 슬라이딩 인디케이터 */}
        <div
          className="switch-indicator"
          style={{
            transform: `translateX(${Math.max(0, activeIndex) * 100}%)`,
            opacity: hasSelection ? 1 : 0,
          }}
        />

        {/* 버튼 3개 */}
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
