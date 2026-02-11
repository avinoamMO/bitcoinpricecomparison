import ccxt, { Exchange } from 'ccxt';
import { ExchangeData, ExchangeFees, OrderBookData, FeeTier } from './types';
import { exchangeCache, PRICE_TTL_MS, FEE_TTL_MS, ORDERBOOK_TTL_MS } from './exchange-cache';

interface ExchangeConfig {
  id: string; name: string; country: string; israeliExchange: boolean;
  tradingPair: string; fallbackPairs: string[]; feePageUrl: string;
  manualFees?: Partial<ExchangeFees>; manualFeeTiers?: FeeTier[]; manualOnly?: boolean;
}

const EXCHANGE_CONFIGS: ExchangeConfig[] = [
  { id: 'binance', name: 'Binance', country: 'Global (Cayman Islands)', israeliExchange: false, tradingPair: 'BTC/USDT', fallbackPairs: ['BTC/USDC'], feePageUrl: 'https://www.binance.com/en/fee/schedule',
    manualFeeTiers: [
      { tierLabel: 'Regular (< $1M)', minVolume: 0, maxVolume: 1000000, takerFee: 0.1, makerFee: 0.1 },
      { tierLabel: 'VIP 1 ($1M-$5M)', minVolume: 1000000, maxVolume: 5000000, takerFee: 0.09, makerFee: 0.08 },
      { tierLabel: 'VIP 2 ($5M-$10M)', minVolume: 5000000, maxVolume: 10000000, takerFee: 0.08, makerFee: 0.06 },
    ],
    manualFees: { fiatDepositFee: 'Free (bank transfer); 1-2% (card)', fiatWithdrawalFee: 'Free (bank transfer)' },
  },
  { id: 'coinbase', name: 'Coinbase Advanced', country: 'United States', israeliExchange: false, tradingPair: 'BTC/USDT', fallbackPairs: ['BTC/USD', 'BTC/USDC'], feePageUrl: 'https://www.coinbase.com/advanced-fees',
    manualFeeTiers: [
      { tierLabel: 'Level 1 (< $10K)', minVolume: 0, maxVolume: 10000, takerFee: 0.6, makerFee: 0.4 },
      { tierLabel: 'Level 2 ($10K-$50K)', minVolume: 10000, maxVolume: 50000, takerFee: 0.4, makerFee: 0.25 },
      { tierLabel: 'Level 3 ($50K-$100K)', minVolume: 50000, maxVolume: 100000, takerFee: 0.25, makerFee: 0.15 },
    ],
    manualFees: { fiatDepositFee: 'Free (ACH); $10 (wire)', fiatWithdrawalFee: 'Free (ACH); $25 (wire)' },
  },
  { id: 'kraken', name: 'Kraken', country: 'United States', israeliExchange: false, tradingPair: 'BTC/USDT', fallbackPairs: ['BTC/USD'], feePageUrl: 'https://www.kraken.com/features/fee-schedule',
    manualFeeTiers: [
      { tierLabel: 'Starter (< $50K)', minVolume: 0, maxVolume: 50000, takerFee: 0.26, makerFee: 0.16 },
      { tierLabel: 'Intermediate ($50K-$100K)', minVolume: 50000, maxVolume: 100000, takerFee: 0.24, makerFee: 0.14 },
      { tierLabel: 'Pro ($100K-$250K)', minVolume: 100000, maxVolume: 250000, takerFee: 0.22, makerFee: 0.12 },
    ],
    manualFees: { fiatDepositFee: 'Free (bank transfer)', fiatWithdrawalFee: '$5 (domestic wire); $35 (SWIFT)' },
  },
  { id: 'bybit', name: 'Bybit', country: 'Dubai (UAE)', israeliExchange: false, tradingPair: 'BTC/USDT', fallbackPairs: ['BTC/USDC'], feePageUrl: 'https://www.bybit.com/en/help-center/article/Fee-Structure',
    manualFeeTiers: [
      { tierLabel: 'Regular (< $1M)', minVolume: 0, maxVolume: 1000000, takerFee: 0.1, makerFee: 0.1 },
      { tierLabel: 'VIP 1 ($1M-$2.5M)', minVolume: 1000000, maxVolume: 2500000, takerFee: 0.06, makerFee: 0.04 },
    ],
    manualFees: { fiatDepositFee: 'Free (bank transfer); 1-3.5% (card)', fiatWithdrawalFee: 'Varies by currency' },
  },
  { id: 'okx', name: 'OKX', country: 'Seychelles', israeliExchange: false, tradingPair: 'BTC/USDT', fallbackPairs: ['BTC/USDC'], feePageUrl: 'https://www.okx.com/fees',
    manualFeeTiers: [
      { tierLabel: 'Level 1 (< $5M)', minVolume: 0, maxVolume: 5000000, takerFee: 0.1, makerFee: 0.08 },
      { tierLabel: 'Level 2 ($5M-$10M)', minVolume: 5000000, maxVolume: 10000000, takerFee: 0.09, makerFee: 0.06 },
    ],
    manualFees: { fiatDepositFee: 'Free (bank transfer); 1-3.5% (card)', fiatWithdrawalFee: 'Varies by currency' },
  },
  { id: 'bit2c', name: 'Bit2C', country: 'Israel', israeliExchange: true, tradingPair: 'BTC/ILS', fallbackPairs: [], feePageUrl: 'https://www.bit2c.co.il/home/Fees',
    manualFeeTiers: [
      { tierLabel: 'Tier 1 (< 50K ILS)', minVolume: 0, maxVolume: 50000, takerFee: 0.5, makerFee: 0.5 },
      { tierLabel: 'Tier 2 (50K-200K ILS)', minVolume: 50000, maxVolume: 200000, takerFee: 0.45, makerFee: 0.45 },
      { tierLabel: 'Tier 3 (200K-600K ILS)', minVolume: 200000, maxVolume: 600000, takerFee: 0.4, makerFee: 0.4 },
      { tierLabel: 'Tier 4 (600K+ ILS)', minVolume: 600000, maxVolume: Infinity, takerFee: 0.25, makerFee: 0.25 },
    ],
    manualFees: { fiatDepositFee: 'Free (bank transfer)', fiatWithdrawalFee: 'Free (bank transfer)', withdrawalFeeBTC: 0.0001 },
  },
  { id: 'bitsofgold', name: 'Bits of Gold', country: 'Israel', israeliExchange: true, tradingPair: 'BTC/ILS', fallbackPairs: [], feePageUrl: 'https://www.bitsofgold.co.il/fees', manualOnly: true,
    manualFeeTiers: [{ tierLabel: 'Standard', minVolume: 0, maxVolume: Infinity, takerFee: 0.5, makerFee: 0.5 }],
    manualFees: { takerFee: 0.5, makerFee: 0.5, withdrawalFeeBTC: 0.0005, fiatDepositFee: 'Bank transfer: free; Credit card: 2.5%', fiatWithdrawalFee: 'Bank transfer: free' },
  },
];

