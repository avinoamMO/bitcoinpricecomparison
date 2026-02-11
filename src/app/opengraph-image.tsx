import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CryptoROI - Compare Bitcoin & Crypto Prices Across 100+ Exchanges";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
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
        {/* Top section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Logo / Icon area */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #F7931A 0%, #E8850F 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "36px",
                fontWeight: 800,
                color: "white",
              }}
            >
              B
            </div>
            <span
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#F7931A",
                letterSpacing: "-0.02em",
              }}
            >
              CryptoROI
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: "56px",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              maxWidth: "800px",
            }}
          >
            Compare Crypto Prices Across 100+ Exchanges
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: "24px",
              color: "#a1a1aa",
              lineHeight: 1.4,
              maxWidth: "700px",
            }}
          >
            Find the cheapest way to buy Bitcoin, Ethereum, and more. Real-time fees, spreads, and net ROI.
          </div>
        </div>

        {/* Metric pills */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
          {["100+ Exchanges", "Real-time Prices", "Fee Comparison"].map(
            (label) => (
              <div
                key={label}
                style={{
                  padding: "10px 20px",
                  borderRadius: "9999px",
                  background: "rgba(247, 147, 26, 0.1)",
                  border: "1px solid rgba(247, 147, 26, 0.3)",
                  color: "#F7931A",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                {label}
              </div>
            )
          )}
        </div>

        {/* Footer */}
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
          <span style={{ color: "#71717a", fontSize: "16px" }}>
            cryptoroi.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
