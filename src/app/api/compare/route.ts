import { NextRequest, NextResponse } from "next/server";
import { fetchPrices } from "@/lib/price-service";
import { calculateComparison } from "@/lib/comparison-engine";
import { Currency, DepositMethod } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const amount = Number(sp.get("amount") || "1000");
    const currency = (sp.get("currency") || "USD") as Currency;
    const depositMethod = (sp.get("depositMethod") || "bank_transfer") as DepositMethod;
    const mode = (sp.get("mode") || "buy") as "buy" | "sell";

    if (isNaN(amount) || amount <= 0) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    if (amount > 10000000) return NextResponse.json({ error: "Amount too large" }, { status: 400 });

    const prices = await fetchPrices(currency);
    const comparison = calculateComparison(prices.prices, { amount, currency, depositMethod, mode });
    return NextResponse.json(comparison, { headers: { "Cache-Control": "public, s-maxage=30" } });
  } catch {
    return NextResponse.json({ error: "Failed to calculate comparison" }, { status: 500 });
  }
}