const exchangeInstances = new Map<string, Exchange>();

function getExchangeInstance(id: string): Exchange | null {
  if (id === 'bitsofgold') return null;
  if (exchangeInstances.has(id)) return exchangeInstances.get(id)!;
  try {
    const ExchangeClass = (ccxt as Record<string, unknown>)[id] as new (config: Record<string, unknown>) => Exchange;
    if (!ExchangeClass) return null;
    const instance = new ExchangeClass({ enableRateLimit: true, timeout: 10000 });
    exchangeInstances.set(id, instance);
    return instance;
  } catch { console.error('Failed to create CCXT instance for ' + id); return null; }
}

async function fetchTickerPrice(exchange: Exchange, config: ExchangeConfig): Promise<{ price: number; pair: string } | null> {
  const cacheKey = 'price:' + config.id;
  const cached = exchangeCache.get<{ price: number; pair: string }>(cacheKey, PRICE_TTL_MS);
  if (cached) return cached;
  const pairs = [config.tradingPair, ...config.fallbackPairs];
  for (const pair of pairs) {
    try { const ticker = await exchange.fetchTicker(pair); if (ticker.last != null) { const result = { price: ticker.last, pair }; exchangeCache.set(cacheKey, result); return result; } } catch { /* next */ }
  }
  return null;
}

async function fetchOrderBookData(exchange: Exchange, config: ExchangeConfig, activePair: string): Promise<OrderBookData | null> {
  const cacheKey = 'orderbook:' + config.id;
  const cached = exchangeCache.get<OrderBookData>(cacheKey, ORDERBOOK_TTL_MS);
  if (cached) return cached;
  try {
    const ob = await exchange.fetchOrderBook(activePair, 10);
    if (!ob.bids.length || !ob.asks.length) return null;
    const topBid = ob.bids[0]; const topAsk = ob.asks[0];
    if (!topBid || !topAsk) return null;
    const bestBid = topBid[0] as number; const bestAsk = topAsk[0] as number;
    const midPrice = (bestBid + bestAsk) / 2;
    const spreadUSD = bestAsk - bestBid;
    const spreadPercent = midPrice > 0 ? (spreadUSD / midPrice) * 100 : 0;
    const bidDepth = ob.bids.reduce((sum, level) => sum + (level[1] ?? 0), 0);
    const askDepth = ob.asks.reduce((sum, level) => sum + (level[1] ?? 0), 0);
    const result: OrderBookData = { bestBid, bestAsk, spreadUSD: Math.round(spreadUSD * 100) / 100, spreadPercent: Math.round(spreadPercent * 10000) / 10000, bidDepth: Math.round(bidDepth * 10000) / 10000, askDepth: Math.round(askDepth * 10000) / 10000 };
    exchangeCache.set(cacheKey, result);
    return result;
  } catch { return null; }
}

