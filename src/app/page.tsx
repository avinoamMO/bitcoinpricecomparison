import { ComparisonDashboard } from "@/components/comparison/ComparisonDashboard";

export default function HomePage() {
  return (
    <>
      <ComparisonDashboard />
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
              We dynamically compare 100+ cryptocurrency exchanges using CCXT, including featured exchanges Binance, Coinbase, Kraken, Bybit, OKX, and Israeli exchanges Bit2C and Bits of Gold. Filter by region, search by name, and sort by price, fees, or liquidity.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
