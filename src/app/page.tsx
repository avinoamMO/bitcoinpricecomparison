import { ComparisonDashboard } from "@/components/comparison/ComparisonDashboard";
import { AdBanner } from "@/components/ads";
import { FAQ } from "@/components/comparison/FAQ";
import Link from "next/link";
import { articles } from "@/data/articles";
import { ArrowRight, BookOpen, Clock } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <ComparisonDashboard />

      {/* Ad Banner — between comparison tool and educational content */}
      <div className="mt-12 max-w-4xl mx-auto">
        <AdBanner />
      </div>

      <section className="mt-20 max-w-4xl mx-auto">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Why Compare Bitcoin Exchange Fees?</h2>
            <p className="text-muted-foreground leading-relaxed">
              The difference between the cheapest and most expensive way to buy Bitcoin can be as high as 5% of your investment. On a $10,000 purchase, that is $500 in unnecessary fees. CryptoROI helps you find the best deal by comparing real-time prices, trading fees, deposit costs, spreads, and withdrawal fees across 100+ cryptocurrency exchanges worldwide.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">How Our Comparison Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="text-2xl font-bold text-gold mb-2">1</div>
                <h3 className="font-semibold text-foreground mb-1">Enter Amount</h3>
                <p className="text-sm text-muted-foreground">Tell us how much you want to invest and your preferred payment method.</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="text-2xl font-bold text-gold mb-2">2</div>
                <h3 className="font-semibold text-foreground mb-1">Compare Real-Time</h3>
                <p className="text-sm text-muted-foreground">We fetch live prices and calculate total costs including all hidden fees.</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="text-2xl font-bold text-gold mb-2">3</div>
                <h3 className="font-semibold text-foreground mb-1">Buy at the Best Price</h3>
                <p className="text-sm text-muted-foreground">Click through to the exchange with the best deal and maximize your Bitcoin.</p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Exchanges We Compare</h2>
            <p className="text-muted-foreground leading-relaxed">
              We dynamically compare 100+ cryptocurrency exchanges in real time, including featured exchanges Binance, Coinbase, Kraken, Bybit, OKX, and Israeli exchanges Bit2C and Bits of Gold. Filter by region, search by name, and sort by price, fees, or liquidity.
            </p>
          </div>
        </div>
      </section>

      {/* Learning Center Preview */}
      <section className="mt-16 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-gold" />
            <h2 className="text-2xl font-bold text-foreground">Learn More</h2>
          </div>
          <Link
            href="/learn"
            className="text-sm text-gold hover:text-gold-light transition-colors flex items-center gap-1"
          >
            View all articles
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {articles.slice(0, 3).map((article) => (
            <Link
              key={article.slug}
              href={`/learn/${article.slug}`}
              className="group rounded-xl border border-border bg-card p-5 hover:border-gold/30 transition-colors"
            >
              <h3 className="font-semibold text-foreground text-sm group-hover:text-gold transition-colors mb-2 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                {article.description}
              </p>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {article.readTime} min read
              </span>
            </Link>
          ))}
        </div>
      </section>

      <FAQ />
    </>
  );
}
