/**
 * CCXT-powered exchange data service.
 *
 * Dynamically discovers ALL CCXT exchanges that support BTC trading.
 * Featured exchanges (Binance, Coinbase, Kraken, Bybit, OKX, Bit2C, Bits of Gold)
 * retain their affiliate links and detailed metadata.
 *
 * Features:
 * - Dynamic discovery of 100+ exchanges from CCXT
 * - Batched fetching (10 exchanges at a time) with rate limiting
 * - Exchange health monitoring (auto-hides after 3 consecutive failures)
 * - Aggressive caching (prices: 30s, fees: 1hr, discovery: 1hr)
 * - Region-based categorization
 */
import ccxt, { type Exchange } from "ccxt";
import {
  CcxtExchangeData,
  CcxtFeeData,
  OrderBookData,
  CryptoAsset,
} from "@/types";
import {
  exchangeCache,
  PRICE_TTL_MS,
  FEE_TTL_MS,
  ORDERBOOK_TTL_MS,
} from "./exchange-cache";
import {
  FEATURED_EXCHANGES,
  getFeaturedConfig,
  isFeaturedExchange,
  EXCHANGE_BLOCKLIST,
  detectRegion,
  formatCountry,
  isDex as isDexExchange,
  getAssetPairs,
  type FeaturedExchangeConfig,
} from "./exchange-registry";
import { exchangeHealth } from "./exchange-health";

// ─── Constants ──────────────────────────────────────────────────────

const BATCH_SIZE = 10;
const BATCH_DELAY_MS = 200; // ms between batches
const EXCHANGE_TIMEOUT_MS = 10000;
const DISCOVERY_TTL_MS = 60 * 60 * 1000; // 1 hour

// ─── Dynamic Exchange Discovery ─────────────────────────────────────

interface DiscoveredExchange {
  id: string;
  name: string;
  countries: string[];
  hasFetchTicker: boolean;
}

/**
 * Discovers all CCXT exchanges that potentially support BTC trading.
 * Results are cached for 1 hour.
 */
function discoverExchanges(): DiscoveredExchange[] {
  const cacheKey = "ccxt:discovery";
  const cached = exchangeCache.get<DiscoveredExchange[]>(cacheKey, DISCOVERY_TTL_MS);
  if (cached) return cached;

  const discovered: DiscoveredExchange[] = [];

  for (const exchangeId of ccxt.exchanges) {
    if (EXCHANGE_BLOCKLIST.has(exchangeId)) continue;

    try {
      const ExchangeClass = (ccxt as Record<string, unknown>)[exchangeId] as
        | (new (config: Record<string, unknown>) => Exchange)
        | undefined;
      if (!ExchangeClass) continue;

      // Create a temporary instance to check capabilities
      const temp = new ExchangeClass({ enableRateLimit: true });

      // Check if fetchTicker is available (public endpoint, no API key needed)
      const hasFetchTicker = typeof temp.fetchTicker === "function" && temp.has?.fetchTicker !== false;
      if (!hasFetchTicker) continue;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tempAny = temp as any;
      discovered.push({
        id: exchangeId,
        name: tempAny.name as string || exchangeId,
        countries: Array.isArray(tempAny.countries)
          ? tempAny.countries as string[]
          : [],
        hasFetchTicker,
      });
    } catch {
      // Skip exchanges that fail to instantiate
    }
  }

  exchangeCache.set(cacheKey, discovered);
  return discovered;
}

// ─── CCXT Instance Management ────────────────────────────────────────

const exchangeInstances = new Map<string, Exchange>();

function getExchangeInstance(id: string): Exchange | null {
  if (exchangeInstances.has(id)) {
    return exchangeInstances.get(id)!;
  }

  try {
    const ExchangeClass = (ccxt as Record<string, unknown>)[id] as
      | (new (config: Record<string, unknown>) => Exchange)
      | undefined;
    if (!ExchangeClass) return null;

    const instance = new ExchangeClass({
      enableRateLimit: true,
      timeout: EXCHANGE_TIMEOUT_MS,
    });
    exchangeInstances.set(id, instance);
    return instance;
  } catch {
    return null;
  }
}

// ─── Price Fetching ──────────────────────────────────────────────────

