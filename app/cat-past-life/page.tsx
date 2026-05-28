import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import type { Lang } from "@/lib/translations";

const BASE = "https://petpastlife.vercel.app";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const lang: Lang = (cookieStore.get("NEXT_LOCALE")?.value as Lang) ?? "en";
  const isKo = lang === "ko";

  const title = isKo
    ? "고양이 전생 알아보기 — AI로 밝히는 내 고양이의 전생"
    : "Cat Past Life — Discover Who Your Cat Was Before";
  const description = isKo
    ? "우리 고양이의 전생이 궁금하세요? 사진을 업로드하면 AI가 역사 속 전생 이야기를 30초 만에 알려드려요. 무료."
    : "Find out who your cat was in a past life. Upload a photo and our AI reveals their historical past life — free, instant, and surprisingly specific.";
  const url = `${BASE}/cat-past-life`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { en: url, ko: url },
    },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

const faqEn = [
  {
    q: "What does my cat's past life reading include?",
    a: "You get a full story: a historical name, era, location, profession or role, a life narrative, and specific connections between your cat's current appearance and behavior and their past identity.",
  },
  {
    q: "How does the AI determine my cat's past life?",
    a: "The AI analyzes your cat's photo — breed, coat color and pattern, eye color, posture, and expression — and crafts a unique past-life story. Every reading is one of a kind.",
  },
  {
    q: "Why do cats seem so ancient and mysterious?",
    a: "Cats were worshipped as divine in ancient Egypt for over 3,000 years. Their independence, stillness, and habit of staring into empty space have puzzled humans for millennia — which is exactly what you'd expect from an old soul.",
  },
  {
    q: "Can I use this for any cat breed?",
    a: "Yes — any breed, any age, any coat color. Mixed-breed cats are welcome too.",
  },
  {
    q: "Is this service free?",
    a: "Completely free. No account required, no hidden charges.",
  },
];

const faqKo = [
  {
    q: "고양이 전생 결과에는 무엇이 포함되나요?",
    a: "역사적 이름, 시대, 장소, 직업이나 역할, 생애 이야기, 그리고 현재 고양이의 외모·행동과 전생의 연결점을 담은 완전한 이야기를 받게 됩니다.",
  },
  {
    q: "AI가 고양이의 전생을 어떻게 알 수 있나요?",
    a: "AI가 고양이 사진을 분석합니다 — 품종, 털 색상과 패턴, 눈 색깔, 자세, 표정. 이를 바탕으로 세상에 단 하나뿐인 전생 이야기를 만들어냅니다.",
  },
  {
    q: "고양이는 왜 그렇게 신비롭고 오래된 느낌이 나나요?",
    a: "고양이는 고대 이집트에서 3,000년 넘게 신성한 동물로 숭배받았습니다. 독립적인 성격, 고요한 태도, 허공을 바라보는 습관은 수천 년 동안 인류를 매혹시켜 왔습니다 — 오래된 영혼에게 딱 어울리는 특징이죠.",
  },
  {
    q: "어떤 고양이도 이용할 수 있나요?",
    a: "네 — 품종, 나이, 털 색 무관. 믹스묘도 환영합니다.",
  },
  {
    q: "무료인가요?",
    a: "완전 무료입니다. 회원가입 불필요, 숨겨진 비용 없음.",
  },
];

