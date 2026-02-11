import { NextRequest, NextResponse } from "next/server";
import { exchanges } from "@/data/exchanges";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get("slug");

  if (slug) {
    const exchange = exchanges.find((e) => e.slug === slug);
    if (!exchange) {
      return NextResponse.json({ error: "Exchange not found" }, { status: 404 });
    }
    return NextResponse.json(exchange);
  }

  const summary = exchanges.map((e) => ({
    id: e.id, name: e.name, slug: e.slug, logo: e.logo, url: e.url,
    affiliateUrl: e.affiliateUrl, rating: e.rating,
    makerFee: e.feeStructure.makerFee, takerFee: e.feeStructure.takerFee,
    supportedCurrencies: e.supportedCurrencies, isIsraeli: e.isIsraeli || false,
  }));

  return NextResponse.json({ exchanges: summary });
}
