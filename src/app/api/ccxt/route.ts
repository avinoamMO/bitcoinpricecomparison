import { NextResponse } from "next/server";
import { fetchAllCcxtData } from "@/lib/ccxt-service";
import { exchangeCache, PRICE_TTL_MS, FEE_TTL_MS } from "@/lib/exchange-cache";
import { CcxtApiResponse } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const exchanges = await fetchAllCcxtData();

    const response: CcxtApiResponse = {
      exchanges,
      timestamp: new Date().toISOString(),
      cache: {
        pricesCachedAt: (() => {
          const ts = exchangeCache.getTimestamp("ccxt:price:binance");
          return ts ? new Date(ts).toISOString() : null;
        })(),
        feesCachedAt: (() => {
          const ts = exchangeCache.getTimestamp("ccxt:fees:binance");
          return ts ? new Date(ts).toISOString() : null;
        })(),
        pricesTTL: PRICE_TTL_MS / 1000,
        feesTTL: FEE_TTL_MS / 1000,
      },
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, max-age=15, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("[api/ccxt] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch exchange data" },
      { status: 500 }
    );
  }
}