function extractFees(exchange: Exchange | null, config: ExchangeConfig): ExchangeFees {
  const cacheKey = 'fees:' + config.id;
  const cached = exchangeCache.get<ExchangeFees>(cacheKey, FEE_TTL_MS);
  if (cached) return cached;
  let takerFee = config.manualFees?.takerFee ?? 0.1;
  let makerFee = config.manualFees?.makerFee ?? 0.1;
  let withdrawalFeeBTC = config.manualFees?.withdrawalFeeBTC ?? null;
  if (exchange) {
    try {
      if (exchange.fees) {
        const tf = (exchange.fees as Record<string, unknown>).trading as Record<string, unknown> | undefined;
        if (tf) { if (typeof tf.taker === 'number') takerFee = tf.taker * 100; if (typeof tf.maker === 'number') makerFee = tf.maker * 100; }
      }
      if (exchange.currencies?.['BTC']?.fee != null) withdrawalFeeBTC = exchange.currencies['BTC'].fee as number;
    } catch { /* use manual */ }
  }
  if (config.manualFees?.takerFee != null) takerFee = config.manualFees.takerFee;
  if (config.manualFees?.makerFee != null) makerFee = config.manualFees.makerFee;
  if (config.manualFees?.withdrawalFeeBTC != null) withdrawalFeeBTC = config.manualFees.withdrawalFeeBTC;
  const fees: ExchangeFees = { takerFee, makerFee, withdrawalFeeBTC, fiatDepositFee: config.manualFees?.fiatDepositFee ?? 'Varies', fiatWithdrawalFee: config.manualFees?.fiatWithdrawalFee ?? 'Varies', feeTiers: config.manualFeeTiers ?? [] };
  exchangeCache.set(cacheKey, fees);
  return fees;
}

function getBitsOfGoldData(): ExchangeData {
  return { id: 'bitsofgold', name: 'Bits of Gold', country: 'Israel', israeliExchange: true, price: null, tradingPair: 'BTC/ILS',
    fees: { takerFee: 0.5, makerFee: 0.5, withdrawalFeeBTC: 0.0005, fiatDepositFee: 'Bank transfer: free; Credit card: 2.5%', fiatWithdrawalFee: 'Bank transfer: free', feeTiers: [{ tierLabel: 'Standard', minVolume: 0, maxVolume: Infinity, takerFee: 0.5, makerFee: 0.5 }] },
    orderBook: null, feePageUrl: 'https://www.bitsofgold.co.il/fees', fetchedAt: new Date().toISOString(), status: 'ok' };
}

export async function fetchAllExchangeData(): Promise<ExchangeData[]> {
  const results = await Promise.allSettled(
    EXCHANGE_CONFIGS.map(async (config): Promise<ExchangeData> => {
      if (config.manualOnly) return getBitsOfGoldData();
      const exchange = getExchangeInstance(config.id);
      if (!exchange) return { id: config.id, name: config.name, country: config.country, israeliExchange: config.israeliExchange, price: null, tradingPair: config.tradingPair, fees: extractFees(null, config), orderBook: null, feePageUrl: config.feePageUrl, fetchedAt: new Date().toISOString(), status: 'error', error: 'Exchange not available in CCXT' };
      try {
        const mk = 'markets:' + config.id;
        if (!exchangeCache.get(mk, FEE_TTL_MS)) { await exchange.loadMarkets(); exchangeCache.set(mk, true); }
        const tickerResult = await fetchTickerPrice(exchange, config);
        const activePair = tickerResult?.pair ?? config.tradingPair;
        const orderBookResult = await fetchOrderBookData(exchange, config, activePair);
        const fees = extractFees(exchange, config);
        return { id: config.id, name: config.name, country: config.country, israeliExchange: config.israeliExchange, price: tickerResult?.price ?? null, tradingPair: activePair, fees, orderBook: orderBookResult, feePageUrl: config.feePageUrl, fetchedAt: new Date().toISOString(), status: tickerResult ? 'ok' : 'error', error: tickerResult ? undefined : 'Failed to fetch price' };
      } catch (err) {
        return { id: config.id, name: config.name, country: config.country, israeliExchange: config.israeliExchange, price: null, tradingPair: config.tradingPair, fees: extractFees(null, config), orderBook: null, feePageUrl: config.feePageUrl, fetchedAt: new Date().toISOString(), status: 'error', error: err instanceof Error ? err.message : 'Unknown error' };
      }
    })
  );
  return results.map((r) => r.status === 'fulfilled' ? r.value : { id: 'unknown', name: 'Unknown', country: 'Unknown', israeliExchange: false, price: null, tradingPair: 'BTC/USDT', fees: { takerFee: 0, makerFee: 0, withdrawalFeeBTC: null, fiatDepositFee: 'Unknown', fiatWithdrawalFee: 'Unknown', feeTiers: [] }, orderBook: null, feePageUrl: '', fetchedAt: new Date().toISOString(), status: 'error' as const, error: 'Promise rejected' });
}
export { EXCHANGE_CONFIGS };
