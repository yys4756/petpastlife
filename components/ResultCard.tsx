"use client";

import { useState, useRef } from "react";

export interface PastLifeData {
  character_name: string;
  title: string;
  years: string;
  location: string;
  story: string;
  echoes: { photo_detail: string; past_parallel: string }[];
  share_line: string;
  hashtags: string[];
}

interface ResultCardProps {
  data: PastLifeData;
  petName: string;
  photoUrl: string | null;
  photoFile: File | null;
  onReset: () => void;
}

// ───────────────────────────────────────────
// 헬퍼: 사진 800px로 리사이즈 + base64 JPEG로 인코딩
// → /api/og 호출 시 body 크기 100~200KB로 줄임
// ───────────────────────────────────────────
async function resizeAndEncode(
  file: File,
  maxDim: number,
): Promise<{ base64: string; mime: string }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ratio = Math.min(
          maxDim / img.naturalWidth,
          maxDim / img.naturalHeight,
          1,
        );
        canvas.width = Math.round(img.naturalWidth * ratio);
        canvas.height = Math.round(img.naturalHeight * ratio);
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas context unavailable");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        resolve({ base64: dataUrl.split(",")[1], mime: "image/jpeg" });
      } catch (e) {
        URL.revokeObjectURL(url);
        reject(e);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Photo could not be loaded"));
    };
    img.src = url;
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ───────────────────────────────────────────
export function ResultCard({
  data,
  petName,
  photoUrl,
  photoFile,
  onReset,
}: ResultCardProps) {
  const [busy, setBusy] = useState<"idle" | "share" | "download">("idle");
  // blob 캐싱 — Share/Download 둘 다 같은 PNG 재사용
  const cachedBlobRef = useRef<Blob | null>(null);

  async function generateShareImage(): Promise<Blob> {
    if (cachedBlobRef.current) return cachedBlobRef.current;
    if (!photoFile) throw new Error("Photo missing.");

    const { base64, mime } = await resizeAndEncode(photoFile, 800);
    const res = await fetch("/api/og", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        photoBase64: base64,
        photoMime: mime,
        petName,
        data,
      }),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(txt || `Image generation failed (${res.status})`);
    }
    const blob = await res.blob();
    cachedBlobRef.current = blob;
    return blob;
  }

  const safeFilename = `${petName.toLowerCase().replace(/\s+/g, "-")}-past-life.png`;

  async function handleShare() {
    if (busy !== "idle") return;
    setBusy("share");
    try {
      const blob = await generateShareImage();
      const file = new File([blob], safeFilename, { type: "image/png" });

      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const shareData = {
        title: `${petName}'s Past Life`,
        text: `${petName} was once ${data.character_name}. Discover your pet's past life → ${origin}`,
        files: [file],
      };

      // 파일까지 공유 가능한 경우 (모바일 Safari/Chrome)
      if (
        typeof navigator !== "undefined" &&
        "canShare" in navigator &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
      } else if (typeof navigator !== "undefined" && "share" in navigator) {
        // 파일은 안 되지만 텍스트/URL은 되는 경우
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          url: origin,
        });
      } else {
        // 공유 API 없음 → 다운로드 폴백
        downloadBlob(blob, safeFilename);
      }
    } catch (err) {
      // 사용자가 공유 시트 닫은 경우는 AbortError → 조용히 무시
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("[share] failed:", err);
        alert("Share failed. " + (err.message || "Try Download instead."));
      }
    } finally {
      setBusy("idle");
    }
  }

  async function handleDownload() {
    if (busy !== "idle") return;
    setBusy("download");
    try {
      const blob = await generateShareImage();
      downloadBlob(blob, safeFilename);
    } catch (err) {
      console.error("[download] failed:", err);
      alert(err instanceof Error ? err.message : "Download failed.");
    } finally {
      setBusy("idle");
    }
  }

  return (
    <div className="card">
      <header className="result-header">
        {photoUrl && (
          <div className="pet-portrait">
            <img src={photoUrl} alt={petName} />
          </div>
        )}
        <div className="result-eyebrow">
          PAST LIFE OF {petName.toUpperCase()}
        </div>
        <h1 className="result-name">{data.character_name}</h1>
        <div className="result-title-line">{data.title}</div>
        <div className="result-meta">
          {data.years} · {data.location}
        </div>
      </header>

      <div className="result-divider" />

      <section className="result-section">
        <div className="result-section-label">Story</div>
        <p className="result-section-body">{data.story}</p>
      </section>

      <section className="result-section">
        <div className="result-section-label">Echoes in This Life</div>
        <ul className="result-echoes">
          {data.echoes.map((echo, i) => (
            <li key={i} className="result-echo">
              <div className="result-echo-detail">{echo.photo_detail}</div>
              <div className="result-echo-parallel">
                <span className="result-echo-arrow">→</span>
                {echo.past_parallel}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="result-divider" />

      <div className="result-share">"{data.share_line}"</div>
      <div className="result-hashtags">
        {data.hashtags.map((tag, i) => (
          <span key={i} className="result-hashtag">
            #{tag}
          </span>
        ))}
      </div>

      <div className="share-actions">
        <button
          type="button"
          onClick={handleShare}
          disabled={busy !== "idle"}
          className="share-btn share-btn-primary"
        >
          {busy === "share" ? "Preparing…" : "Share"}
        </button>
        <button
          type="button"
          onClick={handleDownload}
          disabled={busy !== "idle"}
          className="share-btn share-btn-secondary"
        >
          {busy === "download" ? "Preparing…" : "Download"}
        </button>
      </div>

      <button type="button" onClick={onReset} className="try-again-button">
        Try another pet
      </button>
    </div>
  );
}
