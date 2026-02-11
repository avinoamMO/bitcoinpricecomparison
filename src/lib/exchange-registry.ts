/**
 * Exchange Registry
 *
 * Maintains metadata for featured exchanges (affiliate links, detailed info)
 * and maps exchange IDs to regions based on country codes.
 *
 * Featured exchanges are the original 7 with full metadata.
 * Dynamically discovered exchanges get region/country from provider metadata.
 */

import { ExchangeRegion, FeeTier, FeeData, CryptoAsset, ASSET_CONFIG, PlatformType, DepositMethodLabel } from "@/types";

// ─── Featured Exchange Config ───────────────────────────────────────

export interface FeaturedExchangeConfig {
  id: string;
  name: string;
  country: string;
  region: ExchangeRegion;
  israeliExchange: boolean;
  tradingPair: string;
  fallbackPairs: string[];
  supportedAssets: CryptoAsset[];
  platformType: PlatformType;
  depositMethods: DepositMethodLabel[];
  feePageUrl: string;
  websiteUrl: string;
  affiliateUrl: string;
  logoUrl: string;
  manualFees?: Partial<FeeData>;
  manualFeeTiers?: FeeTier[];
  /** If true, use manual data only (no live fetching) */
  manualOnly?: boolean;
}

export const FEATURED_EXCHANGES: FeaturedExchangeConfig[] = [
  {
    id: "binance",
    name: "Binance",
    country: "Global (Cayman Islands)",
    region: "Global",
    israeliExchange: false,
    tradingPair: "BTC/USDT",
    fallbackPairs: ["BTC/USDC"],
    supportedAssets: ["BTC", "ETH", "DOGE"],
    platformType: "exchange",
    depositMethods: ["Bank Transfer", "Credit Card", "Crypto", "P2P"],
    feePageUrl: "https://www.binance.com/en/fee/schedule",
    websiteUrl: "https://www.binance.com",
    affiliateUrl: "https://www.binance.com/en/register?ref=CRYPTOROI",
    logoUrl: "https://assets.coingecko.com/markets/images/52/small/binance.jpg",
    manualFeeTiers: [
      { tierLabel: "Regular (< $1M)", minVolume: 0, maxVolume: 1000000, takerFee: 0.1, makerFee: 0.1 },
      { tierLabel: "VIP 1 ($1M-$5M)", minVolume: 1000000, maxVolume: 5000000, takerFee: 0.09, makerFee: 0.08 },
      { tierLabel: "VIP 2 ($5M-$10M)", minVolume: 5000000, maxVolume: 10000000, takerFee: 0.08, makerFee: 0.06 },
    ],
    manualFees: {
      fiatDepositFee: "Free (bank transfer); 1-2% (card)",
      fiatWithdrawalFee: "Free (bank transfer)",
    },
  },
  {
    id: "coinbase",
    name: "Coinbase Advanced",
    country: "United States",
    region: "Americas",
    israeliExchange: false,
    tradingPair: "BTC/USDT",
    fallbackPairs: ["BTC/USD", "BTC/USDC"],
    supportedAssets: ["BTC", "ETH", "DOGE"],
    platformType: "broker",
    depositMethods: ["Bank Transfer", "Credit Card", "Debit Card", "PayPal", "Crypto"],
    feePageUrl: "https://www.coinbase.com/advanced-fees",
    websiteUrl: "https://www.coinbase.com",
    affiliateUrl: "https://www.coinbase.com/join/CRYPTOROI",
    logoUrl: "https://assets.coingecko.com/markets/images/23/small/Coinbase_Coin_Primary.png",
    manualFeeTiers: [
      { tierLabel: "Level 1 (< $10K)", minVolume: 0, maxVolume: 10000, takerFee: 0.6, makerFee: 0.4 },
      { tierLabel: "Level 2 ($10K-$50K)", minVolume: 10000, maxVolume: 50000, takerFee: 0.4, makerFee: 0.25 },
      { tierLabel: "Level 3 ($50K-$100K)", minVolume: 50000, maxVolume: 100000, takerFee: 0.25, makerFee: 0.15 },
    ],
    manualFees: {
      fiatDepositFee: "Free (ACH); $10 (wire)",
      fiatWithdrawalFee: "Free (ACH); $25 (wire)",
    },
  },
  {
    id: "kraken",
    name: "Kraken",
    country: "United States",
    region: "Americas",
    israeliExchange: false,
    tradingPair: "BTC/USDT",
    fallbackPairs: ["BTC/USD"],
    supportedAssets: ["BTC", "ETH", "DOGE"],
    platformType: "exchange",
    depositMethods: ["Bank Transfer (SEPA/Wire)", "Crypto"],
    feePageUrl: "https://www.kraken.com/features/fee-schedule",
    websiteUrl: "https://www.kraken.com",
    affiliateUrl: "https://www.kraken.com/sign-up?ref=CRYPTOROI",
    logoUrl: "https://assets.coingecko.com/markets/images/29/small/kraken.jpg",
    manualFeeTiers: [
      { tierLabel: "Starter (< $50K)", minVolume: 0, maxVolume: 50000, takerFee: 0.26, makerFee: 0.16 },
      { tierLabel: "Intermediate ($50K-$100K)", minVolume: 50000, maxVolume: 100000, takerFee: 0.24, makerFee: 0.14 },
      { tierLabel: "Pro ($100K-$250K)", minVolume: 100000, maxVolume: 250000, takerFee: 0.22, makerFee: 0.12 },
    ],
    manualFees: {
      fiatDepositFee: "Free (bank transfer)",
      fiatWithdrawalFee: "$5 (domestic wire); $35 (SWIFT)",
    },
  },
  {
    id: "bybit",
    name: "Bybit",
    country: "Dubai (UAE)",
    region: "MENA",
    israeliExchange: false,
    tradingPair: "BTC/USDT",
    fallbackPairs: ["BTC/USDC"],
    supportedAssets: ["BTC", "ETH", "DOGE"],
    platformType: "exchange",
    depositMethods: ["Credit Card", "P2P", "Crypto"],
    feePageUrl: "https://www.bybit.com/en/help-center/article/Fee-Structure",
    websiteUrl: "https://www.bybit.com",
    affiliateUrl: "https://www.bybit.com/register?affiliate_id=CRYPTOROI",
    logoUrl: "https://assets.coingecko.com/markets/images/698/small/bybit_spot.png",
    manualFeeTiers: [
      { tierLabel: "Regular (< $1M)", minVolume: 0, maxVolume: 1000000, takerFee: 0.1, makerFee: 0.1 },
      { tierLabel: "VIP 1 ($1M-$2.5M)", minVolume: 1000000, maxVolume: 2500000, takerFee: 0.06, makerFee: 0.04 },
    ],
    manualFees: {
      fiatDepositFee: "Free (bank transfer); 1-3.5% (card)",
      fiatWithdrawalFee: "Varies by currency",
    },
  },
  {
    id: "okx",
    name: "OKX",
    country: "Seychelles",
    region: "Global",
    israeliExchange: false,
    tradingPair: "BTC/USDT",
    fallbackPairs: ["BTC/USDC"],
    supportedAssets: ["BTC", "ETH", "DOGE"],
    platformType: "exchange",
    depositMethods: ["Bank Transfer", "Credit Card", "P2P", "Crypto"],
    feePageUrl: "https://www.okx.com/fees",
    websiteUrl: "https://www.okx.com",
    affiliateUrl: "https://www.okx.com/join/CRYPTOROI",
    logoUrl: "https://assets.coingecko.com/markets/images/96/small/WeChat_Image_20220117220452.png",
    manualFeeTiers: [
      { tierLabel: "Level 1 (< $5M)", minVolume: 0, maxVolume: 5000000, takerFee: 0.1, makerFee: 0.08 },
      { tierLabel: "Level 2 ($5M-$10M)", minVolume: 5000000, maxVolume: 10000000, takerFee: 0.09, makerFee: 0.06 },
    ],
    manualFees: {
      fiatDepositFee: "Free (bank transfer); 1-3.5% (card)",
      fiatWithdrawalFee: "Varies by currency",
    },
  },
  {
    id: "bit2c",
    name: "Bit2C",
    country: "Israel",
    region: "Israel",
    israeliExchange: true,
    tradingPair: "BTC/NIS",
    fallbackPairs: [],
    supportedAssets: ["BTC", "ETH"],
    platformType: "exchange",
    depositMethods: ["Bank Transfer (Israeli banks)", "Crypto"],
    feePageUrl: "https://www.bit2c.co.il/home/Fees",
    websiteUrl: "https://www.bit2c.co.il",
    affiliateUrl: "https://www.bit2c.co.il/Register?ref=CRYPTOROI",
    logoUrl: "https://assets.coingecko.com/markets/images/31/small/bit2c.jpg",
    manualFeeTiers: [
      { tierLabel: "Tier 1 (< 50K ILS)", minVolume: 0, maxVolume: 50000, takerFee: 0.5, makerFee: 0.5 },
      { tierLabel: "Tier 2 (50K-200K ILS)", minVolume: 50000, maxVolume: 200000, takerFee: 0.45, makerFee: 0.45 },
      { tierLabel: "Tier 3 (200K-600K ILS)", minVolume: 200000, maxVolume: 600000, takerFee: 0.4, makerFee: 0.4 },
      { tierLabel: "Tier 4 (600K+ ILS)", minVolume: 600000, maxVolume: Infinity, takerFee: 0.25, makerFee: 0.25 },
    ],
    manualFees: {
      fiatDepositFee: "Free (bank transfer)",
      fiatWithdrawalFee: "Free (bank transfer)",
      withdrawalFee: 0.0001,
    },
  },
  {
    id: "bitsofgold",
    name: "Bits of Gold",
    country: "Israel",
    region: "Israel",
    israeliExchange: true,
    tradingPair: "BTC/ILS",
    fallbackPairs: [],
    supportedAssets: ["BTC"],
    platformType: "broker",
    depositMethods: ["Bank Transfer (Israeli banks)", "Cash"],
    feePageUrl: "https://www.bitsofgold.co.il/fees",
    websiteUrl: "https://www.bitsofgold.co.il",
    affiliateUrl: "https://www.bitsofgold.co.il/?ref=CRYPTOROI",
    logoUrl: "https://assets.coingecko.com/markets/images/267/small/bitsofgold.png",
    manualOnly: true,
    manualFeeTiers: [
      { tierLabel: "Standard", minVolume: 0, maxVolume: Infinity, takerFee: 0.5, makerFee: 0.5 },
    ],
    manualFees: {
      takerFee: 0.5,
      makerFee: 0.5,
      withdrawalFee: 0.0005,
      fiatDepositFee: "Bank transfer: free; Credit card: 2.5%",
      fiatWithdrawalFee: "Bank transfer: free",
    },
  },
];