async function fetchTickerPrice(
  exchange: Exchange,
  exchangeId: string,
  asset: CryptoAsset = "BTC",
  preferredPair?: string,
  fallbackPairs?: string[]
): Promise<{ price: number; pair: string } | null> {
  const cacheKey = `ccxt:price:${asset}:${exchangeId}`;
  const cached = exchangeCache.get<{ price: number; pair: string }>(cacheKey, PRICE_TTL_MS);
  if (cached) return cached;

  // Build pairs list: preferred first, then fallbacks, then asset defaults
  const pairs: string[] = [];
  if (preferredPair) pairs.push(preferredPair);
  if (fallbackPairs) pairs.push(...fallbackPairs);
  // Add common pairs for the asset as last resort for dynamically discovered exchanges
  for (const p of getAssetPairs(asset)) {
    if (!pairs.includes(p)) pairs.push(p);
  }

  for (const pair of pairs) {
    try {
      const ticker = await exchange.fetchTicker(pair);
      if (ticker.last != null && ticker.last > 0) {
        const result = { price: ticker.last, pair };
        exchangeCache.set(cacheKey, result);
        return result;
      }
    } catch {
      // Try next pair
    }
  }
  return null;
}

// ─── Order Book Fetching ─────────────────────────────────────────────

async function fetchOrderBookData(
  exchange: Exchange,
  exchangeId: string,
  activePair: string,
  asset: CryptoAsset = "BTC"
): Promise<OrderBookData | null> {
  const cacheKey = `ccxt:orderbook:${asset}:${exchangeId}`;
  const cached = exchangeCache.get<OrderBookData>(cacheKey, ORDERBOOK_TTL_MS);
  if (cached) return cached;

  try {
    if (!exchange.has?.fetchOrderBook) return null;

    // Fetch 100 levels for market order simulation depth
    const ob = await exchange.fetchOrderBook(activePair, 100);
    if (!ob.bids.length || !ob.asks.length) return null;

    const topBid = ob.bids[0];
    const topAsk = ob.asks[0];
    if (!topBid || !topAsk) return null;

    const bestBid = topBid[0] as number;
    const bestAsk = topAsk[0] as number;
    const midPrice = (bestBid + bestAsk) / 2;
    const spreadUSD = bestAsk - bestBid;
    const spreadPercent = midPrice > 0 ? (spreadUSD / midPrice) * 100 : 0;

    const bidDepth = ob.bids.reduce((sum, level) => sum + (level[1] ?? 0), 0);
    const askDepth = ob.asks.reduce((sum, level) => sum + (level[1] ?? 0), 0);

    // Store raw levels for market order simulation
    const rawAsks: [number, number][] = ob.asks.map((level) => [
      level[0] as number,
      level[1] as number,
    ]);
    const rawBids: [number, number][] = ob.bids.map((level) => [
      level[0] as number,
      level[1] as number,
    ]);

    const result: OrderBookData = {
      bestBid,
      bestAsk,
      spreadUSD: Math.round(spreadUSD * 100) / 100,
      spreadPercent: Math.round(spreadPercent * 10000) / 10000,
      bidDepth: Math.round(bidDepth * 10000) / 10000,
      askDepth: Math.round(askDepth * 10000) / 10000,
      rawAsks,
      rawBids,
    };
    exchangeCache.set(cacheKey, result);
    return result;
  } catch {
    return null;
  }
}

// ─── Fee Extraction ──────────────────────────────────────────────────

