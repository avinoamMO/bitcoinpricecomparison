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
