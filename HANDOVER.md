# Pet Past Life — 인수인계 문서

> 펫 사진 → AI가 생성하는 전생 스토리 카드. 결과 이미지(1080×1080)를 공유하면 홈페이지로 친구가 유입되는 바이럴 루프 기반 제품.

마지막 업데이트: 2026-05-20

---

## 0. TL;DR — 5분 만에 돌리기

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정
cp .env.example .env.local
# .env.local 열어서 GEMINI_API_KEY 입력 (https://aistudio.google.com/apikey)

# 3. 개발 서버
npm run dev
# → http://localhost:3000
```

문제 생기면 → **6. 알려진 함정들** 섹션 먼저 확인.

---

## 1. 프로덕트 컨텍스트

### 무엇
펫 사진을 업로드 → Gemma 4 31B 비전 모델이 사진 분석 → 전생의 역사적 인물로 매핑된 카드 생성 → 1080×1080 PNG 공유 이미지로 SNS 공유.

예시 결과:
- "Captain Alistair Thorne, Royal Navy Commodore (1792–1838, Portsmouth)"
- 3문장 스토리 + 사진의 시각적 디테일 2개를 과거와 연결 + 공유용 한 줄 + 해시태그 3개

### 왜 이걸
- Medium 글에서 비슷한 컨셉의 펫 사이킥 AI가 첫 주 37명 유료 유저 달성
- 펫 portrait 시장은 포화 (DreamPets, PetPic AI 등)
- 펫 + past life 텍스트 narrative + 공유성 = 빈 니치

### 타겟
- 1차: 미국/영국/호주 여성 22-38
- 펫 주인 + 사주/타로/MBTI에 우호적인 인구

### 비즈니스 모델
- **단기**: 공유 이미지로 바이럴 → 트래픽 확보
- **수익화**: AdSense보다 Premium tier ($3-5) + Print-on-demand가 더 적합
  - 자세한 건 이 문서 마지막 "다음 단계" 참고

---

## 2. 기술 스택

| 영역 | 선택 | 비고 |
|---|---|---|
| 프레임워크 | Next.js 16.2.6 (Turbopack) | App Router |
| 스타일링 | 순수 CSS (globals.css) | Tailwind 시도했다가 v4 호환 이슈로 포기 — 6번 참고 |
| AI 모델 | Gemma 4 31B (`gemma-4-31b-it`) | Google AI Studio 무료 티어 |
| AI SDK | `@google/genai` | 공식 TypeScript SDK |
| 공유 이미지 | `@vercel/og` + Node runtime | `next/og`는 Turbopack 버그 있음 |
| 저장소 | **없음** | DB 안 씀 — 결과는 in-memory only |
| 배포 (예정) | Vercel | 아직 미배포 |

### 의존성 (`package.json`)

핵심 라이브러리:
```bash
npm install @google/genai @vercel/og
# nextjs, react는 create-next-app 으로 이미 설치됨
```

폰트는 `next/font/google`로 로드 (Outfit + Italiana).

---

## 3. 처음부터 셋업하기

### Prerequisites
- Node.js 20+ (Next.js 16 요구사항)
- npm
- Google AI Studio API 키 — https://aistudio.google.com/apikey 에서 발급

### Step-by-step

```bash
# 저장소 클론 (이미 있으면 생략)
git clone <repo-url>
cd petpastlife

# 의존성 설치
npm install

# 환경변수 파일 생성
cp .env.example .env.local
```

`.env.local` 편집:
```env
GEMINI_API_KEY=AIzaSy...실제_키_여기에
```

```bash
# 개발 서버 시작
npm run dev

