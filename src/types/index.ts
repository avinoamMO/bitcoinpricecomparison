export type Currency = "USD" | "EUR" | "ILS" | "GBP";
export type DepositMethod = "bank_transfer" | "credit_card" | "crypto" | "wire";

// ─── Multi-Asset Support ─────────────────────────────────────────────

export type CryptoAsset = "BTC" | "ETH" | "DOGE";

export interface AssetConfig {
  symbol: string;
  name: string;
  pairs: string[];
  decimals: number;
}

export const ASSET_CONFIG: Record<CryptoAsset, AssetConfig> = {
  BTC: {
    symbol: "BTC",
    name: "Bitcoin",
    pairs: ["BTC/USDT", "BTC/USD", "BTC/USDC", "BTC/EUR", "BTC/BUSD", "BTC/NIS", "BTC/ILS"],
    decimals: 8,
  },
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    pairs: ["ETH/USDT", "ETH/USD", "ETH/USDC", "ETH/EUR", "ETH/BTC"],
    decimals: 6,
  },
  DOGE: {
    symbol: "DOGE",
    name: "Dogecoin",
    pairs: ["DOGE/USDT", "DOGE/USD", "DOGE/USDC", "DOGE/EUR", "DOGE/BTC"],
    decimals: 2,
  },
};

export interface FeeStructure {
  makerFee: number;
  takerFee: number;
  depositFees: Record<DepositMethod, number>;
  withdrawalFeeBtc: number;
  spreadEstimate: number;
}

export interface VolumeTier {
  minVolume: number;
  maxVolume: number | null;
  makerFee: number;
  takerFee: number;
}

export interface Exchange {
  id: string;
  name: string;
  slug: string;
  logo: string;
  url: string;
  affiliateUrl: string;
  description: string;
  founded: number;
  headquarters: string;
  supportedCurrencies: Currency[];
  paymentMethods: DepositMethod[];
  feeStructure: FeeStructure;
  volumeTiers: VolumeTier[];
  securityFeatures: string[];
  pros: string[];
  cons: string[];
  rating: number;
  isIsraeli?: boolean;
}

export interface ComparisonResult {
  exchangeId: string;
  exchangeName: string;
  exchangeLogo: string;
  affiliateUrl: string;
  btcPrice: number;
  tradingFeePercent: number;
  tradingFeeDollar: number;
  depositFeePercent: number;
  depositFeeDollar: number;
  withdrawalFeeBtc: number;
  withdrawalFeeDollar: number;
  spreadPercent: number;
  spreadDollar: number;
  totalCostDollar: number;
  totalCostPercent: number;
  netBtcReceived: number;
  roiVsBest: number;
  isBestDeal: boolean;
  rank: number;
}

export interface ComparisonRequest {
  amount: number;
  currency: Currency;
  depositMethod: DepositMethod;
  mode: "buy" | "sell";
}

export interface ComparisonResponse {
  results: ComparisonResult[];
  amount: number;
  currency: Currency;
  depositMethod: DepositMethod;
  timestamp: number;
}

export interface ExchangePriceResponse {
  prices: Record<string, number>;
  currency: Currency;
  timestamp: number;
  cached: boolean;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  content: string;
  publishedAt: string;
  updatedAt: string;
  readTime: number;
  keywords: string[];
}

// ─── CCXT Integration Types ──────────────────────────────────────────

export interface FeeTier {
  tierLabel: string;
  minVolume: number;
  maxVolume: number;
  takerFee: number;
  makerFee: number;
}

export interface CcxtFeeData {
  takerFee: number;             // percent, e.g. 0.1 means 0.1%
  makerFee: number;             // percent
  withdrawalFee: number | null; // withdrawal fee in the asset's unit
  fiatDepositFee: string;       // human-readable description
  fiatWithdrawalFee: string;    // human-readable description
  feeTiers: FeeTier[];
}

export interface OrderBookData {
  bestBid: number;
  bestAsk: number;
  spreadUSD: number;
  spreadPercent: number;
  bidDepth: number;             // total BTC in bid levels
  askDepth: number;             // total BTC in ask levels
  rawAsks: [number, number][];  // [price, quantity] pairs sorted by price ascending
  rawBids: [number, number][];  // [price, quantity] pairs sorted by price descending
}

export interface MarketSimulationResult {
  /** Total BTC that would be received after walking the order book */
  btcReceived: number;
  /** Weighted average fill price in USD per BTC */
  avgFillPrice: number;
  /** How much worse the avg fill is vs. the best ask (percentage) */
  slippagePercent: number;
  /** Total fiat spent (may be less than requested if book is exhausted) */
  totalSpent: number;
  /** Whether the order book had enough liquidity for the full amount */
  fullyFilled: boolean;
  /** How many order book levels were consumed */
  levelsConsumed: number;
  /** Amount left unfilled (0 if fully filled) */
  amountUnfilled: number;
}

export type ExchangeRegion = "Global" | "Americas" | "Europe" | "APAC" | "MENA" | "Africa" | "Israel" | "Other";

export type ExchangeHealthStatus = "healthy" | "degraded" | "down" | "unknown";

export interface CcxtExchangeData {
  id: string;
  name: string;
  country: string;
  countries: string[];
  region: ExchangeRegion;
  israeliExchange: boolean;
  featured: boolean;
  price: number | null;
  tradingPair: string;
  assetSymbol: string;
  isDex: boolean;
  fees: CcxtFeeData;
  orderBook: OrderBookData | null;
  simulation: MarketSimulationResult | null;
  feePageUrl: string;
  websiteUrl: string;
  affiliateUrl?: string;
  logoUrl?: string;
  fetchedAt: string;
  status: "ok" | "error";
  healthStatus: ExchangeHealthStatus;
  consecutiveFailures: number;
  error?: string;
}

export interface CcxtApiResponse {
  exchanges: CcxtExchangeData[];
  timestamp: string;
  totalDiscovered: number;
  totalResponsive: number;
  fetchProgress?: {
    completed: number;
    total: number;
  };
  cache: {
    pricesCachedAt: string | null;
    feesCachedAt: string | null;
    pricesTTL: number;
    feesTTL: number;
  };
}
