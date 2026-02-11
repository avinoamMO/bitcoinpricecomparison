import { NextRequest, NextResponse } from "next/server";
import { exchanges } from "@/data/exchanges";

const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get("slug");

    if (slug) {
      const exchange = exchanges.find((e) => e.slug === slug);
      if (!exchange) {
        return NextResponse.json({ error: "Exchange not found" }, { status: 404 });
      }
      return NextResponse.json(exchange, { headers: CACHE_HEADERS });
    }

    const summary = exchanges.map((e) => ({
      id: e.id, name: e.name, slug: e.slug, logo: e.logo, url: e.url,
      affiliateUrl: e.affiliateUrl, rating: e.rating,
      makerFee: e.feeStructure.makerFee, takerFee: e.feeStructure.takerFee,
      supportedCurrencies: e.supportedCurrencies, isIsraeli: e.isIsraeli || false,
    }));

    return NextResponse.json({ exchanges: summary }, { headers: CACHE_HEADERS });
  } catch (error) {
    console.error("[api/exchanges] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch exchanges" },
      { status: 500 }
    );
  }
}
