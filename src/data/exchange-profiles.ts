/**
 * Extended exchange profile data for SEO-optimized individual exchange pages.
 * This supplements the core Exchange type with richer content for landing pages.
 */

export interface ExchangeProfile {
  /** Must match the exchange slug in exchanges.ts */
  slug: string;
  /** Long-form description for the exchange detail page (2-3 sentences) */
  longDescription: string;
  /** Supported crypto assets for trading */
  supportedAssets: string[];
  /** Regions/countries where the exchange operates */
  regionAvailability: string[];
  /** Deposit methods with human-readable labels */
  depositMethods: string[];
  /** Year the exchange was founded */
  foundedYear: number;
  /** Where the exchange is headquartered */
  headquarters: string;
  /** Estimated number of users or volume description */
  userBase: string;
  /** Regulatory status / licenses */
  regulation: string;
  /** Additional SEO keywords specific to this exchange */
  seoKeywords: string[];
  /** Short tagline for OG images and cards */
  tagline: string;
}

export const exchangeProfiles: ExchangeProfile[] = [
  {
    slug: "binance",
    longDescription:
      "Binance is the world's largest cryptocurrency exchange by daily trading volume, processing billions of dollars in trades every day. Founded by Changpeng Zhao in 2017, Binance offers spot trading, futures, staking, lending, and an extensive ecosystem of crypto products. With over 350 trading pairs and some of the lowest fees in the industry, Binance is the go-to platform for both retail and institutional traders worldwide.",
    supportedAssets: ["BTC", "ETH", "DOGE", "BNB", "SOL", "XRP", "ADA", "MATIC", "DOT", "AVAX"],
    regionAvailability: ["Global", "Europe", "Asia", "Middle East", "Africa", "South America"],
    depositMethods: ["Bank Transfer (SEPA/Wire)", "Credit/Debit Card", "Crypto Deposit", "P2P Trading", "Apple Pay", "Google Pay"],
    foundedYear: 2017,
    headquarters: "Cayman Islands",
    userBase: "150M+ registered users",
    regulation: "Licensed in multiple jurisdictions including France, Italy, Spain, Dubai, and Japan",
    seoKeywords: ["binance fees", "binance review", "binance trading fees 2026", "binance maker taker fees", "binance withdrawal fees", "is binance safe"],
    tagline: "World's Largest Crypto Exchange",
  },
  {
    slug: "coinbase",
    longDescription:
      "Coinbase is the largest publicly traded cryptocurrency exchange in the United States, listed on NASDAQ since April 2021. Known for its beginner-friendly interface and strong regulatory compliance, Coinbase offers a trusted on-ramp for millions of users entering the crypto market. The platform provides both a simple buy/sell interface and an advanced trading platform (Coinbase Advanced Trade) with lower fees for experienced traders.",
    supportedAssets: ["BTC", "ETH", "DOGE", "SOL", "XRP", "ADA", "MATIC", "AVAX", "LINK", "UNI"],
    regionAvailability: ["United States", "United Kingdom", "Europe (EU/EEA)", "Canada", "Australia", "Singapore"],
    depositMethods: ["Bank Transfer (ACH)", "Wire Transfer", "Credit/Debit Card", "PayPal", "Crypto Deposit", "Apple Pay"],
    foundedYear: 2012,
    headquarters: "United States",
    userBase: "110M+ verified users",
    regulation: "SEC-registered, NYDFS BitLicense, FCA (UK), regulated in 40+ countries",
    seoKeywords: ["coinbase fees", "coinbase review", "coinbase trading fees 2026", "coinbase vs binance", "coinbase withdrawal fees", "is coinbase safe"],
    tagline: "America's Most Trusted Exchange",
  },
  {
    slug: "kraken",
    longDescription:
      "Kraken is one of the oldest and most respected cryptocurrency exchanges, operating continuously since 2011. Known for its industry-leading security record (never been hacked), Kraken offers spot trading, futures, staking, and margin trading. The exchange is a favorite among security-conscious traders and provides one of the best fiat on-ramp experiences with support for multiple currencies and low-cost bank transfers.",
    supportedAssets: ["BTC", "ETH", "DOGE", "SOL", "XRP", "ADA", "DOT", "MATIC", "AVAX", "ATOM"],
    regionAvailability: ["United States", "Canada", "Europe (EU/EEA)", "United Kingdom", "Australia", "Japan"],
    depositMethods: ["Bank Transfer (SEPA/Wire)", "Credit/Debit Card", "Crypto Deposit", "Swift Wire"],
    foundedYear: 2011,
    headquarters: "United States",
    userBase: "10M+ verified users",
    regulation: "FinCEN MSB, FCA (UK), FINTRAC (Canada), AUSTRAC (Australia), FSA (Japan)",
    seoKeywords: ["kraken fees", "kraken review", "kraken trading fees 2026", "kraken vs coinbase", "kraken withdrawal fees", "is kraken safe"],
    tagline: "Security-First Crypto Exchange",
  },
  {
    slug: "bybit",
    longDescription:
      "Bybit is a rapidly growing cryptocurrency exchange that has established itself as one of the top platforms for derivatives and spot trading. Headquartered in Dubai, Bybit serves millions of users globally with a focus on high-performance trading, deep liquidity, and competitive fee structures. The platform is particularly popular among active traders for its perpetual contracts and copy trading features.",
    supportedAssets: ["BTC", "ETH", "DOGE", "SOL", "XRP", "ADA", "AVAX", "MATIC", "OP", "ARB"],
    regionAvailability: ["Europe", "Asia", "Middle East", "Africa", "South America", "Oceania"],
    depositMethods: ["Bank Transfer", "Credit/Debit Card", "Crypto Deposit", "P2P Trading", "Apple Pay", "Google Pay"],
    foundedYear: 2018,
    headquarters: "Dubai, UAE",
    userBase: "30M+ registered users",
    regulation: "Licensed in Dubai (VARA), licensed in Cyprus, registered in multiple jurisdictions",
    seoKeywords: ["bybit fees", "bybit review", "bybit trading fees 2026", "bybit vs binance", "bybit withdrawal fees", "is bybit safe"],
    tagline: "High-Performance Derivatives Exchange",
  },
  {
    slug: "okx",
    longDescription:
      "OKX is a leading global cryptocurrency exchange offering spot trading, derivatives, DeFi, and Web3 services under one platform. With a strong presence in Asia and expanding globally, OKX combines institutional-grade liquidity with some of the lowest maker fees in the industry. The platform also features an integrated Web3 wallet and access to decentralized applications, making it a comprehensive crypto ecosystem.",
    supportedAssets: ["BTC", "ETH", "DOGE", "SOL", "XRP", "ADA", "DOT", "AVAX", "NEAR", "APT"],
    regionAvailability: ["Europe", "Asia", "Middle East", "Africa", "South America", "Oceania"],
    depositMethods: ["Bank Transfer", "Credit/Debit Card", "Crypto Deposit", "P2P Trading", "Apple Pay"],
    foundedYear: 2017,
    headquarters: "Seychelles",
    userBase: "50M+ registered users",
    regulation: "Licensed in Dubai (VARA), MiCA-compliant in EU, registered in multiple jurisdictions",
    seoKeywords: ["okx fees", "okx review", "okx trading fees 2026", "okx vs binance", "okx withdrawal fees", "is okx safe"],
    tagline: "Trade, DeFi & Web3 in One Platform",
  },
  {
    slug: "bit2c",
    longDescription:
      "Bit2C is Israel's first and largest cryptocurrency exchange, operating since 2013. The platform specializes in NIS (Israeli Shekel) trading pairs and serves as the primary on-ramp for Israeli crypto investors. With direct integration to Israeli banks and a straightforward interface, Bit2C provides a localized trading experience tailored to the Israeli market, including Hebrew language support and local customer service.",
    supportedAssets: ["BTC", "ETH", "LTC", "ETC"],
    regionAvailability: ["Israel"],
    depositMethods: ["Israeli Bank Transfer", "Crypto Deposit"],
    foundedYear: 2013,
    headquarters: "Israel",
    userBase: "200K+ registered users",
    regulation: "Regulated under Israeli financial supervision, compliant with Israeli AML/KYC requirements",
    seoKeywords: ["bit2c fees", "bit2c review", "buy bitcoin israel", "bit2c trading fees", "israeli crypto exchange", "bit2c shekel"],
    tagline: "Israel's First Crypto Exchange",
  },
  {
    slug: "bits-of-gold",
    longDescription:
      "Bits of Gold is an Israeli cryptocurrency broker that has been operating since 2013, providing a simple and accessible way for Israelis to buy and sell Bitcoin and Ethereum. As a licensed Money Service Business, Bits of Gold focuses on ease of use rather than advanced trading features, making it ideal for beginners and those who prefer a straightforward buying experience. The platform supports both NIS and EUR transactions.",
    supportedAssets: ["BTC", "ETH"],
    regionAvailability: ["Israel", "Europe"],
    depositMethods: ["Israeli Bank Transfer", "Credit Card", "SEPA Transfer", "Crypto Deposit"],
    foundedYear: 2013,
    headquarters: "Israel",
    userBase: "100K+ registered users",
    regulation: "Licensed Israeli MSB (Money Service Business), full KYC/AML compliance",
    seoKeywords: ["bits of gold fees", "bits of gold review", "buy bitcoin israel", "bits of gold trading fees", "israeli bitcoin broker"],
    tagline: "Simple Bitcoin Buying in Israel",
  },
  {
    slug: "kucoin",
    longDescription:
      "KuCoin is a global cryptocurrency exchange known for its extensive selection of altcoins and trading pairs. Often called 'The People's Exchange,' KuCoin lists many emerging tokens before they appear on larger platforms, making it a favorite among altcoin traders. The platform offers spot trading, futures, margin trading, lending, and staking services with a user-friendly interface and competitive fee structure.",
    supportedAssets: ["BTC", "ETH", "DOGE", "SOL", "XRP", "KCS", "ADA", "DOT", "AVAX", "NEAR"],
    regionAvailability: ["Global", "Europe", "Asia", "South America", "Africa", "Oceania"],
    depositMethods: ["Bank Transfer", "Credit/Debit Card", "Crypto Deposit", "P2P Trading", "Apple Pay"],
    foundedYear: 2017,
    headquarters: "Seychelles",
    userBase: "30M+ registered users",
    regulation: "Registered in Seychelles, expanding regulatory compliance globally",
    seoKeywords: ["kucoin fees", "kucoin review", "kucoin trading fees 2026", "kucoin vs binance", "kucoin withdrawal fees", "is kucoin safe"],
    tagline: "The People's Crypto Exchange",
  },
  {
    slug: "gate-io",
    longDescription:
      "Gate.io is one of the longest-running cryptocurrency exchanges, founded in 2013 and offering access to over 1,700 cryptocurrencies and 2,500 trading pairs. The platform is known for its early listing of new tokens and comprehensive feature set including spot trading, futures, options, lending, and staking. Gate.io also features innovative products like startup token sales and copy trading.",
    supportedAssets: ["BTC", "ETH", "DOGE", "SOL", "XRP", "ADA", "DOT", "AVAX", "GT", "FIL"],
    regionAvailability: ["Global", "Europe", "Asia", "Middle East", "South America", "Africa"],
    depositMethods: ["Bank Transfer", "Credit/Debit Card", "Crypto Deposit", "P2P Trading"],
    foundedYear: 2013,
    headquarters: "Cayman Islands",
    userBase: "16M+ registered users",
    regulation: "Licensed in Malta, Lithuania, and other jurisdictions; expanding regulatory framework",
    seoKeywords: ["gate.io fees", "gate.io review", "gate.io trading fees 2026", "gate.io vs binance", "gate.io withdrawal fees"],
    tagline: "1,700+ Cryptos, One Platform",
  },
  {
    slug: "bitstamp",
    longDescription:
      "Bitstamp is one of the oldest continuously operating cryptocurrency exchanges in the world, founded in 2011 in Slovenia and now headquartered in Luxembourg. Known for its institutional-grade compliance and reliability, Bitstamp has built a reputation as a trusted platform for both retail and institutional investors. The exchange focuses on core trading pairs with deep liquidity and offers a clean, professional trading experience.",
    supportedAssets: ["BTC", "ETH", "XRP", "LTC", "SOL", "ADA", "DOT", "AVAX", "LINK", "UNI"],
    regionAvailability: ["United States", "Europe (EU/EEA)", "United Kingdom", "Canada", "Australia"],
    depositMethods: ["Bank Transfer (SEPA/Wire)", "Credit/Debit Card", "Crypto Deposit", "ACH (US)"],
    foundedYear: 2011,
    headquarters: "Luxembourg",
    userBase: "4M+ registered users",
    regulation: "Licensed in Luxembourg (CSSF), FCA (UK), NYDFS BitLicense, fully MiCA-compliant",
    seoKeywords: ["bitstamp fees", "bitstamp review", "bitstamp trading fees 2026", "bitstamp vs kraken", "bitstamp withdrawal fees", "is bitstamp safe"],
    tagline: "Europe's Oldest Crypto Exchange",
  },
];

export function getExchangeProfile(slug: string): ExchangeProfile | undefined {
  return exchangeProfiles.find((p) => p.slug === slug);
}

export function getAllExchangeProfileSlugs(): string[] {
  return exchangeProfiles.map((p) => p.slug);
}