// ─── Region Detection ───────────────────────────────────────────────

/**
 * Maps country codes (ISO 2-letter codes or country names) to regions.
 * Exchanges have a `.countries` array property.
 */
const COUNTRY_TO_REGION: Record<string, ExchangeRegion> = {
  // Americas
  US: "Americas", CA: "Americas", BR: "Americas", MX: "Americas", AR: "Americas",
  CL: "Americas", CO: "Americas", VE: "Americas", PE: "Americas", PA: "Americas",
  VG: "Americas", KY: "Americas", BS: "Americas", BB: "Americas", BM: "Americas",
  // Europe
  GB: "Europe", DE: "Europe", FR: "Europe", NL: "Europe", CH: "Europe",
  AT: "Europe", ES: "Europe", IT: "Europe", PT: "Europe", IE: "Europe",
  SE: "Europe", NO: "Europe", FI: "Europe", DK: "Europe", PL: "Europe",
  CZ: "Europe", RO: "Europe", BG: "Europe", HR: "Europe", EE: "Europe",
  LT: "Europe", LV: "Europe", MT: "Europe", CY: "Europe", LU: "Europe",
  BE: "Europe", SI: "Europe", SK: "Europe", GR: "Europe", HU: "Europe",
  LI: "Europe", GI: "Europe", IM: "Europe", JE: "Europe", GG: "Europe",
  // APAC (Asia-Pacific)
  JP: "APAC", KR: "APAC", CN: "APAC", HK: "APAC", SG: "APAC",
  TH: "APAC", VN: "APAC", ID: "APAC", MY: "APAC", PH: "APAC",
  IN: "APAC", TW: "APAC", AU: "APAC", NZ: "APAC",
  // MENA (Middle East & North Africa)
  AE: "MENA", BH: "MENA", QA: "MENA", KW: "MENA", SA: "MENA", TR: "MENA",
  EG: "MENA", JO: "MENA", LB: "MENA", OM: "MENA",
  // Africa
  NG: "Africa", ZA: "Africa", KE: "Africa", GH: "Africa",
  // Israel
  IL: "Israel",
  // Global / Other
  SC: "Global", // Seychelles - commonly used for global crypto exchanges
};

