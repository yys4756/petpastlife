/**
 * POST /api/past-life
 * ─────────────────────────────────────────────────────────
 * 펫 사진 + 이름 + 성별 → Gemma 4 31B → 구조화 JSON (8 필드)
 */

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

const MODEL_PRIMARY  = "gemma-4-31b-it";
const MODEL_FALLBACK = "gemma-4-26b-a4b-it";
const MAX_BYTES = 10 * 1024 * 1024;

export const maxDuration = 60;

// ────────────────────────────────────────────────────────
// 8 필드 스키마 (10 → 8: signature_trait, ending 제거)
// ────────────────────────────────────────────────────────
const PAST_LIFE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    character_name: {
      type: Type.STRING,
      description:
        "Name with honorific only (e.g., 'Captain Alistair Thorne'). NO role/profession here.",
    },
    title: {
      type: Type.STRING,
      description:
        "Role/profession only (e.g., 'Royal Navy Commodore'). One short phrase.",
    },
    years: { type: Type.STRING, description: "Birth–Death year (e.g., '1792–1838')" },
    location: { type: Type.STRING, description: "Specific city/region" },
    story: {
      type: Type.STRING,
      description:
        "EXACTLY 3 short sentences: (a) what they did, (b) one defining moment, (c) how their life ended — peacefully or dramatically, never sad.",
    },
    echoes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          photo_detail: { type: Type.STRING },
          past_parallel: { type: Type.STRING },
        },
        required: ["photo_detail", "past_parallel"],
      },
      minItems: 2,
      maxItems: 2,
    },
    share_line: {
      type: Type.STRING,
      description: "One shareable line, max 15 words.",
    },
    hashtags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      minItems: 3,
      maxItems: 3,
    },
  },
  required: [
    "character_name",
    "title",
    "years",
    "location",
    "story",
    "echoes",
    "share_line",
    "hashtags",
  ],
};

const GENDER_MAP: Record<string, string> = {
  boy: "Male",
  girl: "Female",
  unknown: "Determine from the photo",
};

const PERSONALITY_MAP: Record<string, string> = {
  energetic: "Energetic and playful",
  calm:      "Calm and gentle",
  timid:     "Timid and cautious",
  bold:      "Bold and fearless",
};

function buildPrompt(name: string, gender: string, personality: string | null): string {
  const genderText = GENDER_MAP[gender] ?? "Determine from the photo";
  const personalityLine = personality
    ? `  Personality: ${PERSONALITY_MAP[personality] ?? personality}`
    : "";

  return `You are an AI past-life regression specialist for pets. Read the attached photo carefully — breed, posture, expression, gaze, lighting, surroundings. Use what you see to anchor the past life.

Generate a past life for the pet below.

PET DETAILS
  Name: ${name}
  Gender: ${genderText}${personalityLine ? "\n" + personalityLine : ""}

CONTENT RULES
1. BE SPECIFIC. Invent a named character with exact years, a specific city/region, a concrete profession, and one defining historical event. "Constance Beaufort" / "Perfumer of Marseille" beats "a wealthy lady".
2. Match the character's gender as stated above. If "Determine from the photo," use visual cues to decide.
3. character_name = name + honorific ONLY (e.g., "Captain Alistair Thorne"). title = role/profession ONLY (e.g., "Royal Navy Commodore"). DO NOT repeat the role in both fields.
4. The story is EXACTLY 3 sentences: (a) what they did, (b) one defining moment, (c) how their life ended — peacefully or dramatically, never sad or gruesome.
5. The 'echoes' must tie two specific visible photo details to past-life parallels.
6. Hashtags: exactly 3, no '#' prefix.
7. Pick whatever era fits the photo best.
8. PROOFREAD every field: no duplicated words, no typos, no awkward phrases. Each field must be a complete, grammatical sentence.`;
}

// ────────────────────────────────────────────────────────
// Google API 일시 장애 (500/503/INTERNAL/UNAVAILABLE) 시 자동 재시도
// 1초 → 2초 backoff, 최대 2번 재시도
// ────────────────────────────────────────────────────────
async function generateWithRetry(
  ai: GoogleGenAI,
  requestConfig: Parameters<typeof ai.models.generateContent>[0],
  maxRetries = 2,
) {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await ai.models.generateContent(requestConfig);
    } catch (err) {
      lastError = err;
      const errMsg = err instanceof Error ? err.message : String(err);
      const isRetryable =
        errMsg.includes("500") ||
        errMsg.includes("INTERNAL") ||
        errMsg.includes("UNAVAILABLE") ||
        errMsg.includes("503") ||
        errMsg.includes("DEADLINE_EXCEEDED");

      if (!isRetryable || attempt === maxRetries) throw err;

      const delay = Math.pow(2, attempt) * 1000; // 1s, 2s
      console.log(
        `[past-life] retry ${attempt + 1}/${maxRetries} after ${delay}ms: ${errMsg.slice(0, 100)}`,
      );
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastError;
}

export async function POST(req: NextRequest) {
  const t0 = Date.now();

  try {
    const formData = await req.formData();
    const photo = formData.get("photo") as File | null;
    const name = (formData.get("name") as string | null)?.trim();
    const gender = formData.get("gender") as string | null;
    const personality = (formData.get("personality") as string | null) || null;

    if (!photo || !name || !gender) {
      return NextResponse.json(
        { error: "Photo, name, and gender are all required." },
        { status: 400 },
      );
    }
    if (!photo.type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid file type." }, { status: 400 });
    }
    if (photo.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Image too large (max 10MB)." },
        { status: 400 },
      );
    }
    if (!(gender in GENDER_MAP)) {
      return NextResponse.json({ error: "Invalid gender." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("[past-life] GEMINI_API_KEY not set");
      return NextResponse.json(
        { error: "Server misconfigured." },
        { status: 500 },
      );
    }

    const bytes = await photo.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildPrompt(name, gender, personality);

    const requestConfig = (model: string) => ({
      model,
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { data: base64, mimeType: photo.type } },
            { text: prompt },
          ],
        },
      ],
      config: {
        temperature: 0.95,
        maxOutputTokens: 1000,
        responseMimeType: "application/json",
        responseSchema: PAST_LIFE_SCHEMA,
      },
    });

    let response;
    try {
      response = await generateWithRetry(ai, requestConfig(MODEL_PRIMARY));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const isRateLimited =
        msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED");
      if (!isRateLimited) throw err;
      console.log("[past-life] 31b rate limited → fallback to 26b");
      response = await generateWithRetry(ai, requestConfig(MODEL_FALLBACK));
    }

    const rawText = response.text ?? "{}";

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      console.error("[past-life] JSON parse failed:", rawText.slice(0, 500));
      return NextResponse.json(
        { error: "AI returned invalid response. Try again." },
        { status: 502 },
      );
    }

    console.log(
      `[past-life] OK  ${Date.now() - t0}ms  ${data.character_name ?? "?"}`,
    );

    return NextResponse.json({ result: data });
  } catch (err) {
    console.error(`[past-life] FAIL ${Date.now() - t0}ms`, err);
    const msg = err instanceof Error ? err.message : "Unknown error";

    // Google API 일시 장애 → 사용자에게 친화적인 메시지로 변환
    if (
      msg.includes("500") ||
      msg.includes("INTERNAL") ||
      msg.includes("503") ||
      msg.includes("UNAVAILABLE")
    ) {
      return NextResponse.json(
        {
          error:
            "The AI service is busy right now. Please try again in a moment.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: `Generation failed: ${msg}` },
      { status: 500 },
    );
  }
}
