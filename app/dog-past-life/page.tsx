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
    ? "강아지 전생 알아보기 — AI로 밝히는 내 강아지의 전생"
    : "Dog Past Life — Reveal Who Your Dog Was in a Past Life";
  const description = isKo
    ? "우리 강아지의 전생이 궁금하세요? 사진을 업로드하면 AI가 역사 속 전생 이야기를 30초 만에 알려드려요. 무료."
    : "Discover your dog's past life with AI. Upload a photo and we'll reveal who they were — warrior, healer, noble, or wanderer. Free and instant.";
  const url = `${BASE}/dog-past-life`;

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
    q: "What does my dog's past life reading include?",
    a: "A historical name, era, location, role or profession, a full life narrative, and specific connections between your dog's current appearance and personality traits and their past identity.",
  },
  {
    q: "How does the AI analyze my dog's photo?",
    a: "The AI looks at breed characteristics, coat color and markings, body posture, facial expression, and eye color to craft a unique, historically grounded past-life story.",
  },
  {
    q: "Why do dogs seem to remember things from another time?",
    a: "Dogs have lived alongside humans for 15,000+ years — longer than any other domesticated animal. Behaviors like circling before sleeping, burying food, and unwavering loyalty have deep roots that predate modern dog breeds by millennia.",
  },
  {
    q: "Can I use this for any dog breed?",
    a: "Yes — any breed, any mix, any size. The AI has seen golden retrievers, huskies, chihuahuas, and everything in between.",
  },
  {
    q: "Is this service free?",
    a: "Completely free. No account needed, no hidden charges ever.",
  },
];

const faqKo = [
  {
    q: "강아지 전생 결과에는 무엇이 포함되나요?",
    a: "역사적 이름, 시대, 장소, 역할이나 직업, 완전한 생애 이야기, 그리고 현재 강아지의 외모·성격과 전생의 연결점을 담은 이야기를 받게 됩니다.",
  },
  {
    q: "AI가 강아지 사진을 어떻게 분석하나요?",
    a: "품종 특성, 털 색상과 무늬, 몸의 자세, 표정, 눈 색깔을 분석하여 역사적으로 그럴듯한 세상에 단 하나뿐인 전생 이야기를 만들어냅니다.",
  },
  {
    q: "강아지가 왜 다른 시대의 무언가를 기억하는 것처럼 느껴질까요?",
    a: "개는 15,000년 이상 인간 곁에 살아온 동물입니다 — 어떤 가축보다도 길죠. 잠들기 전 빙빙 도는 행동, 먹이 묻기, 흔들리지 않는 충성심은 현대 견종보다 훨씬 더 오래된 뿌리를 가집니다.",
  },
  {
    q: "어떤 강아지도 이용할 수 있나요?",
    a: "네 — 품종, 믹스, 크기 무관. AI는 골든 리트리버부터 치와와까지 모두 경험했습니다.",
  },
  {
    q: "무료인가요?",
    a: "완전 무료입니다. 회원가입 불필요, 숨겨진 비용 없음.",
  },
];

export default async function DogPastLifePage() {
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
            <div style={{ fontSize: "3rem", lineHeight: 1, marginBottom: "1rem" }}>🐶</div>
            <h1 className="title">
              {isKo ? "강아지 전생 알아보기" : "Your Dog's Past Life"}
            </h1>
            <p className="subtitle">
              {isKo
                ? "우리 강아지가 전생에 누구였을까요? AI가 사진 한 장으로 역사 속 정체를 밝혀드립니다."
                : "Upload your dog's photo and discover who they were before — a warrior, a healer, a wanderer. A life story written just for them."}
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

        {/* The ancient bond */}
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h2 style={sectionHeadStyle}>
            {isKo ? "15,000년의 유대" : "15,000 Years of Partnership"}
          </h2>
          <p style={bodyStyle}>
            {isKo
              ? "개는 인류가 처음 정착 생활을 시작하기도 전부터 우리 곁에 있었습니다. 어떤 가축보다 오래된 동반자입니다. 전사의 옆에서 싸우고, 목동의 양 떼를 몰고, 왕의 왕좌 옆에 앉아 있었습니다. 지금 소파에서 당신 옆에 있는 강아지도 그 기나긴 역사의 한 부분입니다."
              : "Dogs were with humans before we built cities, before we invented agriculture, before we had writing. No other animal has a longer documented bond with our species. They fought alongside warriors, herded flocks for shepherds, sat beside kings. The dog on your couch right now is part of that 15,000-year story."}
          </p>
          <p style={bodyStyle}>
            {isKo
              ? "강아지의 행동에서 느껴지는 오래된 감각 — 낯선 사람을 향한 본능적 경계심, 당신이 슬플 때 감지하는 능력, 절대 무너지지 않는 충성심 — 은 이 깊은 역사에서 비롯됩니다."
              : "The ancient quality you sense in your dog — their instinctive wariness of strangers, their ability to detect your mood before you've expressed it, the loyalty that doesn't waver — comes from that depth of history."}
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
            {isKo ? "강아지 전생 예시" : "Examples of Dog Past Lives"}
          </h2>
          <p style={{ ...bodyStyle, marginBottom: "1rem" }}>
            {isKo
              ? "실제 결과들은 강아지마다 완전히 다릅니다:"
              : "Every dog gets a different story — but here's what the readings look like:"}
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
            {isKo ? "내 강아지의 전생이 궁금하세요?" : "Ready to meet who your dog was before?"}
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
          <Link href="/cat-past-life" style={{ color: "rgba(255,255,255,0.6)" }}>
            {isKo ? "고양이 전생" : "Cat Past Life"}
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
  { icon: "⚔️", label: "Role or profession", desc: "What they did — warrior, shepherd, guard, healer, companion." },
  { icon: "📖", label: "Life story", desc: "A full narrative of that lifetime, written uniquely for your dog." },
  { icon: "🔗", label: "Present-day echoes", desc: "How their markings, build, or behaviors connect to who they were." },
];