# → http://localhost:3000 접속
```

### 첫 동작 확인
1. 펫 사진 업로드 (10MB 이하 JPG/PNG/WebP)
2. 이름 입력 (예: "Mochi")
3. 성별 선택 (Boy/Girl/Not sure)
4. "Reveal Past Life" 클릭
5. 10-15초 후 결과 카드 표시
6. Share / Download 버튼 동작 확인

---

## 4. 파일 구조

```
petpastlife/
├── app/
│   ├── api/
│   │   ├── past-life/
│   │   │   └── route.ts          # Gemma 호출 + 재시도 로직
│   │   └── og/
│   │       └── route.tsx         # 1080×1080 공유 이미지 생성
│   ├── globals.css               # 모든 비주얼 CSS (Tailwind 미사용)
│   ├── layout.tsx                # 루트 레이아웃 + 폰트 로드
│   └── page.tsx                  # 메인 폼 + 결과 화면 토글
├── components/
│   ├── PhotoUpload.tsx           # 사진 드래그/드롭 + 미리보기
│   ├── GenderSelect.tsx          # 슬라이딩 인디케이터 세그먼티드 컨트롤
│   └── ResultCard.tsx            # 결과 카드 + Share/Download 로직
├── public/                       # 정적 파일 (현재 비어있음)
├── .env.example                  # 환경변수 템플릿
├── .env.local                    # 실제 API 키 (gitignore됨)
├── package.json
├── tsconfig.json
├── next.config.ts
└── HANDOVER.md                   # 이 문서
```

### 주요 파일 역할

**`app/page.tsx`** — 상태 머신
- 폼 상태: photo, name, gender
- 제출 상태: isSubmitting, loadingIndex (로딩 메시지 회전)
- 결과 상태: result (있으면 ResultCard 렌더), error
- photoUrl: blob URL 자동 관리 (cleanup 포함)

**`app/api/past-life/route.ts`** — AI 호출
- 입력: multipart form (photo + name + gender)
- 출력: JSON 8필드 (character_name, title, years, location, story, echoes[2], share_line, hashtags[3])
- 재시도: 500/503/INTERNAL/UNAVAILABLE 에러 시 1초 → 2초 backoff, 최대 2번
- maxDuration: 60초 (Gemma 31B가 30-50초 걸림)

**`app/api/og/route.tsx`** — 공유 이미지 (⚠️ `.tsx` 확장자)
- 입력: photoBase64 + petName + data
- 출력: 1080×1080 PNG
- Runtime: **`nodejs`** (Edge 안 됨, 함정 6.B 참고)
- Import: **`@vercel/og`** (`next/og` 안 됨, 함정 6.B 참고)
- 폰트: Google Fonts에서 TTF 받음 (함정 6.C 참고)

**`components/ResultCard.tsx`** — Share/Download
- 사진을 800px JPEG로 리사이즈 후 `/api/og` POST
- 받은 PNG blob 캐싱 (Share 누른 뒤 Download 또 누르면 재생성 X)
- `navigator.share({ files })` 우선, 안 되면 다운로드 폴백
- AbortError (사용자 취소)는 조용히 무시

---

## 5. 아키텍처 결정 사항

### 5.1. 왜 DB가 없는가
원래 Supabase 쓸 계획이었음 → 결과 저장 → `/result/[id]` 공유 URL.

**바꾼 이유**:
- 공유 단위가 URL이 아니라 **이미지**가 더 바이럴함 (인스타/카톡에 어울림)
- 이미지에 `petpastlife.com` 워터마크 → 친구가 봐도 홈 유입
- DB 없으면 Supabase 7일 비활성화 걱정 X, 프라이버시 자동 해결
- API key는 여전히 서버 측 필요하지만 결과 저장은 불필요

→ **결과적으로**: Vercel Functions + Google AI Studio만 있으면 끝. 정말 lean한 스택.

### 5.2. 왜 Tailwind 안 쓰는가
짧은 답: Next.js 16 + Tailwind v4 호환성 이슈로 디버깅 시간 너무 씀.

긴 답: 6.A 참고.

**현재 방식**: `app/globals.css`에 모든 클래스 직접 정의 (`.card`, `.text-input`, `.switch-container` 등). 변경 사항 컨트롤 쉽고, 의존성 0.

### 5.3. 왜 Italiana 폰트인가
Past Life 컨셉의 미술관 명패/빅토리아 초상화 분위기. 본문은 Outfit (clean sans-serif).

### 5.4. 8필드 스키마 (10에서 줄임)
원래 10필드였는데 `signature_trait`와 `ending` 제거:
- `signature_trait`는 `echoes`와 역할 중복 (현재→과거 연결)
- `ending`은 `story`의 3번째 문장으로 흡수 가능

### 5.5. 성별 입력 우선순위
프롬프트에 명시: "사용자 입력된 gender가 사진보다 우선. 'Not sure'면 사진으로 판단."

Gemma 31B가 가끔 사진의 성별을 잘못 읽는 케이스 발견 → 명시적 입력으로 백업.

---

## 6. 알려진 함정들 ⚠️ (꼭 읽기)

### 6.A. Tailwind v4 + Next.js 16 호환 이슈
**증상**: `bg-white`, `max-w-md`, `rounded-3xl` 같은 기본 utility 클래스가 안 먹음. 사용자 화면에서 카드 형태가 사라지고 폼이 viewport 전체로 퍼짐.

**원인**: Next.js 16은 Tailwind v4를 기본 설치하는데, v4는 설정 방식이 v3와 완전 달라짐:
- ❌ `tailwind.config.ts`의 `extend.colors`
- ✅ `globals.css` 내부의 `@theme {}` 블록에 CSS 변수로 정의

근데 `@theme` 설정이 Turbopack에서 가끔 픽업 안 되는 것 같음 (정확한 원인 미상).

**해결**: Tailwind 의존성 자체 제거하고 `globals.css`에 모든 클래스 직접 정의. 동작 보장 + 디버깅 시간 절약.

### 6.B. `next/og` + Edge runtime + Turbopack 버그
**증상**: `/api/og` 호출 시 "Failed to fetch" — 응답이 아예 안 옴.

**원인**: 알려진 버그. GitHub Issue #62783. Turbopack + Edge + `next/og` 조합이 "failed to pipe response"로 죽음.

**해결**:
1. `npm install @vercel/og` (별도 패키지 설치)
2. Import 바꿈: `import { ImageResponse } from "@vercel/og"`
3. Runtime 바꿈: `export const runtime = "nodejs"`

→ `app/api/og/route.tsx`에 이미 적용됨.

### 6.C. Satori WOFF2 미지원
**증상**: `/api/og` 500 에러. 로그에 "Unsupported OpenType signature wOF2".

**원인**: `@vercel/og` 내부의 Satori 렌더 엔진이 WOFF2 폰트 형식을 지원 안 함. TTF/OTF/WOFF만 받음. 근데 모던 브라우저 UA로 Google Fonts에 요청하면 WOFF2를 줌.

**해결**: Google Fonts 요청 시 **구식 Chrome 41 UA** 사용 → Google이 TTF로 응답.

```ts
const css = await fetch(url, {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36",
  },
}).then((r) => r.text());
```

→ `app/api/og/route.tsx`의 `loadGoogleFont()` 함수에 적용됨.

### 6.D. Gemma API 500 INTERNAL 에러
**증상**: `[past-life] FAIL 2298ms Error [ApiError]: {"error":{"code":500,"message":"Internal error encountered.","status":"INTERNAL"}}`

**원인**: Google API 일시 장애. 우리 코드 문제 아님. status: "INTERNAL"은 Google 서버 측 문제.

**해결**: 자동 재시도 로직 추가 (1초 → 2초 backoff, 최대 2번).

→ `app/api/past-life/route.ts`의 `generateWithRetry()` 함수.

### 6.E. Hydration 에러 (Grammarly 등 브라우저 확장)
**증상**: 콘솔에 "A tree hydrated but some attributes of the server rendered HTML didn't match" — `data-new-gr-c-s-check-loaded`, `data-gr-ext-installed` 속성 mismatch.

**원인**: Grammarly 같은 브라우저 확장이 SSR 후 body에 속성 삽입.

**해결**: `<html>`과 `<body>`에 `suppressHydrationWarning` 추가. 이미 적용됨.

### 6.F. Memory leak — blob URL
**증상**: 장시간 사용 시 메모리 누수 가능.

**해결**: `URL.createObjectURL()` 만든 거 다 `revokeObjectURL()` 해야 함. `page.tsx`의 `handlePhotoChange()`, `useEffect` cleanup에서 처리됨.

### 6.G. 캐시 문제
**증상**: 코드 바꿨는데 변경 사항 반영 안 됨.

**해결**:
```bash
rm -rf .next
npm run dev
```

브라우저는 `Cmd+Shift+R` (Mac) / `Ctrl+Shift+R` (Win)으로 하드 리프레시.

---

## 7. API 레퍼런스

### `POST /api/past-life`

**Request** (multipart/form-data):
```
photo:  File (image/jpeg | image/png | image/webp, ≤10MB)
name:   string (펫 이름, trim됨)
gender: "boy" | "girl" | "unknown"
```

**Response** (200):
```json
{
  "result": {
    "character_name": "Captain Alistair Thorne",
    "title": "Royal Navy Commodore",
    "years": "1792–1838",
    "location": "Portsmouth, England",
    "story": "He commanded the fleet during the Napoleonic Wars. He once...",
    "echoes": [
      { "photo_detail": "The golden-brown fur", "past_parallel": "..." },
      { "photo_detail": "...", "past_parallel": "..." }
    ],
    "share_line": "Mochi was once a Royal Navy Commodore!",
    "hashtags": ["pastlife", "goldenretriever", "royalnavy"]
  }
}
```

**Response** (4xx / 5xx):
```json
{ "error": "메시지" }
```

503은 "AI service is busy. Try again." (Google 일시 장애), 500은 기타 에러.

### `POST /api/og`

**Request** (application/json):
```json
{
  "photoBase64": "/9j/4AAQ...",
  "photoMime": "image/jpeg",
  "petName": "Mochi",
  "data": { /* 위 result 그대로 */ }
}
```

**Response**: `image/png` (1080×1080)

---

## 8. Google AI Studio 한도

현재 무료 티어 (2026-05 기준):

| 모델 | RPM | RPD | 비고 |
|---|---|---|---|
| `gemma-4-31b-it` | 15 | 1,500 | ⭐ 현재 사용중 |
| `gemma-4-26b-it` | 15 | 1,500 | 더 빠름, 살짝 떨어지는 품질 |

→ 트래픽이 일 1,500 넘어가기 시작하면 유료 티어 전환 필요.

→ 또는 26B로 폴백 고려.

---

## 9. 다음 단계 (우선순위 순)

### 9.1. Vercel 배포 (다음 작업)
```bash
# GitHub 푸시
git init && git add . && git commit -m "Initial commit"
gh repo create petpastlife --private --source=. --push

