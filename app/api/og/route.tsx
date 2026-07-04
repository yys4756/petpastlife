/**
 * POST /api/og
 * ─────────────────────────────────────────────────────────
 * 1080×1080 Instagram-square 공유 이미지 생성
 *
 * Turbopack + next/og + Edge 조합에 버그가 있어서
 * → @vercel/og + Node.js 런타임 사용 (확정된 워크어라운드)
 *   https://github.com/vercel/next.js/issues/62783
 */

import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ───── Google Fonts에서 폰트 가져오기 ─────
//   Satori는 WOFF2 미지원 → 구식 Chrome 41 UA 로 요청해야 TTF 받음
async function loadGoogleFont(family: string): Promise<ArrayBuffer> {
  const familyParam = family.replace(/ /g, "+");
  const url = `https://fonts.googleapis.com/css2?family=${familyParam}&display=swap`;
  const css = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36",
    },
  }).then((r) => r.text());

  const ttfMatch = css.match(
    /url\((https?:\/\/[^)]+)\)\s*format\(['"]?(truetype|opentype|woff)['"]?\)/,
  );
  if (ttfMatch) {
    return fetch(ttfMatch[1]).then((r) => r.arrayBuffer());
  }

  const anyMatch = css.match(/url\((https?:\/\/[^)]+)\)/);
  if (!anyMatch) {
    throw new Error(
      `Font URL not found for ${family}. CSS sample: ${css.slice(0, 200)}`,
    );
  }
  return fetch(anyMatch[1]).then((r) => r.arrayBuffer());
}

interface PastLifeData {
  character_name: string;
  title: string;
  years: string;
  location: string;
  story: string;
  echoes: { photo_detail: string; past_parallel: string }[];
  share_line: string;
  hashtags: string[];
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      photoBase64?: string;
      photoMime?: string;
      petName?: string;
      data?: PastLifeData;
    };
    const { photoBase64, photoMime, petName, data } = body;

    if (!photoBase64 || !petName || !data) {
      return new Response("Missing fields", { status: 400 });
    }

    console.log(`[og] Generating for ${petName}, photo ~${Math.round(photoBase64.length / 1024)}KB`);

    const [italiana, outfit] = await Promise.all([
      loadGoogleFont("Italiana"),
      loadGoogleFont("Outfit"),
    ]);

    const photoSrc = `data:${photoMime || "image/jpeg"};base64,${photoBase64}`;
    // 카드에 표시할 Echoes — 최대 2개
    const visibleEchoes = data.echoes.slice(0, 2);

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#1A2420",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 44,
            fontFamily: "Outfit",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#FAFAF8",
              borderRadius: 44,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "56px 64px 48px",
              boxShadow: "0 32px 64px rgba(0,0,0,0.28)",
            }}
          >
            {/* Pet portrait — 크게 */}
            <div
              style={{
                width: 300,
                height: 300,
                borderRadius: 150,
                overflow: "hidden",
                display: "flex",
                flexShrink: 0,
                boxShadow:
                  "0 0 0 6px #FAFAF8, 0 0 0 10px #2E3D34, 0 12px 32px rgba(0,0,0,0.22)",
              }}
            >
              <img
                src={photoSrc}
                width={300}
                height={300}
                style={{ objectFit: "cover" }}
              />
            </div>

            {/* Eyebrow */}
            <div
              style={{
                marginTop: 28,
                fontSize: 17,
                letterSpacing: 5,
                color: "#6B7280",
                fontWeight: 700,
                display: "flex",
              }}
            >
              PAST LIFE OF {petName.toUpperCase()}
            </div>

            {/* Character name */}
            <div
              style={{
                marginTop: 14,
                fontFamily: "Italiana",
                fontSize: 68,
                color: "#111827",
                textAlign: "center",
                lineHeight: 1.05,
                maxWidth: 840,
                display: "flex",
              }}
            >
              {data.character_name}
            </div>

            {/* Title · Years · Location — 한 줄로 */}
            <div
              style={{
                marginTop: 12,
                fontSize: 22,
                color: "#6B7280",
                textAlign: "center",
                display: "flex",
                gap: 10,
              }}
            >
              <span style={{ display: "flex", fontStyle: "italic" }}>{data.title}</span>
              <span style={{ display: "flex", color: "#D1D5DB" }}>·</span>
              <span style={{ display: "flex", letterSpacing: 1, fontWeight: 600, color: "#9CA3AF" }}>
                {data.years}
              </span>
            </div>

            {/* Divider */}
            <div
              style={{
                width: 60,
                height: 2,
                backgroundColor: "#2E3D34",
                marginTop: 28,
                marginBottom: 24,
                display: "flex",
              }}
            />

            {/* Echoes section */}
            <div
              style={{
                fontSize: 14,
                letterSpacing: 4,
                color: "#9CA3AF",
                fontWeight: 700,
                marginBottom: 16,
                display: "flex",
              }}
            >
              ECHOES IN THIS LIFE
            </div>

            {visibleEchoes.map((echo, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  width: "100%",
                  marginBottom: i < visibleEchoes.length - 1 ? 12 : 0,
                  gap: 14,
                }}
              >
                {/* photo detail */}
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "#F3F4F6",
                    borderRadius: 10,
                    padding: "8px 14px",
                    fontSize: 21,
                    color: "#374151",
                    fontWeight: 600,
                    flex: "0 1 auto",
                    maxWidth: "44%",
                    lineHeight: 1.3,
                  }}
                >
                  {echo.photo_detail}
                </div>
                {/* arrow */}
                <div
                  style={{
                    display: "flex",
                    fontSize: 26,
                    color: "#2E3D34",
                    fontWeight: 700,
                    alignSelf: "center",
                    flexShrink: 0,
                  }}
                >
                  →
                </div>
                {/* past parallel */}
                <div
                  style={{
                    display: "flex",
                    fontSize: 21,
                    color: "#374151",
                    lineHeight: 1.35,
                    flex: 1,
                    alignSelf: "center",
                  }}
                >
                  {echo.past_parallel}
                </div>
              </div>
            ))}

            {/* Divider */}
            <div
              style={{
                width: 60,
                height: 2,
                backgroundColor: "#E5E7EB",
                marginTop: 24,
                marginBottom: 20,
                display: "flex",
              }}
            />

            {/* Share line */}
            <div
              style={{
                fontFamily: "Italiana",
                fontSize: 32,
                color: "#1F2937",
                textAlign: "center",
                lineHeight: 1.35,
                maxWidth: 780,
                display: "flex",
              }}
            >
              {`"${data.share_line}"`}
            </div>

            {/* CTA watermark — 굵고 크게 */}
            <div
              style={{
                marginTop: "auto",
                fontSize: 20,
                color: "#2E3D34",
                letterSpacing: 2,
                fontWeight: 700,
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <span style={{ display: "flex" }}>→</span>
              <span style={{ display: "flex" }}>pawlabo.com</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1080,
        height: 1080,
        fonts: [
          { name: "Italiana", data: italiana, style: "normal", weight: 400 },
          { name: "Outfit", data: outfit, style: "normal", weight: 400 },
        ],
      },
    );
  } catch (err) {
    console.error("[og] error:", err);
    const msg = err instanceof Error ? err.message : "Unknown";
    return new Response(`Image generation failed: ${msg}`, { status: 500 });
  }
}