const revealItemsKo = [
  { icon: "📛", label: "역사적 이름", desc: "전생에서 불리던 이름." },
  { icon: "🗓️", label: "시대 & 장소", desc: "살았던 세기와 지역." },
  { icon: "⚔️", label: "역할이나 직업", desc: "전생에서 무엇을 했는지 — 전사, 목동, 경호원, 치유사, 동반자." },
  { icon: "📖", label: "생애 이야기", desc: "우리 강아지만을 위해 쓰인 그 생의 완전한 이야기." },
  { icon: "🔗", label: "현재와의 연결", desc: "털 무늬, 체형, 행동이 전생과 어떻게 연결되는지." },
];

const examplesEn = [
  {
    title: "Golden retriever → 19th-century Scottish gamekeeper",
    desc: "The loyalty, the love of water, the gentle mouth — all consistent with a working life spent in the Scottish Highlands, retrieving birds for a laird.",
  },
  {
    title: "Husky → 13th-century Mongolian messenger rider",
    desc: "Built for endurance in cold terrain, with the instinct to keep moving regardless of obstacles. The AI described a life of covering vast distances across the steppe.",
  },
  {
    title: "Small mixed breed → 18th-century Parisian baker's assistant",
    desc: "Alert, quick, curious about everyone. The kind of dog who watched the whole neighborhood from the bakery doorstep and knew everyone's business.",
  },
];

const examplesKo = [
  {
    title: "골든 리트리버 → 19세기 스코틀랜드 사냥터지기",
    desc: "충성심, 물을 좋아하는 성격, 부드러운 입 — 모두 스코틀랜드 고지에서 영주를 위해 사냥감을 회수하던 삶과 일치합니다.",
  },
  {
    title: "허스키 → 13세기 몽골 파발마 기수",
    desc: "추운 지형에서의 지구력, 어떤 장애물 앞에서도 계속 나아가려는 본능. AI는 광활한 초원을 가로지르는 삶을 묘사했습니다.",
  },
  {
    title: "소형 믹스 → 18세기 파리 제빵사 보조",
    desc: "눈치 빠르고, 민첩하고, 모두에게 호기심 가득. 빵집 문 앞에서 온 동네를 관찰하던 개.",
  },
];

const relatedPosts = [
  { slug: "10-signs-your-dog-was-a-warrior", titleEn: "10 Signs Your Dog Was a Warrior in a Past Life", titleKo: "강아지가 전생에 전사였다는 10가지 신호" },
  { slug: "ancient-bond-humans-and-dogs", titleEn: "The Ancient Bond Between Humans and Dogs", titleKo: "인간과 개의 고대적 유대" },
  { slug: "golden-retriever-past-life", titleEn: "The Golden Retriever's Past Life: Why This Breed Feels Like an Old Friend", titleKo: "골든 리트리버의 전생: 왜 처음부터 아는 것 같은가" },
  { slug: "why-dogs-are-loyal-past-life", titleEn: "Why Are Dogs So Loyal? A Past-Life Perspective", titleKo: "개는 왜 이렇게 충성스러울까? 전생으로 보는 관점" },
];