# Vercel
# https://vercel.com/new → repo import → Next.js auto-detect
# Environment Variables → GEMINI_API_KEY 추가
# Deploy
```

배포 후: `petpastlife-xxx.vercel.app` URL 받음. 모바일 테스트 (특히 `navigator.share`).

### 9.2. SEO + 신뢰 페이지
AdSense 승인에도 필요하고 SEO에도 도움됨:
- `app/privacy/page.tsx` — Privacy Policy
- `app/terms/page.tsx` — Terms of Service
- `app/about/page.tsx` — 제품 소개
- `app/sitemap.ts` — Next.js 자동 sitemap
- `public/robots.txt`
- 메인 페이지에 Schema.org JSON-LD (`WebApplication` 타입)
- 랜딩용 OG 이미지 (정적, 1200×630)

### 9.3. 트래픽 시드
**SEO만으로 안 됨** — 직접 푸시 필요:
- Reddit: `r/aww`, `r/pets`, `r/dogs`, `r/cats` — 본인 펫 결과 공유 ("look what AI said about my dog")
- TikTok: 펫 → 결과 카드 reveal 영상 (15초)
- Instagram: 펫 인플루언서 멘션

목표: 100-1,000 일일 유저.

### 9.4. 수익화
**광고(AdSense)보다 잘 맞는 옵션 우선**:

**Premium tier** ($3-5 일회성, Stripe):
- 무제한 생성
- 시대 선택 (Victorian / Ancient / 1920s 등)
- 워터마크 없는 HD 이미지
- 더 긴 스토리 (5문장 등)

**Print-on-demand** (제일 큰 기회):
- Printful / Gelato API
- 11×14 프레임 프린트 $29-49 판매
- 마진 $15-25 per sale
- CVR 1%면 광고보다 100배 효율

**Affiliate**:
- Chewy / Amazon Pet
- 결과 페이지에 "Mochi might love these" 큐레이션

**AdSense**:
- 트래픽 5,000+/일 되면 시도
- 펫 니치 RPM $2-4 정도
- 단일 페이지 도구는 승인 어려움 → 9.2 콘텐츠 페이지가 도움됨

### 9.5. 도메인
- `petpastlife.com` (Namecheap, ~$12/년)
- 배포 안정화 + 트래픽 푸시 시작할 때 사면 됨
- Vercel에서 도메인 연결 → 자동 HTTPS

### 9.6. 분석 도구
- Google Search Console (SEO)
- Vercel Analytics 또는 Plausible (트래픽)
- 콘솔 로그 (`[past-life] OK`)는 Vercel logs에서 확인

---

## 10. 유용한 명령어

```bash
# 개발
npm run dev

