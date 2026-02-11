export type Currency = "USD" | "EUR" | "ILS" | "GBP";
export type DepositMethod = "bank_transfer" | "credit_card" | "crypto" | "wire";

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
  withdrawalFeeBTC: number | null;
  fiatDepositFee: string;       // human-readable description
  fiatWithdrawalFee: string;    // human-readable description
  feeTiers: FeeTier[];
}

export interface OrderBookData {
  bestBid: number;
  bestAsk: number;
  spreadUSD: number;
  spreadPercent: number;
  bidDepth: number;             // total BTC in top 10 bid levels
  askDepth: number;             // total BTC in top 10 ask levels
}

export type ExchangeRegion = "Global" | "Americas" | "Europe" | "Asia" | "Israel" | "Other";

export type ExchangeHealthStatus = "healthy" | "degraded" | "down" | "unknown";

export interface CcxtExchangeData {
  id: string;
  name: string;
  country: string;
  region: ExchangeRegion;
  israeliExchange: boolean;
  featured: boolean;
  price: number | null;
  tradingPair: string;
  fees: CcxtFeeData;
  orderBook: OrderBookData | null;
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
