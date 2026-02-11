export interface FAQItem {
  question: string;
  answer: string;
}

export const faqItems: FAQItem[] = [
  {
    question: "What is the cheapest exchange to buy Bitcoin?",
    answer:
      "The cheapest exchange depends on your location, payment method, and purchase amount. Exchanges like Binance and OKX typically have the lowest trading fees (0.1% or less), but total cost also includes deposit fees, spreads, and withdrawal fees. CryptoROI calculates the total cost across all these factors so you can see which exchange offers the best deal for your specific situation.",
  },
  {
    question: "How do exchange fees affect my crypto ROI?",
    answer:
      "Exchange fees directly reduce the amount of cryptocurrency you receive. For example, if you invest $10,000 and pay 2% in total fees (trading fee, deposit fee, and spread), you lose $200 immediately. Over time, this compounds because you have less crypto appreciating in value. The difference between the cheapest and most expensive exchange can be up to 5% on a single transaction.",
  },
  {
    question: "What's the difference between maker and taker fees?",
    answer:
      "Maker fees are charged when you place a limit order that adds liquidity to the order book (your order isn't immediately matched). Taker fees are charged when you place a market order that removes liquidity (your order is immediately matched against existing orders). Maker fees are typically lower than taker fees because exchanges want to incentivize liquidity. Most casual buyers pay taker fees since they use market orders.",
  },
  {
    question: "Should I use a broker or an exchange?",
    answer:
      "Brokers like Bits of Gold offer a simpler buying experience but typically charge higher fees (1-3% total cost). Exchanges like Binance or Kraken have lower fees (0.1-0.5% total cost) but require more knowledge to use effectively. If you are buying more than a few hundred dollars worth of crypto, the savings from using an exchange usually outweigh the convenience of a broker.",
  },
  {
    question: "How does order book slippage work?",
    answer:
      "Slippage occurs when your order is large enough to consume multiple price levels in the order book. For example, if only 0.5 BTC is available at the best ask price and you want to buy 2 BTC, the remaining 1.5 BTC will be filled at progressively higher prices. CryptoROI simulates this by walking the real order book for each exchange to show you the actual average price you would pay, not just the quoted price.",
  },
  {
    question: "How does CryptoROI calculate the total cost?",
    answer:
      "CryptoROI fetches real-time prices and order book data from each exchange, then calculates the total cost by adding together: the trading fee (maker or taker), the deposit fee for your chosen payment method, the bid-ask spread, and order book slippage for your specific purchase amount. This gives you a true apples-to-apples comparison that most other sites don't provide.",
  },
];
