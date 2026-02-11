import type { Metadata } from "next";
import Link from "next/link";
import { exchangeProfiles } from "@/data/exchange-profiles";
import { exchanges as exchangeData } from "@/data/exchanges";
import { Star, ArrowRight, MapPin, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Compare Crypto Exchange Fees & Reviews 2026",
  description:
    "Compare fees, features, and reviews for the top cryptocurrency exchanges. Find the cheapest exchange for Bitcoin, Ethereum, and Dogecoin in 2026.",
  alternates: {
    canonical: "https://cryptoroi.com/exchanges",
  },
  openGraph: {
    title: "Compare Crypto Exchange Fees & Reviews 2026 | CryptoROI",
    description:
      "Side-by-side comparison of fees, security, and features for Binance, Coinbase, Kraken, and more.",
    url: "https://cryptoroi.com/exchanges",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare Crypto Exchange Fees & Reviews 2026 | CryptoROI",
    description:
      "Side-by-side comparison of fees, security, and features for Binance, Coinbase, Kraken, and more.",
  },
};

function formatFeePercent(fee: number): string {
  return `${(fee * 100).toFixed(2)}%`;
}

export default function ExchangesDirectoryPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Cryptocurrency Exchange Directory
        </h1>
        <p className="text-lg text-muted-foreground">
          Compare fees, features, security, and supported assets across the top
          cryptocurrency exchanges. Click any exchange for a detailed review
          including fee breakdowns, deposit methods, and pros/cons analysis.
        </p>
      </div>

      {/* Exchange Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exchangeData.map((exchange) => {
          const profile = exchangeProfiles.find((p) => p.slug === exchange.slug);
          return (
            <Link
              key={exchange.slug}
              href={`/exchanges/${exchange.slug}`}
              className="group rounded-xl border border-border bg-card p-6 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-xl font-semibold text-foreground group-hover:text-gold transition-colors">
                    {exchange.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {exchange.founded}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {exchange.headquarters}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-3.5 w-3.5 text-gold fill-gold" />
                  <span className="text-muted-foreground">
                    {exchange.rating}
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {exchange.description}
              </p>

              {/* Fee Summary */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="rounded-lg bg-background p-2 text-center">
                  <div className="text-xs text-muted-foreground">Maker</div>
                  <div className="text-sm font-mono font-medium text-foreground">
                    {formatFeePercent(exchange.feeStructure.makerFee)}
                  </div>
                </div>
                <div className="rounded-lg bg-background p-2 text-center">
                  <div className="text-xs text-muted-foreground">Taker</div>
                  <div className="text-sm font-mono font-medium text-foreground">
                    {formatFeePercent(exchange.feeStructure.takerFee)}
                  </div>
                </div>
                <div className="rounded-lg bg-background p-2 text-center">
                  <div className="text-xs text-muted-foreground">Spread</div>
                  <div className="text-sm font-mono font-medium text-foreground">
                    ~{formatFeePercent(exchange.feeStructure.spreadEstimate)}
                  </div>
                </div>
              </div>

              {/* Supported Assets */}
              {profile && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {profile.supportedAssets.slice(0, 5).map((asset) => (
                    <span
                      key={asset}
                      className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {asset}
                    </span>
                  ))}
                  {profile.supportedAssets.length > 5 && (
                    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      +{profile.supportedAssets.length - 5}
                    </span>
                  )}
                </div>
              )}

              {/* CTA */}
              <div className="flex items-center text-sm font-medium text-gold group-hover:text-gold-light transition-colors">
                View Full Review
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="text-center border-t border-border pt-10">
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Not sure which exchange is cheapest?
        </h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Use our real-time comparison tool to see actual prices, fees, and net
          ROI across all exchanges for your specific amount and payment method.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gold text-black rounded-xl font-semibold hover:bg-gold-light transition-colors shadow-lg shadow-gold/20"
        >
          Compare Prices Now
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* JSON-LD for the directory page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Top Cryptocurrency Exchanges",
            description:
              "Directory of featured cryptocurrency exchanges compared by fees, features, and security.",
            numberOfItems: exchangeData.length,
            itemListElement: exchangeData.map((exchange, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: exchange.name,
              url: `https://cryptoroi.com/exchanges/${exchange.slug}`,
            })),
          }),
        }}
      />
    </div>
  );
}