function extractFees(
  exchange: Exchange | null,
  asset: CryptoAsset = "BTC",
  featuredConfig?: FeaturedExchangeConfig
): CcxtFeeData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const exchangeId = featuredConfig?.id || (exchange as any)?.id as string || "unknown";
  const cacheKey = `ccxt:fees:${asset}:${exchangeId}`;
  const cached = exchangeCache.get<CcxtFeeData>(cacheKey, FEE_TTL_MS);
  if (cached) return cached;

  // Start with defaults
  let takerFee = featuredConfig?.manualFees?.takerFee ?? 0.1;
  let makerFee = featuredConfig?.manualFees?.makerFee ?? 0.1;
  let withdrawalFee = featuredConfig?.manualFees?.withdrawalFee ?? null;

  // Try to get fees from CCXT exchange.fees object
  if (exchange) {
    try {
      if (exchange.fees) {
        const tradingFees = (exchange.fees as Record<string, unknown>)
          .trading as Record<string, unknown> | undefined;
        if (tradingFees) {
          if (typeof tradingFees.taker === "number") {
            takerFee = tradingFees.taker * 100;
          }
          if (typeof tradingFees.maker === "number") {
            makerFee = tradingFees.maker * 100;
          }
        }
      }
      // Use the selected asset for withdrawal fee extraction
      if (exchange.currencies?.[asset]?.fee != null) {
        withdrawalFee = exchange.currencies[asset].fee as number;
      }
    } catch {
      // Fall through to defaults
    }
  }

  // Manual overrides take precedence for featured exchanges (only for BTC)
  if (featuredConfig?.manualFees?.takerFee != null) takerFee = featuredConfig.manualFees.takerFee;
  if (featuredConfig?.manualFees?.makerFee != null) makerFee = featuredConfig.manualFees.makerFee;
  if (asset === "BTC" && featuredConfig?.manualFees?.withdrawalFee != null) {
    withdrawalFee = featuredConfig.manualFees.withdrawalFee;
  }

  const fees: CcxtFeeData = {
    takerFee,
    makerFee,
    withdrawalFee,
    fiatDepositFee: featuredConfig?.manualFees?.fiatDepositFee ?? "Varies",
    fiatWithdrawalFee: featuredConfig?.manualFees?.fiatWithdrawalFee ?? "Varies",
    feeTiers: featuredConfig?.manualFeeTiers ?? [],
  };

  exchangeCache.set(cacheKey, fees);
  return fees;
}

// ─── Single Exchange Fetch ──────────────────────────────────────────

