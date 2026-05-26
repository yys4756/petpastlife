import { ImageResponse } from "next/og";
import { getPost } from "../_posts";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function OgImage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.title ?? "Pet Past Life Blog";
  const excerpt = post?.excerpt ?? "Stories about pets and past lives";

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
            alignItems: "flex-start",
            justifyContent: "center",
            padding: 80,
          }}
        >
          <div style={{ fontSize: 24, color: "#9CA3AF", marginBottom: 24, display: "flex" }}>
            Pet Past Life · Blog
          </div>
          <div
            style={{
              fontSize: 60,
              color: "#1F2937",
              lineHeight: 1.2,
              fontWeight: 700,
              maxWidth: 900,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {title}
          </div>
          <div
            style={{
              width: 60,
              height: 3,
              backgroundColor: "#6B1F2C",
              marginTop: 40,
              marginBottom: 40,
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 28,
              color: "#6B7280",
              lineHeight: 1.5,
              maxWidth: 900,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {excerpt}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