# 캐시 클리어
rm -rf .next

# 빌드 (프로덕션 미리보기)
npm run build && npm start

# 타입 체크
npx tsc --noEmit

# API 직접 테스트
curl -X POST http://localhost:3000/api/past-life \
  -F "photo=@/path/to/pet.jpg" \
  -F "name=Mochi" \
  -F "gender=girl"

# OG 라우트 검증 (필수 필드 누락 응답 확인용)
curl -X POST http://localhost:3000/api/og \
  -H "Content-Type: application/json" \
  -d '{}'
# → 400 "Missing fields" 떠야 정상
```

---

## 11. 외부 리소스

| 서비스 | URL | 용도 |
|---|---|---|
| Google AI Studio | https://aistudio.google.com/apikey | API 키 발급, 한도 확인 |
| Vercel | https://vercel.com/ | 배포 |
| Next.js 16 docs | https://nextjs.org/docs | 프레임워크 레퍼런스 |
| @vercel/og docs | https://vercel.com/docs/og-image-generation | 공유 이미지 |
| Satori | https://github.com/vercel/satori | OG 렌더 엔진 (CSS 제약 확인용) |

---

## 12. 연락처 / 추가 정보

- 원본 컨셉 출처: Medium 글 "How I built a pet psychic AI with Gemini 2.5" (저자: 미확인)
- 펫 portrait 시장 분석: 포화 (DreamPets 400K 유저 등) → 텍스트 narrative + past life 차별화
- 타겟 마켓: US/UK/AU 영어권 → 한국 시장 향후 확장 고려

---

**End of handover document.**

이 문서는 코드 변경할 때마다 같이 업데이트할 것. 특히 "함정" 섹션은 향후 디버깅 시간을 가장 많이 절약해줌.