export function detectRegion(countryCodes: string[]): ExchangeRegion {
  if (!countryCodes || countryCodes.length === 0) return "Other";

  // If any country is Israel, mark as Israel
  if (countryCodes.includes("IL")) return "Israel";

  // Check if the exchange has countries in multiple regions -> Global
  const regions = new Set(
    countryCodes.map((c) => COUNTRY_TO_REGION[c]).filter(Boolean)
  );
  if (regions.size > 1) return "Global";

  // Single region
  const first = countryCodes[0];
  return COUNTRY_TO_REGION[first] || "Other";
}

/**
 * Formats country array into a readable string.
 */
export function formatCountry(countryCodes: string[]): string {
  if (!countryCodes || countryCodes.length === 0) return "Unknown";
  if (countryCodes.length === 1) {
    return COUNTRY_NAMES[countryCodes[0]] || countryCodes[0];
  }
  if (countryCodes.length <= 3) {
    return countryCodes
      .map((c) => COUNTRY_NAMES[c] || c)
      .join(", ");
  }
  return `${COUNTRY_NAMES[countryCodes[0]] || countryCodes[0]} +${countryCodes.length - 1} more`;
}

const COUNTRY_NAMES: Record<string, string> = {
  US: "United States", GB: "United Kingdom", DE: "Germany", FR: "France",
  JP: "Japan", KR: "South Korea", CN: "China", HK: "Hong Kong",
  SG: "Singapore", AU: "Australia", CA: "Canada", CH: "Switzerland",
  NL: "Netherlands", SE: "Sweden", IL: "Israel", AE: "UAE",
  SC: "Seychelles", KY: "Cayman Islands", BS: "Bahamas", MT: "Malta",
  GI: "Gibraltar", CY: "Cyprus", VG: "British Virgin Islands",
  PA: "Panama", BR: "Brazil", TR: "Turkey", IN: "India", TH: "Thailand",
  VN: "Vietnam", ID: "Indonesia", MY: "Malaysia", PH: "Philippines",
  NO: "Norway", FI: "Finland", DK: "Denmark", AT: "Austria",
  ES: "Spain", IT: "Italy", PT: "Portugal", PL: "Poland",
  EE: "Estonia", LT: "Lithuania", LV: "Latvia", BG: "Bulgaria",
  HR: "Croatia", RO: "Romania", CZ: "Czechia", HU: "Hungary",
  IE: "Ireland", LU: "Luxembourg", BE: "Belgium", TW: "Taiwan",
  NZ: "New Zealand", MX: "Mexico", AR: "Argentina",
  BH: "Bahrain", QA: "Qatar", SA: "Saudi Arabia", KW: "Kuwait",
};

