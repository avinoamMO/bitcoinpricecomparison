import { ImageResponse } from "next/og";
import { getExchangeBySlug, exchanges } from "@/data/exchanges";
import { getExchangeProfile } from "@/data/exchange-profiles";

export const runtime = "edge";
export const alt = "Exchange fees and review";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return exchanges.map((exchange) => ({ slug: exchange.slug }));
}

export default function OGImage({ params }: { params: { slug: string } }) {
  const exchange = getExchangeBySlug(params.slug);
  if (!exchange) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "#0a0a0a",
            color: "#fafafa",
            fontSize: 48,
          }}
        >
          Exchange Not Found
        </div>
      ),
      { ...size }
    );
  }

  const profile = getExchangeProfile(params.slug);
  const makerFee = (exchange.feeStructure.makerFee * 100).toFixed(2);
  const takerFee = (exchange.feeStructure.takerFee * 100).toFixed(2);
  const tagline = profile?.tagline ?? exchange.description;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#0a0a0a",
          padding: "60px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "48px",
                height: "48px",
                backgroundColor: "rgba(245, 158, 11, 0.15)",
                borderRadius: "12px",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                color: "#f59e0b",
              }}
            >
              B
            </div>
            <span style={{ fontSize: "28px", color: "#fafafa", fontWeight: 700 }}>
              Crypto<span style={{ color: "#f59e0b" }}>ROI</span>
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "20px",
              color: "#a3a3a3",
            }}
          >
            <span style={{ color: "#f59e0b" }}>&#9733;</span>
            {exchange.rating}/5
          </div>
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: 800,
              color: "#fafafa",
              margin: "0 0 12px 0",
              lineHeight: 1.1,
            }}
          >
            {exchange.name}
          </h1>
          <p
            style={{
              fontSize: "24px",
              color: "#a3a3a3",
              margin: "0 0 40px 0",
              maxWidth: "800px",
            }}
          >
            {tagline}
          </p>

          {/* Fee boxes */}
          <div style={{ display: "flex", gap: "24px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#111111",
                border: "1px solid #222222",
                borderRadius: "16px",
                padding: "24px 32px",
                minWidth: "200px",
              }}
            >
              <span style={{ fontSize: "16px", color: "#a3a3a3", marginBottom: "8px" }}>
                Maker Fee
              </span>
              <span style={{ fontSize: "36px", fontWeight: 700, color: "#22c55e" }}>
                {makerFee}%
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#111111",
                border: "1px solid #222222",
                borderRadius: "16px",
                padding: "24px 32px",
                minWidth: "200px",
              }}
            >
              <span style={{ fontSize: "16px", color: "#a3a3a3", marginBottom: "8px" }}>
                Taker Fee
              </span>
              <span style={{ fontSize: "36px", fontWeight: 700, color: "#fafafa" }}>
                {takerFee}%
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#111111",
                border: "1px solid #222222",
                borderRadius: "16px",
                padding: "24px 32px",
                minWidth: "200px",
              }}
            >
              <span style={{ fontSize: "16px", color: "#a3a3a3", marginBottom: "8px" }}>
                Founded
              </span>
              <span style={{ fontSize: "36px", fontWeight: 700, color: "#fafafa" }}>
                {exchange.founded}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #222222",
            paddingTop: "20px",
            marginTop: "20px",
          }}
        >
          <span style={{ fontSize: "18px", color: "#a3a3a3" }}>
            Fees & Review 2026
          </span>
          <span style={{ fontSize: "18px", color: "#f59e0b" }}>
            cryptoroi.com/exchanges/{exchange.slug}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
