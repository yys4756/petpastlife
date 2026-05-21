import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Pet Past Life — Discover who your pet was before";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
          padding: 80,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            borderRadius: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 80,
          }}
        >
          {/* Paw icon placeholder */}
          <div
            style={{
              fontSize: 80,
              marginBottom: 32,
              display: "flex",
            }}
          >
            🐾
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 88,
              color: "#1F2937",
              textAlign: "center",
              lineHeight: 1,
              fontWeight: 400,
              display: "flex",
            }}
          >
            Pet Past Life
          </div>

          {/* Tagline */}
          <div
            style={{
              marginTop: 28,
              fontSize: 32,
              color: "#6B7280",
              textAlign: "center",
              display: "flex",
            }}
          >
            Who was your pet in a past life?
          </div>

          {/* Divider */}
          <div
            style={{
              width: 80,
              height: 2,
              backgroundColor: "#6B1F2C",
              marginTop: 48,
              marginBottom: 48,
              display: "flex",
            }}
          />

          {/* Description */}
          <div
            style={{
              fontSize: 26,
              color: "#9CA3AF",
              textAlign: "center",
              maxWidth: 700,
              lineHeight: 1.5,
              display: "flex",
            }}
          >
            Upload a photo · Get an AI-powered past life story · Share with friends
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