// ─── Known Defunct/Problematic Exchanges ────────────────────────────

/**
 * CCXT exchange IDs to skip during dynamic discovery.
 * These are defunct, deprecated, require authentication for all calls,
 * or are known to be unreliable.
 */
export const EXCHANGE_BLOCKLIST: Set<string> = new Set([
  // Defunct / shut down
  "btcbox",
  "flowbtc",
  "therock",
  "xena",
  "qtrade",
  "stex",
  "equos",
  "aax",
  "ftx",
  "ftxus",
  "cdax",
  "crex24",
  "liquid",
  "vaultoro",
  "dx",
  "coinfalcon",
  "btcalpha",
  "rightbtc",
  // Require authentication for all API calls
  "ndax",
  "foxbit",
  // Known unreliable / extremely slow
  "yobit",
  "tidex",
  "southxchange",
]);

// ─── DEX Exchanges ──────────────────────────────────────────────────

export const DEX_EXCHANGE_IDS: Set<string> = new Set([
  "uniswap", "uniswapv2", "uniswapv3",
  "pancakeswap", "pancakeswapv3",
  "1inch",
  "dydx",
  "sushiswap", "sushiswapv3",
  "curve",
  "balancer",
  "raydium",
  "jupiter",
]);

export function isDex(exchangeId: string): boolean {
  return DEX_EXCHANGE_IDS.has(exchangeId);
}

// ─── Asset Pair Helpers ─────────────────────────────────────────────

/**
 * Returns trading pairs for a given asset.
 * For featured exchanges, uses configured pairs when asset matches.
 * For dynamic discovery, generates standard pairs.
 */
export function getAssetPairs(asset: CryptoAsset): string[] {
  return ASSET_CONFIG[asset].pairs;
}

// ─── Helper ─────────────────────────────────────────────────────────

export function getFeaturedConfig(exchangeId: string): FeaturedExchangeConfig | undefined {
  return FEATURED_EXCHANGES.find((e) => e.id === exchangeId);
}

export function isFeaturedExchange(exchangeId: string): boolean {
  return FEATURED_EXCHANGES.some((e) => e.id === exchangeId);
}
