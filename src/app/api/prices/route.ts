import { NextRequest, NextResponse } from "next/server";
import { fetchPrices } from "@/lib/price-service";
import { Currency } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const currency = (request.nextUrl.searchParams.get("currency") || "USD") as Currency;
    if (!["USD", "EUR", "ILS", "GBP"].includes(currency)) {
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
    }
    const data = await fetchPrices(currency);
    return NextResponse.json(data, { headers: { "Cache-Control": "public, s-maxage=30" } });
  } catch {
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 });
  }
}
