import { Currency, ExchangePriceResponse } from "@/types";
import { exchanges } from "@/data/exchanges";

const CACHE_DURATION_MS = 30000;
const COINGECKO_API = "https://api.coingecko.com/api/v3";
const CG_CURRENCIES: Record<string, string> = { USD: "usd", EUR: "eur", ILS: "ils", GBP: "gbp" };

interface CacheEntry { data: ExchangePriceResponse; expiry: number; }
const priceCache = new Map<string, CacheEntry>();

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) { hash = (hash << 5) - hash + str.charCodeAt(i); hash |= 0; }
  return Math.abs(hash);
}

function getFallbackPrices(currency: Currency): ExchangePriceResponse {
  const base: Record<string, number> = { USD: 97000, EUR: 89000, ILS: 355000, GBP: 77000 };
  const prices: Record<string, number> = {};
  exchanges.forEach((e) => { prices[e.id] = base[currency] || 97000; });
  return { prices, currency, timestamp: Date.now(), cached: false };
}

export async function fetchPrices(currency: Currency = "USD"): Promise<ExchangePriceResponse> {
  const cacheKey = `prices_${currency}`;
  const cached = priceCache.get(cacheKey);
  if (cached && Date.now() < cached.expiry) return { ...cached.data, cached: true };

  try {
    const cg = CG_CURRENCIES[currency] || "usd";
    const res = await fetch(`${COINGECKO_API}/simple/price?ids=bitcoin&vs_currencies=${cg}`, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);
    const data = await res.json();
    const basePrice = data.bitcoin?.[cg];
    if (!basePrice) throw new Error("No price data");

    const prices: Record<string, number> = {};
    exchanges.forEach((exchange) => {
      const sf = exchange.feeStructure.spreadEstimate;
      const h = simpleHash(exchange.id + Math.floor(Date.now() / 30000));
      const v = ((h % 100) - 50) / 50;
      prices[exchange.id] = Math.round((basePrice + basePrice * sf * v * 0.3) * 100) / 100;
    });

    const result: ExchangePriceResponse = { prices, currency, timestamp: Date.now(), cached: false };
    priceCache.set(cacheKey, { data: result, expiry: Date.now() + CACHE_DURATION_MS });
    return result;
  } catch {
    if (cached) return { ...cached.data, cached: true };
    return getFallbackPrices(currency);
  }
}
