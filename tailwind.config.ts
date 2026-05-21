import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: "#2E3D34",   // 메인 배경
        ink: "#1F2937",      // 카드 안 본문 / 세그먼티드 활성 / CTA
        wine: "#6B1F2C",     // 액센트 (포커스, 호버 등)
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 20px 50px -12px rgba(0, 0, 0, 0.25), 0 8px 20px -8px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
