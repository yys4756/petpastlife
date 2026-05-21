"use client";

export type Personality = "energetic" | "calm" | "timid" | "bold";

interface PersonalitySelectProps {
  value: Personality | null;
  onChange: (personality: Personality | null) => void;
}

const OPTIONS: { value: Personality; label: string }[] = [
  { value: "energetic", label: "Energetic" },
  { value: "calm",      label: "Calm" },
  { value: "timid",     label: "Timid" },
  { value: "bold",      label: "Bold" },
];

export function PersonalitySelect({ value, onChange }: PersonalitySelectProps) {
  const activeIndex = value === null ? -1 : OPTIONS.findIndex((o) => o.value === value);
  const hasSelection = activeIndex >= 0;

  return (
    <div className="field">
      <label className="field-label">
        Personality
        <span style={{ marginLeft: "0.4rem", fontSize: "0.75rem", color: "#9CA3AF", fontWeight: 400 }}>
          (optional)
        </span>
      </label>

      <div className="switch-container">
        <div
          className="switch-indicator"
          style={{
            width: "25%",
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
              onClick={() => onChange(selected ? null : opt.value)}
              className={`switch-btn ${selected ? "switch-btn-active" : "switch-btn-inactive"}`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
