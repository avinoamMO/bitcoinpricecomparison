import { Article } from "@/types";

export const articles: Article[] = [
  {
    slug: "how-exchange-fees-work",
    title: "How Cryptocurrency Exchange Fees Work: A Complete Guide",
    description: "Understand maker vs taker fees, deposit costs, withdrawal charges, and hidden spreads.",
    content: "## Understanding Exchange Fees\n\nWhen you buy Bitcoin, multiple layers of fees eat into your investment.\n\n### Maker vs Taker Fees\n\n- **Maker fees** are charged when you add liquidity via limit orders\n- **Taker fees** are charged when you remove liquidity via market orders\n\n### Deposit Fees\n\n- **Bank transfer**: Usually free but slow\n- **Credit card**: Fast but 2-4% fee\n- **Crypto deposit**: Free on most exchanges\n\n### The Hidden Spread\n\nThe spread is often the largest hidden cost. High-liquidity exchanges have ~0.05% while brokers can have 0.5-1.5%.",
    publishedAt: "2025-01-15", updatedAt: "2025-06-01", readTime: 6,
    keywords: ["exchange fees", "maker taker fees", "bitcoin trading costs"],
  },
  {
    slug: "hidden-costs-buying-bitcoin",
    title: "The Hidden Costs of Buying Bitcoin That Nobody Talks About",
    description: "Beyond trading fees, discover the real costs including spreads, deposit fees, and network fees.",
    content: "## The True Cost of Buying Bitcoin\n\nMost comparison sites only show the trading fee.\n\n### 1. The Spread Tax\n\nEvery exchange has a spread. On brokers, it can be 1-3%.\n\n### 2. Payment Method Markups\n\nCredit card purchases add 2-4% in fees before any trading fee.\n\n### 3. Network Withdrawal Fees\n\nMoving BTC to your wallet costs a network fee that varies by exchange.\n\n### How CryptoROI Helps\n\nOur tool factors in ALL costs for a true comparison.",
    publishedAt: "2025-02-01", updatedAt: "2025-06-01", readTime: 5,
    keywords: ["hidden bitcoin costs", "bitcoin spread", "true cost bitcoin"],
  },
  {
    slug: "how-to-choose-exchange",
    title: "How to Choose the Right Cryptocurrency Exchange in 2025",
    description: "A practical guide to selecting the best crypto exchange for your needs.",
    content: "## Choosing the Right Exchange\n\nThe best exchange depends on your situation.\n\n### Factor 1: Your Location\n\n- **US**: Coinbase, Kraken\n- **Europe**: Binance, Kraken, Coinbase\n- **Israel**: Bit2C, Bits of Gold\n\n### Factor 2: Experience Level\n\n- **Beginners**: Coinbase, Bits of Gold\n- **Advanced**: Binance, OKX, Bybit\n\n### Factor 3: Volume\n\nFee tiers matter at scale. Above $50K/month, lowest tier is essential.",
    publishedAt: "2025-03-01", updatedAt: "2025-06-01", readTime: 5,
    keywords: ["choose crypto exchange", "best cryptocurrency exchange"],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