async function fetchExchangeData(
  discovered: DiscoveredExchange,
  asset: CryptoAsset = "BTC"
): Promise<CcxtExchangeData> {
  const featuredConfig = getFeaturedConfig(discovered.id);
  const isFeatured = !!featuredConfig;

  // Skip featured exchanges that don't support this asset
  if (featuredConfig && !featuredConfig.supportedAssets.includes(asset)) {
    return buildErrorResult(discovered, featuredConfig, `${asset} not supported`, asset);
  }

  // Manual-only exchanges (e.g., Bits of Gold) — only for BTC
  if (featuredConfig?.manualOnly) {
    if (asset !== "BTC") {
      return buildErrorResult(discovered, featuredConfig, `${asset} not supported`, asset);
    }
    return getBitsOfGoldData();
  }

  const exchange = getExchangeInstance(discovered.id);
  if (!exchange) {
    exchangeHealth.recordFailure(discovered.id, "Could not create CCXT instance");
    return buildErrorResult(discovered, featuredConfig, "Exchange not available in CCXT", asset);
  }

  try {
    // Load markets (cached for 1hr)
    const marketsKey = `ccxt:markets:${discovered.id}`;
    if (!exchangeCache.get(marketsKey, FEE_TTL_MS)) {
      await exchange.loadMarkets();
      exchangeCache.set(marketsKey, true);
    }

    // For featured exchanges with non-BTC asset, derive the pair from the asset
    let preferredPair = featuredConfig?.tradingPair;
    let fallbackPairs = featuredConfig?.fallbackPairs;
    if (asset !== "BTC" && featuredConfig) {
      // Replace BTC with the selected asset in the configured pairs
      const baseCurrency = featuredConfig.tradingPair.split("/")[1];
      preferredPair = `${asset}/${baseCurrency}`;
      fallbackPairs = featuredConfig.fallbackPairs.map(
        (p) => `${asset}/${p.split("/")[1]}`
      );
    }

    // Fetch ticker price
    const tickerResult = await fetchTickerPrice(
      exchange,
      discovered.id,
      asset,
      preferredPair,
      fallbackPairs
    );

    if (!tickerResult) {
      exchangeHealth.recordFailure(discovered.id, `No ${asset} pair found or price unavailable`);
      return buildErrorResult(discovered, featuredConfig, `No ${asset} trading pair found`, asset);
    }

    const activePair = tickerResult.pair;

    // Fetch order book (best effort, don't fail if unavailable)
    const orderBookResult = await fetchOrderBookData(exchange, discovered.id, activePair, asset);

    // Extract fees
    const fees = extractFees(exchange, asset, featuredConfig);

    exchangeHealth.recordSuccess(discovered.id);

    return {
      id: discovered.id,
      name: featuredConfig?.name ?? discovered.name,
      country: featuredConfig?.country ?? formatCountry(discovered.countries),
      countries: discovered.countries,
      region: featuredConfig?.region ?? detectRegion(discovered.countries),
      israeliExchange: featuredConfig?.israeliExchange ?? false,
      featured: isFeatured,
      price: tickerResult.price,
      tradingPair: activePair,
      assetSymbol: asset,
      isDex: isDexExchange(discovered.id),
      fees,
      orderBook: orderBookResult,
      simulation: null,
      feePageUrl: featuredConfig?.feePageUrl ?? "",
      websiteUrl: featuredConfig?.websiteUrl ?? `https://${discovered.id}.com`,
      affiliateUrl: featuredConfig?.affiliateUrl,
      logoUrl: featuredConfig?.logoUrl,
      fetchedAt: new Date().toISOString(),
      status: "ok",
      healthStatus: exchangeHealth.getHealthStatus(discovered.id),
      consecutiveFailures: 0,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    exchangeHealth.recordFailure(discovered.id, errorMsg);
    return buildErrorResult(discovered, featuredConfig, errorMsg, asset);
  }
}

function buildErrorResult(
  discovered: DiscoveredExchange,
  featuredConfig: FeaturedExchangeConfig | undefined,
  error: string,
  asset: CryptoAsset = "BTC"
): CcxtExchangeData {
  return {
    id: discovered.id,
    name: featuredConfig?.name ?? discovered.name,
    country: featuredConfig?.country ?? formatCountry(discovered.countries),
    countries: discovered.countries,
    region: featuredConfig?.region ?? detectRegion(discovered.countries),
    israeliExchange: featuredConfig?.israeliExchange ?? false,
    featured: !!featuredConfig,
    price: null,
    tradingPair: featuredConfig?.tradingPair ?? `${asset}/USDT`,
    assetSymbol: asset,
    isDex: isDexExchange(discovered.id),
    fees: extractFees(null, asset, featuredConfig),
    orderBook: null,
    simulation: null,
    feePageUrl: featuredConfig?.feePageUrl ?? "",
    websiteUrl: featuredConfig?.websiteUrl ?? `https://${discovered.id}.com`,
    affiliateUrl: featuredConfig?.affiliateUrl,
    logoUrl: featuredConfig?.logoUrl,
    fetchedAt: new Date().toISOString(),
    status: "error",
    healthStatus: exchangeHealth.getHealthStatus(discovered.id),
    consecutiveFailures: exchangeHealth.getConsecutiveFailures(discovered.id),
    error,
  };
}

// ─── Bits of Gold (Manual Only) ──────────────────────────────────────

function getBitsOfGoldData(): CcxtExchangeData {
  const config = getFeaturedConfig("bitsofgold")!;
  return {
    id: "bitsofgold",
    name: "Bits of Gold",
    country: "Israel",
    countries: ["IL"],
    region: "Israel",
    israeliExchange: true,
    featured: true,
    price: null,
    tradingPair: "BTC/ILS",
    assetSymbol: "BTC",
    isDex: false,
    fees: {
      takerFee: 0.5,
      makerFee: 0.5,
      withdrawalFee: 0.0005,
      fiatDepositFee: "Bank transfer: free; Credit card: 2.5%",
      fiatWithdrawalFee: "Bank transfer: free",
      feeTiers: [
        { tierLabel: "Standard", minVolume: 0, maxVolume: Infinity, takerFee: 0.5, makerFee: 0.5 },
      ],
    },
    orderBook: null,
    simulation: null,
    feePageUrl: config.feePageUrl,
    websiteUrl: config.websiteUrl,
    affiliateUrl: config.affiliateUrl,
    logoUrl: config.logoUrl,
    fetchedAt: new Date().toISOString(),
    status: "ok",
    healthStatus: "healthy",
    consecutiveFailures: 0,
  };
}

// ─── Batched Fetching ───────────────────────────────────────────────

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetches exchange data in batches to avoid overwhelming APIs.
 * Featured exchanges are always fetched first.
 */
async function fetchBatched(
  exchanges: DiscoveredExchange[],
  asset: CryptoAsset = "BTC"
): Promise<CcxtExchangeData[]> {
  const results: CcxtExchangeData[] = [];

  // Sort: featured first, then alphabetically
  const sorted = [...exchanges].sort((a, b) => {
    const aFeatured = isFeaturedExchange(a.id);
    const bFeatured = isFeaturedExchange(b.id);
    if (aFeatured && !bFeatured) return -1;
    if (!aFeatured && bFeatured) return 1;
    return a.name.localeCompare(b.name);
  });

  // Process in batches
  for (let i = 0; i < sorted.length; i += BATCH_SIZE) {
    const batch = sorted.slice(i, i + BATCH_SIZE);

    const batchResults = await Promise.allSettled(
      batch.map((ex) => fetchExchangeData(ex, asset))
    );

    for (const result of batchResults) {
      if (result.status === "fulfilled") {
        results.push(result.value);
      }
      // Rejected promises are silently dropped (shouldn't happen since fetchExchangeData catches)
    }

    // Delay between batches (except for the last one)
    if (i + BATCH_SIZE < sorted.length) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  return results;
}

// ─── Main API: Fetch All Exchange Data ──────────────────────────────

/**
 * Main entry point: discovers all CCXT exchanges, filters to those with BTC pairs,
 * fetches prices in batches, and returns the combined data.
 *
 * Results are a mix of cached and fresh data depending on TTLs.
 */
export async function fetchAllCcxtData(asset: CryptoAsset = "BTC"): Promise<{
  exchanges: CcxtExchangeData[];
  totalDiscovered: number;
}> {
  // Check for a full cached result first (per asset)
  const fullCacheKey = `ccxt:allData:${asset}`;
  const fullCached = exchangeCache.get<{
    exchanges: CcxtExchangeData[];
    totalDiscovered: number;
  }>(fullCacheKey, PRICE_TTL_MS);
  if (fullCached) return fullCached;

  // Discover all available exchanges
  const discovered = discoverExchanges();

  // Filter out exchanges that have been down too long
  // (but always include featured exchanges even if degraded)
  const toFetch = discovered.filter(
    (ex) => isFeaturedExchange(ex.id) || !exchangeHealth.shouldHide(ex.id)
  );

  // Fetch all exchange data in batches
  const results = await fetchBatched(toFetch, asset);

  // Filter out exchanges that returned "not supported" errors for this asset
  const validResults = results.filter(
    (r) => !(r.status === "error" && r.error?.includes("not supported"))
  );

  // Sort: featured first, then by status (ok first), then alphabetically
  validResults.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    if (a.status === "ok" && b.status !== "ok") return -1;
    if (a.status !== "ok" && b.status === "ok") return 1;
    return a.name.localeCompare(b.name);
  });

  const output = { exchanges: validResults, totalDiscovered: discovered.length };
  exchangeCache.set(fullCacheKey, output);
  return output;
}

/**
 * Fetch CCXT price for a single exchange (used by price-service as primary source).
 * Returns the price in the exchange's native pair currency.
 */
export async function fetchCcxtPrice(
  exchangeId: string
): Promise<{ price: number; pair: string } | null> {
  const featuredConfig = getFeaturedConfig(exchangeId);
  if (featuredConfig?.manualOnly) return null;

  const exchange = getExchangeInstance(exchangeId);
  if (!exchange) return null;

  try {
    const marketsKey = `ccxt:markets:${exchangeId}`;
    if (!exchangeCache.get(marketsKey, FEE_TTL_MS)) {
      await exchange.loadMarkets();
      exchangeCache.set(marketsKey, true);
    }
    return await fetchTickerPrice(
      exchange,
      exchangeId,
      "BTC",
      featuredConfig?.tradingPair,
      featuredConfig?.fallbackPairs
    );
  } catch {
    return null;
  }
}

// ─── Exports for backward compatibility ──────────────────────────────

export { FEATURED_EXCHANGES as EXCHANGE_CONFIGS };
export type { FeaturedExchangeConfig as ExchangeConfig };
export { discoverExchanges };
