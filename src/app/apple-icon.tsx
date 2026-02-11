import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "180px",
          height: "180px",
          borderRadius: "40px",
          background: "linear-gradient(135deg, #F7931A 0%, #E8850F 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "110px",
          fontWeight: 800,
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        B
      </div>
    ),
    { ...size }
  );
}