export default async function CatPastLifePage() {
  const cookieStore = await cookies();
  const lang: Lang = (cookieStore.get("NEXT_LOCALE")?.value as Lang) ?? "en";
  const isKo = lang === "ko";

  const faq = isKo ? faqKo : faqEn;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqEn.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <main className="page-wrap" style={{ alignItems: "flex-start", paddingTop: "4rem" }}>
      <div style={{ width: "100%", maxWidth: "42rem", margin: "0 auto" }}>

        {/* Hero */}
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <div className="card-header">
            <div style={{ fontSize: "3rem", lineHeight: 1, marginBottom: "1rem" }}>🐱</div>
            <h1 className="title">
              {isKo ? "고양이 전생 알아보기" : "Your Cat's Past Life"}
            </h1>
            <p className="subtitle">
              {isKo
                ? "우리 고양이가 전생에 누구였을까요? AI가 사진 한 장으로 역사 속 정체를 밝혀드립니다."
                : "Upload your cat's photo and discover who they were before — a name, an era, a life story written just for them."}
            </p>
          </div>
          <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
            <Link
              href="/"
              style={{
                display: "inline-block",
                padding: "0.75rem 2rem",
                background: "#6B1F2C",
                color: "#fff",
                borderRadius: "2rem",
                fontSize: "1rem",
                fontWeight: 600,
                textDecoration: "none",
                letterSpacing: "0.02em",
              }}
            >
              {isKo ? "전생 밝혀보기 →" : "Reveal Past Life →"}
            </Link>
            <p style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: "0.6rem" }}>
              {isKo ? "무료 · 30초 · 계정 불필요" : "Free · 30 seconds · No account needed"}
            </p>
          </div>
        </div>

        {/* Why cats feel ancient */}
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h2 style={sectionHeadStyle}>
            {isKo ? "고양이는 왜 오래된 영혼처럼 느껴질까" : "Why Cats Feel Like Old Souls"}
          </h2>
          <p style={bodyStyle}>
            {isKo
              ? "고양이는 고대 이집트에서 3,000년 넘게 바스테트 여신의 현신으로 숭배받았습니다. 로마, 중세 유럽, 동아시아 전통에서도 고양이는 영적인 경계에 서 있는 존재로 여겨졌습니다. 고양이가 허공을 오래 바라보거나, 새벽에 갑자기 뛰어다니거나, 당신의 기분을 아무런 단서 없이 알아채는 것 — 이 행동들은 모두 설명하기 어렵습니다."
              : "Cats were worshipped as sacred in ancient Egypt for over 3,000 years — living embodiments of the goddess Bastet. In Rome, medieval Europe, and across East Asian traditions, cats were creatures that stood at the edge of the spirit world. The staring into empty space, the 3 AM zoomies, the uncanny ability to sense your mood before you've expressed it — none of these behaviors have satisfying scientific explanations."}
          </p>
          <p style={bodyStyle}>
            {isKo
              ? "그 신비로움이 어디서 오는지 우리는 만들어봤습니다. 그리고 AI는 꽤 설득력 있는 답을 내놓습니다."
              : "We built something that tries to answer where that mystery comes from. The AI turns out to be surprisingly convincing at it."}
          </p>
        </div>

        {/* What you get */}
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h2 style={sectionHeadStyle}>
            {isKo ? "결과에서 받는 것" : "What You'll Receive"}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {(isKo ? revealItemsKo : revealItemsEn).map((item) => (
              <div key={item.label} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <span style={{ fontSize: "1.1rem", flexShrink: 0, marginTop: "0.1rem" }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#1F2937" }}>{item.label}</div>
                  <div style={{ fontSize: "0.875rem", color: "#6B7280", lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Example past lives */}
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h2 style={sectionHeadStyle}>
            {isKo ? "고양이 전생 예시" : "Examples of Cat Past Lives"}
          </h2>
          <p style={{ ...bodyStyle, marginBottom: "1rem" }}>
            {isKo
              ? "실제 결과들을 보면 고양이마다 전혀 다른 이야기가 나옵니다:"
              : "Real readings look different for every cat — but here's the flavor:"}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {(isKo ? examplesKo : examplesEn).map((ex, i) => (
              <div
                key={i}
                style={{
                  padding: "0.875rem 1rem",
                  background: "#F9FAFB",
                  borderRadius: "0.5rem",
                  borderLeft: "3px solid #6B1F2C",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#1F2937", marginBottom: "0.25rem" }}>
                  {ex.title}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#6B7280", lineHeight: 1.5 }}>{ex.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h2 style={sectionHeadStyle}>
            {isKo ? "자주 묻는 질문" : "Frequently Asked Questions"}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {faq.map((item, i) => (
              <div key={i}>
                <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#1F2937", marginBottom: "0.3rem" }}>
                  {item.q}
                </div>
                <div style={{ fontSize: "0.875rem", color: "#6B7280", lineHeight: 1.6 }}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Related posts */}
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h2 style={sectionHeadStyle}>
            {isKo ? "관련 글" : "Related Reading"}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {relatedPosts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                style={{ fontSize: "0.875rem", color: "#6B1F2C", textDecoration: "none" }}
              >
                → {isKo ? p.titleKo : p.titleEn}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          style={{
            padding: "2rem",
            background: "linear-gradient(135deg, #fdf2f4 0%, #f9e8eb 100%)",
            borderRadius: "0.75rem",
            border: "1px solid #f0d0d5",
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-italiana), Georgia, serif",
              fontSize: "1.4rem",
              color: "#6B1F2C",
              margin: "0 0 0.5rem",
              fontWeight: 400,
            }}
          >
            {isKo ? "내 고양이의 전생이 궁금하세요?" : "Ready to meet who your cat was before?"}
          </p>
          <p style={{ fontSize: "0.875rem", color: "#6B7280", margin: "0 0 1.25rem", lineHeight: 1.5 }}>
            {isKo
              ? "사진을 업로드하면 AI가 30초 만에 전생을 알려드려요. 완전 무료."
              : "Upload a photo. Get a full past-life story in 30 seconds. Completely free."}
          </p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "0.7rem 1.75rem",
              background: "#6B1F2C",
              color: "#fff",
              borderRadius: "2rem",
              fontSize: "0.9rem",
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: "0.02em",
            }}
          >
            {isKo ? "전생 알아보기 →" : "Reveal Past Life →"}
          </Link>
        </div>

        <p className="footer-note" style={{ marginTop: "0.5rem" }}>
          <Link href="/blog" style={{ color: "rgba(255,255,255,0.6)" }}>
            {isKo ? "블로그" : "Blog"}
          </Link>
          {" · "}
          <Link href="/dog-past-life" style={{ color: "rgba(255,255,255,0.6)" }}>
            {isKo ? "강아지 전생" : "Dog Past Life"}
          </Link>
          {" · "}
          <Link href="/" style={{ color: "rgba(255,255,255,0.6)" }}>
            {isKo ? "홈" : "Home"}
          </Link>
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </main>
  );
}

const sectionHeadStyle: React.CSSProperties = {
  fontSize: "0.65rem",
  letterSpacing: "0.2em",
  fontWeight: 600,
  textTransform: "uppercase",
  color: "#6B1F2C",
  marginBottom: "0.75rem",
  marginTop: 0,
};

const bodyStyle: React.CSSProperties = {
  fontSize: "0.95rem",
  lineHeight: 1.7,
  color: "#374151",
  margin: "0 0 0.5rem",
};

const revealItemsEn = [
  { icon: "📛", label: "A historical name", desc: "Who they were called in their past life." },
  { icon: "🗓️", label: "Era & location", desc: "The century and place where they lived." },
  { icon: "⚔️", label: "Role or profession", desc: "What they did — warrior, healer, scholar, noble, artisan." },
  { icon: "📖", label: "Life story", desc: "A full narrative of that lifetime, written uniquely for your cat." },
  { icon: "🔗", label: "Present-day echoes", desc: "How their coat, eyes, or behaviors connect to who they were." },
];

const revealItemsKo = [
  { icon: "📛", label: "역사적 이름", desc: "전생에서 불리던 이름." },
  { icon: "🗓️", label: "시대 & 장소", desc: "살았던 세기와 지역." },
  { icon: "⚔️", label: "역할이나 직업", desc: "전생에서 무엇을 했는지 — 전사, 치유사, 학자, 귀족, 장인." },
  { icon: "📖", label: "생애 이야기", desc: "우리 고양이만을 위해 쓰인 그 생의 완전한 이야기." },
  { icon: "🔗", label: "현재와의 연결", desc: "털 색, 눈빛, 행동이 전생과 어떻게 연결되는지." },
];

const examplesEn = [
  {
    title: "Orange tabby → 15th-century Florentine spice merchant",
    desc: "The AI noted the amber eyes and restless energy as echoes of a life spent navigating trade routes across the Mediterranean.",
  },
  {
    title: "Black cat → Egyptian temple guardian, 1200 BCE",
    desc: "Stationed at the entrance of a temple dedicated to Bastet — which explains why she still surveys every doorway before entering.",
  },
  {
    title: "Grey-blue cat → Japanese ink painter, Edo period",
    desc: "The stillness, the precise movements, the way she sits and observes before acting — all traits of a master craftsman.",
  },
];

const examplesKo = [
  {
    title: "오렌지 태비 → 15세기 피렌체 향신료 상인",
    desc: "AI가 호박빛 눈과 활발한 에너지를 지중해 무역로를 누비던 삶의 흔적으로 읽어냈습니다.",
  },
  {
    title: "검은 고양이 → 기원전 1200년 이집트 신전 수호자",
    desc: "바스테트 여신의 신전 입구를 지키던 역할 — 지금도 방에 들어오기 전 문가를 살피는 이유가 설명됩니다.",
  },
  {
    title: "회색빛 고양이 → 에도 시대 일본 수묵화가",
    desc: "고요함, 정확한 동작, 행동하기 전 관찰하는 자세 — 모두 장인의 특징입니다.",
  },
];

const relatedPosts = [
  { slug: "cats-in-ancient-egypt", titleEn: "Cats in Ancient Egypt: The Original Past-Life Connection", titleKo: "고대 이집트의 고양이: 최초의 전생 연결" },
  { slug: "why-cats-stare-into-empty-space", titleEn: "Why Cats Stare Into Empty Space (A Past-Life Theory)", titleKo: "고양이가 허공을 바라보는 이유 (전생 이론)" },
  { slug: "cat-past-life-clues", titleEn: "Hidden Clues in Your Cat's Appearance That Hint at a Past Life", titleKo: "고양이 외모에 숨겨진 전생의 단서" },
  { slug: "what-your-pets-eyes-reveal", titleEn: "What Your Pet's Eyes Reveal About Their Past Life", titleKo: "반려동물 눈이 말해주는 전생" },
];
