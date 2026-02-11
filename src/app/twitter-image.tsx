import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CryptoROI - Compare Bitcoin & Crypto Prices Across 100+ Exchanges";
export const size = { width: 1200, height: 600 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #F7931A 0%, #E8850F 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                fontWeight: 800,
                color: "white",
              }}
            >
              B
            </div>
            <span style={{ fontSize: "26px", fontWeight: 700, color: "#F7931A" }}>
              CryptoROI
            </span>
          </div>
          <div
            style={{
              fontSize: "48px",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              maxWidth: "800px",
            }}
          >
            Compare Crypto Prices Across 100+ Exchanges
          </div>
          <div style={{ fontSize: "22px", color: "#a1a1aa", maxWidth: "700px" }}>
            Find the cheapest way to buy Bitcoin, Ethereum, and more.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "20px",
          }}
        >
          <span style={{ color: "#71717a", fontSize: "16px" }}>
            Built by Avinoam Oltchik
          </span>
          <span style={{ color: "#71717a", fontSize: "16px" }}>cryptoroi.com</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
