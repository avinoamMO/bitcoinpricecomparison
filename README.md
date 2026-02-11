# CryptoROI - Bitcoin Exchange Comparison Tool

**Find the cheapest way to buy Bitcoin.** CryptoROI compares real-time prices and total costs across 100+ exchanges, so you keep more BTC in your wallet.

**[Live Demo](https://bitcoinpricecomparison.vercel.app)**

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tests](https://img.shields.io/badge/tests-28%20passing-green)
![License](https://img.shields.io/badge/license-MIT-gray)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?logo=vercel)](https://bitcoinpricecomparison.vercel.app)

## Why CryptoROI?

Most comparison sites only show price differences. But the **real cost** of buying Bitcoin includes:

- **Trading fees** (maker/taker, volume-tiered)
- **Deposit fees** (bank transfer vs credit card)
- **Withdrawal fees** (on-chain BTC withdrawal)
- **Spread** (the hidden markup between buy and sell prices)

CryptoROI calculates the **total cost** and shows you exactly how much BTC you receive after all fees -- not just the sticker price.

## Features

- **Real-time comparison** across 100+ exchanges (Binance, Coinbase, Kraken, Bybit, OKX, Bit2C, Bits of Gold, and many more)
- **Total cost breakdown** showing trading fees, deposit fees, spread, and withdrawal costs
- **Net BTC received** calculator -- see exactly what lands in your wallet
- **ROI vs Best Deal** -- know how much you lose by picking the wrong exchange
- **Volume-tiered fees** -- accurate fee calculations based on your trading volume
- **Israeli exchange support** -- Bit2C and Bits of Gold with ILS pricing
- **Educational content** -- learn about exchange fees, hidden costs, and how to choose
- **SEO optimized** -- schema.org markup, sitemap, Open Graph tags
- **Dark mode crypto aesthetic** -- built for the crypto community
- **Mobile-first responsive design**

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| UI Components | Radix UI + CVA (shadcn/ui pattern) |
| Icons | Lucide React |
| Price Data | CoinGecko API (free tier) |
| Testing | Jest 30 + React Testing Library |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repo
git clone https://github.com/avinoamMO/bitcoinpricecomparison.git
cd bitcoinpricecomparison

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

```bash
# Optional: CoinGecko API key for higher rate limits (free tier works without it)
COINGECKO_API_KEY=

# Site URL for sitemap/SEO (defaults to localhost:3000)
NEXT_PUBLIC_SITE_URL=https://cryptoroi.com

# Optional: Google Analytics
NEXT_PUBLIC_GA_ID=
```

## Project Structure

```
src/
  app/
    api/
      prices/route.ts       # GET /api/prices - real-time BTC prices
      compare/route.ts       # GET /api/compare - full cost comparison
      exchanges/route.ts     # GET /api/exchanges - exchange data
    exchanges/[slug]/page.tsx  # Exchange profile pages (SSG)
    learn/[slug]/page.tsx      # Educational articles (SSG)
    page.tsx                   # Homepage with comparison dashboard
    layout.tsx                 # Root layout with SEO metadata
    sitemap.ts                 # Dynamic sitemap
    robots.ts                  # Robots.txt
  components/
    comparison/
      ComparisonDashboard.tsx  # Main comparison UI (client component)
      ComparisonTable.tsx      # Results table with expandable rows
      AmountInput.tsx          # Amount/currency/method selector
    exchange/
      ExchangeProfile.tsx      # Full exchange detail view
    layout/
      Header.tsx               # Navigation with mobile menu
      Footer.tsx               # Footer with exchange/article links
    ui/                        # shadcn-style base components
  data/
    exchanges.ts               # 7 exchange definitions with fee structures
    articles.ts                # 3 educational articles
  lib/
    comparison-engine.ts       # Core ROI calculation logic
    price-service.ts           # CoinGecko price fetching + caching
    constants.ts               # Currency symbols, labels
    cn.ts                      # Tailwind merge utility
  types/
    index.ts                   # TypeScript interfaces
```

## API Endpoints

### `GET /api/prices?currency=USD`

Returns real-time BTC prices across all exchanges.

### `GET /api/compare?amount=1000&currency=USD&depositMethod=bank_transfer&mode=buy`

Returns a full cost comparison with total costs, fees breakdown, and rankings.

### `GET /api/exchanges` or `GET /api/exchanges?slug=binance`

Returns exchange data (all or single).

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

28 tests across 3 test suites covering:
- Comparison engine logic (17 tests)
- Exchange data integrity (7 tests)
- Article data integrity (4 tests)

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Set environment variables
4. Deploy

The app is optimized for Vercel with:
- Static generation for exchange and article pages
- Dynamic API routes with server-side caching
- Edge-ready architecture

### Other Platforms

```bash
npm run build
npm start
```

## Exchanges Covered

| Exchange | Country | Currencies | Trading Fee |
|----------|---------|------------|-------------|
| Binance | Global | USD, EUR, GBP | 0.10% |
| Coinbase | US | USD, EUR, GBP | 0.60% |
| Kraken | US | USD, EUR, GBP | 0.26% |
| Bybit | Global | USD, EUR | 0.10% |
| OKX | Global | USD, EUR | 0.10% |
| Bit2C | Israel | ILS, USD | 0.50% |
| Bits of Gold | Israel | ILS, EUR | 0.50% |

## Monetization (Display Ads)

CryptoROI supports optional display ads via Google AdSense, Coinzilla (crypto-specific), or a custom ad network. Ads are fully opt-in: if no environment variables are set, zero ad markup renders and no external scripts are loaded.

### Configuring Google AdSense

1. Sign up at [Google AdSense](https://www.google.com/adsense)
2. Get your publisher client ID (e.g. `ca-pub-1234567890123456`)
3. Create ad units for banner, sidebar, and in-feed slots
4. Set the environment variables:
   ```bash
   NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-1234567890123456
   NEXT_PUBLIC_ADSENSE_SLOT_BANNER=1234567890
   NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR=0987654321
   NEXT_PUBLIC_ADSENSE_SLOT_INFEED=1122334455
   ```
5. Update `public/ads.txt` with your publisher ID

### Configuring Coinzilla

1. Sign up at [Coinzilla](https://coinzilla.com) (crypto-focused, higher CPMs)
2. Create a zone and get the zone ID
3. Set:
   ```bash
   NEXT_PUBLIC_COINZILLA_ZONE_ID=your-zone-id
   ```

### Where ads appear

| Slot | Location | Format |
|------|----------|--------|
| Banner | Between fee summary bar and exchange list | 728x90 responsive |
| Banner | Below comparison tool, above educational content | 728x90 responsive |
| In-feed | After every 3rd exchange card (max 2) | Fluid native |

### Disabling ads

Simply leave the ad environment variables empty (or unset). No ads will render, no external scripts will load.

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/add-exchange`)
3. Write tests for your changes
4. Ensure all tests pass (`npm test`)
5. Ensure the build passes (`npm run build`)
6. Submit a pull request

### Adding a New Exchange

1. Add the exchange object to `src/data/exchanges.ts`
2. Add pricing logic to `src/lib/price-service.ts`
3. Update tests in `src/__tests__/lib/exchanges-data.test.ts`
4. Run `npm test && npm run build`

## License

MIT

---

Built by [Avinoam Oltchik](https://github.com/avinoamMO)
