import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export const maxDuration = 30;

const MODEL_PRIMARY  = "llama-3.3-70b-versatile";
const MODEL_FALLBACK = "llama-3.1-8b-instant";

const ZODIAC = [
  { sign: "Capricorn",  start: [12, 22], end: [1, 19]  },
  { sign: "Aquarius",   start: [1, 20],  end: [2, 18]  },
  { sign: "Pisces",     start: [2, 19],  end: [3, 20]  },
  { sign: "Aries",      start: [3, 21],  end: [4, 19]  },
  { sign: "Taurus",     start: [4, 20],  end: [5, 20]  },
  { sign: "Gemini",     start: [5, 21],  end: [6, 20]  },
  { sign: "Cancer",     start: [6, 21],  end: [7, 22]  },
  { sign: "Leo",        start: [7, 23],  end: [8, 22]  },
  { sign: "Virgo",      start: [8, 23],  end: [9, 22]  },
  { sign: "Libra",      start: [9, 23],  end: [10, 22] },
  { sign: "Scorpio",    start: [10, 23], end: [11, 21] },
  { sign: "Sagittarius",start: [11, 22], end: [12, 21] },
];

function getZodiac(month: number, day: number): string {
  for (const z of ZODIAC) {
    const [sm, sd] = z.start;
    const [em, ed] = z.end;
    if (sm > em) {
      if ((month === sm && day >= sd) || (month === em && day <= ed)) return z.sign;
    } else {
      if ((month === sm && day >= sd) || (month === em && day <= ed) ||
          (month > sm && month < em)) return z.sign;
    }
  }
  return "Capricorn";
}

function buildPrompt(name: string, species: string, zodiac: string, today: string): string {
  return `You are a fun, whimsical pet astrologer. Generate a daily horoscope for a ${species} named ${name}, born under the sign of ${zodiac}. Today is ${today}.

The horoscope must be playful, pet-specific (use pet behaviors like napping, chasing, treats, cuddles), and entertaining. Never be negative — always end on a hopeful or funny note.

Respond ONLY with valid JSON matching this exact structure:
{
  "zodiac_sign": "${zodiac}",
  "element": "<Fire|Earth|Air|Water>",
  "today_summary": "<1 fun sentence summarizing the day>",
  "energy": "<1 sentence about their energy/activity level today>",
  "love": "<1 sentence about bond with humans or other pets>",
  "fortune": "<1 sentence about food, treats, or luck>",
  "lucky_item": "<a household object or treat>",
  "lucky_number": <a number 1-99>,
  "advice": "<1 short funny piece of advice for the pet>"
}`;
}

async function generate(groq: Groq, model: string, prompt: string) {
  return groq.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.9,
    max_tokens: 500,
    response_format: { type: "json_object" },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name    = (body.name as string | undefined)?.trim();
    const species = (body.species as string | undefined)?.trim();
    const month   = Number(body.month);
    const day     = Number(body.day);

    if (!name || !species || !month || !day || month < 1 || month > 12 || day < 1 || day > 31) {
      return NextResponse.json({ error: "name, species, month, and day are required." }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Server misconfigured." }, { status: 500 });

    const groq   = new Groq({ apiKey });
    const zodiac = getZodiac(month, day);
    const today  = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const prompt = buildPrompt(name, species, zodiac, today);

    let completion;
    try {
      completion = await generate(groq, MODEL_PRIMARY, prompt);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (!msg.includes("429") && !msg.includes("rate") && !msg.includes("quota")) throw err;
      completion = await generate(groq, MODEL_FALLBACK, prompt);
    }

    const raw = completion.choices[0]?.message?.content ?? "{}";
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "AI returned invalid response. Try again." }, { status: 502 });
    }

    return NextResponse.json({ result: data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Generation failed: ${msg}` }, { status: 500 });
  }
}
