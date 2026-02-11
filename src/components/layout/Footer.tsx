import Link from "next/link";
import { Bitcoin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10">
                <Bitcoin className="h-4 w-4 text-gold" />
              </div>
              <span className="text-lg font-bold text-foreground">
                Crypto<span className="text-gold">ROI</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Find the cheapest way to buy Bitcoin. Compare real-time prices,
              fees, and net ROI across major cryptocurrency exchanges.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-4">
              Prices are indicative and sourced from CoinGecko. Fee structures
              may change — always verify on the exchange website before trading.
            </p>
          </div>

          {/* Exchanges */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              Exchanges
            </h4>
            <ul className="space-y-2">
              {["binance", "coinbase", "kraken", "bybit", "okx", "kucoin", "gate-io", "bitstamp", "bit2c", "bits-of-gold"].map(
                (slug) => (
                  <li key={slug}>
                    <Link
                      href={`/exchanges/${slug}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors capitalize"
                    >
                      {slug === "gate-io" ? "Gate.io" : slug.replace(/-/g, " ").replace("2c", "2C")}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              Learn
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/learn/how-exchange-fees-work"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  How Fees Work
                </Link>
              </li>
              <li>
                <Link
                  href="/learn/hidden-costs-buying-bitcoin"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Hidden Costs
                </Link>
              </li>
              <li>
                <Link
                  href="/learn/how-to-choose-exchange"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Choosing an Exchange
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* More Tools */}
        <div className="mt-8 pt-8 border-t border-border">
          <h4 className="text-sm font-semibold text-foreground mb-3">More Tools</h4>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="https://github.com/avinoamMO/tokenscout" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">TokenScout</a>
            <a href="https://github.com/avinoamMO/compliancekit" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">ComplianceKit</a>
            <a href="https://github.com/avinoamMO/reposcout" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">RepoScout</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">All Projects &rarr;</a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} CryptoROI. Not financial advice.
          </p>
          <p className="text-xs text-muted-foreground">
            Built by{" "}
            <a href="#" className="text-foreground hover:underline">Avinoam Oltchik</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
