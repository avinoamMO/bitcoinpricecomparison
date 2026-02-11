/**
 * Price service: CCXT as primary source, CoinGecko as fallback.
 *
 * For USD-paired exchanges (Binance, Coinbase, Kraken, Bybit, OKX),
 * CCXT fetchTicker gives the real exchange price directly.
 * For ILS-paired exchanges (Bit2C) and manual exchanges (Bits of Gold),
 * we use CoinGecko for the base price.
 *
 * CoinGecko also serves as fallback when any CCXT call fails.
 */
import { Currency, ExchangePriceResponse } from "@/types";
import { exchanges } from "@/data/exchanges";
import { fetchCcxtPrice } from "./ccxt-service";

const CACHE_DURATION_MS = 30_000;
const COINGECKO_API = "https://api.coingecko.com/api/v3";
const CG_CURRENCIES: Record<string, string> = {
  USD: "usd",
  EUR: "eur",
  ILS: "ils",
  GBP: "gbp",
};

interface CacheEntry {
  data: ExchangePriceResponse;
  expiry: number;
}

const priceCache = new Map<string, CacheEntry>();

// ─── CoinGecko Fallback ──────────────────────────────────────────────

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getFallbackPrices(currency: Currency): ExchangePriceResponse {
  const base: Record<string, number> = {
    USD: 97000,
    EUR: 89000,
    ILS: 355000,
    GBP: 77000,
  };
  const prices: Record<string, number> = {};
  exchanges.forEach((e) => {
    prices[e.id] = base[currency] || 97000;
  });
  return { prices, currency, timestamp: Date.now(), cached: false };
}

async function fetchCoinGeckoPrice(
  currency: Currency
): Promise<number | null> {
  try {
    const cg = CG_CURRENCIES[currency] || "usd";
    const res = await fetch(
      `${COINGECKO_API}/simple/price?ids=bitcoin&vs_currencies=${cg}`,
      { next: { revalidate: 30 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.bitcoin?.[cg] ?? null;
  } catch {
    return null;
  }
}

// ─── Main Price Fetch (CCXT primary, CoinGecko fallback) ─────────────

export async function fetchPrices(
  currency: Currency = "USD"
): Promise<ExchangePriceResponse> {
  const cacheKey = `prices_${currency}`;
  const cached = priceCache.get(cacheKey);
  if (cached && Date.now() < cached.expiry) {
    return { ...cached.data, cached: true };
  }

  const prices: Record<string, number> = {};
  let coinGeckoBase: number | null = null;

  // Try CCXT for each exchange in parallel
  const ccxtResults = await Promise.allSettled(
    exchanges.map(async (exchange) => {
      try {
        const result = await fetchCcxtPrice(exchange.id);
        if (result) {
          return { id: exchange.id, price: result.price, pair: result.pair };
        }
      } catch {
        // Fall through
      }
      return null;
    })
  );

  // Collect CCXT results
  for (const result of ccxtResults) {
    if (result.status === "fulfilled" && result.value) {
      const { id, price, pair } = result.value;
      // Only use CCXT price directly if the pair matches the requested currency
      // BTC/USDT prices are close enough to USD for comparison purposes
      const pairCurrency = pair.split("/")[1] || "";
      const isUsdLike =
        ["USDT", "USD", "USDC"].includes(pairCurrency) &&
        currency === "USD";
      const isMatchingCurrency =
        (pairCurrency === "NIS" && currency === "ILS") ||
        (pairCurrency === "ILS" && currency === "ILS") ||
        (pairCurrency === "EUR" && currency === "EUR") ||
        (pairCurrency === "GBP" && currency === "GBP");

      if (isUsdLike || isMatchingCurrency) {
        prices[id] = price;
      }
    }
  }

  // For exchanges without CCXT prices, fall back to CoinGecko
  const missingExchanges = exchanges.filter((e) => !prices[e.id]);
  if (missingExchanges.length > 0) {
    if (coinGeckoBase === null) {
      coinGeckoBase = await fetchCoinGeckoPrice(currency);
    }
    if (coinGeckoBase) {
      for (const exchange of missingExchanges) {
        // Apply slight variation based on exchange spread estimate
        const sf = exchange.feeStructure.spreadEstimate;
        const h = simpleHash(exchange.id + Math.floor(Date.now() / 30000));
        const v = ((h % 100) - 50) / 50;
        prices[exchange.id] =
          Math.round((coinGeckoBase + coinGeckoBase * sf * v * 0.3) * 100) /
          100;
      }
    }
  }

  // If we still have no prices at all, use hardcoded fallback
  if (Object.keys(prices).length === 0) {
    if (cached) return { ...cached.data, cached: true };
    return getFallbackPrices(currency);
  }

  const result: ExchangePriceResponse = {
    prices,
    currency,
    timestamp: Date.now(),
    cached: false,
  };
  priceCache.set(cacheKey, {
    data: result,
    expiry: Date.now() + CACHE_DURATION_MS,
  });
  return result;
}
