import { NextRequest, NextResponse } from "next/server";
import { fetchAllExchangeData } from "@/lib/exchange-service";
import { exchangeCache, PRICE_TTL_MS, FEE_TTL_MS } from "@/lib/exchange-cache";
import { simulateMarketBuy } from "@/lib/market-simulation";
import { MarketDataApiResponse, ExchangeData, CryptoAsset } from "@/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow up to 60s for fetching 100+ exchanges

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const amount = parseFloat(searchParams.get("amount") || "1000");
    const investmentAmount = isNaN(amount) || amount <= 0 ? 1000 : amount;

    const assetParam = (searchParams.get("asset") || "BTC").toUpperCase();
    const validAssets: CryptoAsset[] = ["BTC", "ETH", "DOGE"];
    const asset: CryptoAsset = validAssets.includes(assetParam as CryptoAsset)
      ? (assetParam as CryptoAsset)
      : "BTC";

    const { exchanges, totalDiscovered } = await fetchAllExchangeData(asset);

    // Run market buy simulation for each exchange that has order book data
    const exchangesWithSimulation: ExchangeData[] = exchanges.map((ex) => {
      if (ex.orderBook?.rawAsks && ex.orderBook.rawAsks.length > 0) {
        const sim = simulateMarketBuy(ex.orderBook.rawAsks, investmentAmount);
        return {
          ...ex,
          simulation: sim,
          // Strip raw order book data from response to save bandwidth
          orderBook: ex.orderBook
            ? {
                bestBid: ex.orderBook.bestBid,
                bestAsk: ex.orderBook.bestAsk,
                spreadUSD: ex.orderBook.spreadUSD,
                spreadPercent: ex.orderBook.spreadPercent,
                bidDepth: ex.orderBook.bidDepth,
                askDepth: ex.orderBook.askDepth,
                rawAsks: [],
                rawBids: [],
              }
            : null,
        };
      }
      return ex;
    });

    const totalResponsive = exchangesWithSimulation.filter(
      (e) => e.status === "ok"
    ).length;

    const response: MarketDataApiResponse = {
      exchanges: exchangesWithSimulation,
      timestamp: new Date().toISOString(),
      totalDiscovered,
      totalResponsive,
      cache: {
        pricesCachedAt: (() => {
          const ts = exchangeCache.getTimestamp("mkt:price:binance");
          return ts ? new Date(ts).toISOString() : null;
        })(),
        feesCachedAt: (() => {
          const ts = exchangeCache.getTimestamp("mkt:fees:binance");
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
    console.error("[api/market-data] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch exchange data" },
      { status: 500 }
    );
  }
}
