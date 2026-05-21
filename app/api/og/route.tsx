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

  // truetype/opentype/woff 형식 우선
  const ttfMatch = css.match(
    /url\((https?:\/\/[^)]+)\)\s*format\(['"]?(truetype|opentype|woff)['"]?\)/,
  );
  if (ttfMatch) {
    return fetch(ttfMatch[1]).then((r) => r.arrayBuffer());
  }

  // 폴백 — 어떤 url() 이든
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

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#2E3D34",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 50,
            fontFamily: "Outfit",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "white",
              borderRadius: 48,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 70,
              boxShadow: "0 30px 60px rgba(0,0,0,0.2)",
            }}
          >
            {/* Pet portrait */}
            <div
              style={{
                width: 220,
                height: 220,
                borderRadius: 110,
                overflow: "hidden",
                display: "flex",
                flexShrink: 0,
                boxShadow:
                  "0 0 0 8px white, 0 0 0 9px rgba(31,41,55,0.08), 0 8px 24px rgba(0,0,0,0.12)",
              }}
            >
              <img
                src={photoSrc}
                width={220}
                height={220}
                style={{ objectFit: "cover" }}
              />
            </div>

            {/* Eyebrow */}
            <div
              style={{
                marginTop: 40,
                fontSize: 20,
                letterSpacing: 6,
                color: "#6B7280",
                fontWeight: 600,
                display: "flex",
              }}
            >
              PAST LIFE OF {petName.toUpperCase()}
            </div>

            {/* Character name */}
            <div
              style={{
                marginTop: 22,
                fontFamily: "Italiana",
                fontSize: 76,
                color: "#1F2937",
                textAlign: "center",
                lineHeight: 1.05,
                maxWidth: 820,
                display: "flex",
              }}
            >
              {data.character_name}
            </div>

            {/* Title */}
            <div
              style={{
                marginTop: 18,
                fontSize: 30,
                fontStyle: "italic",
                color: "#6B7280",
                textAlign: "center",
                maxWidth: 800,
                display: "flex",
              }}
            >
              {data.title}
            </div>

            {/* Years · Location */}
            <div
              style={{
                marginTop: 18,
                fontSize: 20,
                letterSpacing: 3,
                color: "#9CA3AF",
                fontWeight: 600,
                textAlign: "center",
                display: "flex",
              }}
            >
              {data.years} · {data.location.toUpperCase()}
            </div>

            {/* Divider */}
            <div
              style={{
                width: 80,
                height: 1,
                backgroundColor: "#E5E7EB",
                marginTop: 36,
                marginBottom: 36,
                display: "flex",
              }}
            />

            {/* Share line */}
            <div
              style={{
                fontFamily: "Italiana",
                fontSize: 36,
                color: "#1F2937",
                textAlign: "center",
                lineHeight: 1.35,
                maxWidth: 780,
                display: "flex",
              }}
            >
              {`"${data.share_line}"`}
            </div>

            {/* Hashtags */}
            <div
              style={{
                marginTop: 26,
                fontSize: 22,
                color: "#6B1F2C",
                fontWeight: 500,
                display: "flex",
                gap: 18,
              }}
            >
              {data.hashtags.map((tag, i) => (
                <span key={i} style={{ display: "flex" }}>
                  #{tag}
                </span>
              ))}
            </div>

            {/* Watermark */}
            <div
              style={{
                marginTop: "auto",
                fontSize: 22,
                color: "#9CA3AF",
                letterSpacing: 3,
                fontWeight: 500,
                display: "flex",
              }}
            >
              petpastlife.com
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
