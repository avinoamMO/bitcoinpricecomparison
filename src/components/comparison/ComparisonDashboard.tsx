"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  ComparisonResult,
  ComparisonResponse,
  ExchangeData,
  MarketDataApiResponse,
  Currency,
  DepositMethod,
  ExchangeRegion,
  CryptoAsset,
  ASSET_CONFIG,
} from "@/types";
import { AmountInput } from "./AmountInput";
import { ComparisonTable } from "./ComparisonTable";
import { ExchangeCardView } from "./ExchangeCardView";
import { ExchangeComparisonTable } from "./ExchangeComparisonTable";
import { FeeSummaryBar } from "./FeeSummaryBar";
import { ExchangeFilters, SortOption, CexDexFilter, CurrencyPairFilter, PlatformTypeFilter, DepositMethodFilter } from "./ExchangeFilters";
import {
  TrendingUp,
  RefreshCw,
  Clock,
  LayoutGrid,
  List,
  Table2,
  Loader2,
} from "lucide-react";
import { AdBanner } from "@/components/ads";
import { trackAssetSwitch, trackFilterChange } from "@/lib/analytics";

const CS: Record<string, string> = {
  USD: "$",
  EUR: "\u20AC",
  ILS: "\u20AA",
  GBP: "\u00A3",
};

const ITEMS_PER_PAGE = 20;

type ViewMode = "list" | "cards" | "table";

export function ComparisonDashboard() {
  const [amount, setAmount] = useState(1000);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [depositMethod, setDepositMethod] =
    useState<DepositMethod>("bank_transfer");
  const [asset, setAsset] = useState<CryptoAsset>("BTC");
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [exchangeData, setExchangeData] = useState<ExchangeData[]>([]);
  const [totalDiscovered, setTotalDiscovered] = useState(0);
  const [totalResponsive, setTotalResponsive] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<ExchangeRegion | "All">("All");
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortOption>("best_price");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [selectedExchangeIds, setSelectedExchangeIds] = useState<Set<string>>(new Set());
  const [cexDexFilter, setCexDexFilter] = useState<CexDexFilter>("all");
  const [currencyPairFilter, setCurrencyPairFilter] = useState<CurrencyPairFilter>("all");
  const [platformTypeFilter, setPlatformTypeFilter] = useState<PlatformTypeFilter>("all");
  const [depositMethodFilter, setDepositMethodFilter] = useState<DepositMethodFilter>("all");

  // Analytics-tracked state setters
  const handleAssetChange = useCallback((a: CryptoAsset) => {
    setAsset(a);
    trackAssetSwitch(a);
  }, []);

  const handleCurrencyChange = useCallback((c: Currency) => {
    setCurrency(c);
    trackFilterChange("currency", c);
  }, []);

  const handleDepositMethodChange = useCallback((m: DepositMethod) => {
    setDepositMethod(m);
    trackFilterChange("deposit_method", m);
  }, []);

  const handleRegionChange = useCallback((r: ExchangeRegion | "All") => {
    setSelectedRegion(r);
    trackFilterChange("region", r);
  }, []);

  const handleCexDexChange = useCallback((f: CexDexFilter) => {
    setCexDexFilter(f);
    trackFilterChange("cex_dex", f);
  }, []);

  const handlePlatformTypeChange = useCallback((f: PlatformTypeFilter) => {
    setPlatformTypeFilter(f);
    trackFilterChange("platform_type", f);
  }, []);

  const handleDepositMethodFilterChange = useCallback((f: DepositMethodFilter) => {
    setDepositMethodFilter(f);
    trackFilterChange("deposit_method_filter", f);
  }, []);

  const fetchData = useCallback(async () => {
    if (amount <= 0) return;
    setIsLoading(true);
    setError(null);

    try {
      // Fetch both comparison data and market data in parallel
      const [compareRes, marketRes] = await Promise.allSettled([
        fetch(
          `/api/compare?${new URLSearchParams({
            amount: String(amount),
            currency,
            depositMethod,
            mode: "buy",
          })}`
        ),
        fetch(`/api/market-data?amount=${encodeURIComponent(String(amount))}&asset=${encodeURIComponent(asset)}`),
      ]);

      // Process comparison results
      if (
        compareRes.status === "fulfilled" &&
        compareRes.value.ok
      ) {
        const data: ComparisonResponse = await compareRes.value.json();
        setResults(data.results);
        setLastUpdated(new Date(data.timestamp));
      }

      // Process market data results
      if (marketRes.status === "fulfilled" && marketRes.value.ok) {
        const data: MarketDataApiResponse = await marketRes.value.json();
        setExchangeData(data.exchanges);
        setTotalDiscovered(data.totalDiscovered);
        setTotalResponsive(data.totalResponsive);
        if (
          compareRes.status !== "fulfilled" ||
          !compareRes.value.ok
        ) {
          setLastUpdated(new Date(data.timestamp));
        }
      }

      // If both failed
      if (
        (compareRes.status !== "fulfilled" ||
          !compareRes.value.ok) &&
        (marketRes.status !== "fulfilled" || !marketRes.value.ok)
      ) {
        setError("Unable to fetch prices. Please try again.");
      }
    } catch {
      setError("Unable to fetch prices. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [amount, currency, depositMethod, asset]);

  useEffect(() => {
    const t = setTimeout(fetchData, 300);
    return () => clearTimeout(t);
  }, [fetchData]);

  useEffect(() => {
    const i = setInterval(fetchData, 30000);
    return () => clearInterval(i);
  }, [fetchData]);

  // ─── Exchange Selection Helpers ───────────────────────────────────

  const toggleExchange = useCallback((exchangeId: string) => {
    setSelectedExchangeIds((prev) => {
      const next = new Set(prev);
      if (next.has(exchangeId)) {
        next.delete(exchangeId);
      } else {
        next.add(exchangeId);
      }
      return next;
    });
  }, []);

  const selectAllVisible = useCallback((exchangeIds: string[]) => {
    setSelectedExchangeIds(new Set(exchangeIds));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedExchangeIds(new Set());
  }, []);

  // ─── Filtering & Sorting Logic ─────────────────────────────────────

  const filteredExchanges = useMemo(() => {
    let filtered = [...exchangeData];

    // Featured only filter
    if (showFeaturedOnly) {
      filtered = filtered.filter((e) => e.featured);
    }

    // Only show exchanges with OK status (hide errored ones unless featured)
    filtered = filtered.filter((e) => e.status === "ok" || e.featured);

    // Region filter
    if (selectedRegion !== "All") {
      filtered = filtered.filter((e) => e.region === selectedRegion);
    }

    // CEX/DEX filter
    if (cexDexFilter === "cex") {
      filtered = filtered.filter((e) => !e.isDex);
    } else if (cexDexFilter === "dex") {
      filtered = filtered.filter((e) => e.isDex);
    }

    // Currency pair filter (USD vs EUR)
    if (currencyPairFilter === "usd") {
      filtered = filtered.filter((e) => {
        const quote = e.tradingPair.split("/")[1] || "";
        return quote === "USD" || quote === "USDT" || quote === "USDC" || quote === "BUSD" || quote === "NIS" || quote === "ILS";
      });
    } else if (currencyPairFilter === "eur") {
      filtered = filtered.filter((e) => {
        const quote = e.tradingPair.split("/")[1] || "";
        return quote === "EUR";
      });
    }

    // Platform type filter (exchange vs broker)
    if (platformTypeFilter === "exchange") {
      filtered = filtered.filter((e) => e.platformType === "exchange");
    } else if (platformTypeFilter === "broker") {
      filtered = filtered.filter((e) => e.platformType === "broker");
    }

    // Deposit method filter
    if (depositMethodFilter !== "all") {
      filtered = filtered.filter((e) => {
        if (e.depositMethods.length === 0) return false;
        switch (depositMethodFilter) {
          case "bank_transfer":
            return e.depositMethods.some((m) => m.toLowerCase().includes("bank transfer"));
          case "credit_card":
            return e.depositMethods.some((m) => m.toLowerCase().includes("credit card") || m.toLowerCase().includes("debit card"));
          case "crypto":
            return e.depositMethods.some((m) => m.toLowerCase() === "crypto");
          case "cash_p2p":
            return e.depositMethods.some((m) => m.toLowerCase() === "cash" || m.toLowerCase() === "p2p");
          default:
            return true;
        }
      });
    }

    // Country filter
    if (selectedCountry !== "All") {
      filtered = filtered.filter((e) => e.country === selectedCountry);
    }

    // Manual exchange selection filter
    if (selectedExchangeIds.size > 0) {
      filtered = filtered.filter((e) => selectedExchangeIds.has(e.id));
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q) ||
          e.country.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case "best_price":
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.price == null && b.price == null) return 0;
          if (a.price == null) return 1;
          if (b.price == null) return -1;
          return a.price - b.price;
        });
        break;
      case "lowest_fees":
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          const costA = a.fees.takerFee + (a.orderBook?.spreadPercent ?? 0);
          const costB = b.fees.takerFee + (b.orderBook?.spreadPercent ?? 0);
          return costA - costB;
        });
        break;
      case "highest_volume":
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          const depthA = a.orderBook
            ? a.orderBook.bidDepth + a.orderBook.askDepth
            : 0;
          const depthB = b.orderBook
            ? b.orderBook.bidDepth + b.orderBook.askDepth
            : 0;
          return depthB - depthA;
        });
        break;
      case "alphabetical":
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.name.localeCompare(b.name);
        });
        break;
    }

    return filtered;
  }, [exchangeData, searchQuery, selectedRegion, selectedCountry, sortBy, showFeaturedOnly, selectedExchangeIds, cexDexFilter, currencyPairFilter, platformTypeFilter, depositMethodFilter]);

  // Pagination
  const displayedExchanges = useMemo(() => {
    if (showAll || filteredExchanges.length <= ITEMS_PER_PAGE) {
      return filteredExchanges;
    }
    return filteredExchanges.slice(0, ITEMS_PER_PAGE);
  }, [filteredExchanges, showAll]);

  const hasMore = filteredExchanges.length > ITEMS_PER_PAGE && !showAll;

  // Filter comparison results by selected exchanges (so list view also respects picker)
  const filteredResults = useMemo(() => {
    if (selectedExchangeIds.size === 0) return results;
    return results.filter((r) => selectedExchangeIds.has(r.exchangeId));
  }, [results, selectedExchangeIds]);

  const savings =
    filteredResults.length > 1
      ? filteredResults[filteredResults.length - 1].totalCostDollar -
        filteredResults[0].totalCostDollar
      : 0;
  const sym = CS[currency] || "$";

  const hasExchangeData = exchangeData.length > 0;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
          Compare {ASSET_CONFIG[asset].name} ROI
          <br />
          <span className="text-gold">Across Exchanges</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Find the cheapest way to buy {ASSET_CONFIG[asset].name}. Real-time comparison across{" "}
          {totalResponsive > 0
            ? `${totalResponsive}+ exchanges`
            : "all major exchanges"}{" "}
          with live exchange data.
        </p>
      </div>

      {/* Amount Input */}
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-black/20">
          <AmountInput
            amount={amount}
            currency={currency}
            depositMethod={depositMethod}
            asset={asset}
            onAssetChange={handleAssetChange}
            onAmountChange={setAmount}
            onCurrencyChange={handleCurrencyChange}
            onDepositMethodChange={handleDepositMethodChange}
            exchanges={exchangeData.filter((e) => e.status === "ok" || e.featured)}
            selectedExchangeIds={selectedExchangeIds}
            onToggleExchange={toggleExchange}
            onSelectAll={selectAllVisible}
            onClearSelection={clearSelection}
          />
        </div>
      </div>

      {/* Savings banner */}
      {savings > 0 && !isLoading && (
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="rounded-xl bg-gradient-to-r from-success/10 to-gold/10 border border-success/20 p-4 flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-success" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Save up to {sym}
                {savings.toFixed(2)} on a {sym}
                {amount.toLocaleString()} purchase
              </p>
              <p className="text-xs text-muted-foreground">
                Best exchange saves{" "}
                {((savings / amount) * 100).toFixed(2)}% in fees
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Fee Summary Bar */}
      {hasExchangeData && !isLoading && (
        <div className="max-w-6xl mx-auto animate-fade-in">
          <FeeSummaryBar exchanges={exchangeData} />
        </div>
      )}

      {/* Ad Banner — between summary and exchange list */}
      <div className="max-w-6xl mx-auto">
        <AdBanner />
      </div>

      {/* Controls bar */}
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {lastUpdated && (
            <span>Updated {lastUpdated.toLocaleTimeString()}</span>
          )}
          {hasExchangeData && (
            <span className="ml-2 px-1.5 py-0.5 rounded bg-crypto-green/10 text-crypto-green text-[10px] font-medium">
              Live
            </span>
          )}
          {totalDiscovered > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded bg-muted text-[10px]">
              {totalResponsive}/{totalDiscovered} responding
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded transition-colors ${viewMode === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              aria-label="List view"
              title="Cost comparison (list)"
            >
              <List className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`p-1.5 rounded transition-colors ${viewMode === "cards" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              aria-label="Card view"
              title="Detailed cards"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded transition-colors ${viewMode === "table" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              aria-label="Table view"
              title="Comparison table"
            >
              <Table2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-50"
            aria-label="Refresh"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
            />{" "}
            Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div role="alert" className="max-w-6xl mx-auto rounded-xl bg-danger/10 border border-danger/20 p-4 text-sm text-danger">
          {error}
        </div>
      )}

      {/* Exchange Filters (shown for detailed views) */}
      {hasExchangeData && viewMode !== "list" && (
        <div className="max-w-6xl mx-auto">
          <ExchangeFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            cexDexFilter={cexDexFilter}
            onCexDexFilterChange={handleCexDexChange}
            currencyPairFilter={currencyPairFilter}
            onCurrencyPairFilterChange={setCurrencyPairFilter}
            platformTypeFilter={platformTypeFilter}
            onPlatformTypeFilterChange={handlePlatformTypeChange}
            depositMethodFilter={depositMethodFilter}
            onDepositMethodFilterChange={handleDepositMethodFilterChange}
            sortBy={sortBy}
            onSortChange={setSortBy}
            showFeaturedOnly={showFeaturedOnly}
            onToggleFeatured={() => setShowFeaturedOnly(!showFeaturedOnly)}
            totalExchanges={exchangeData.length}
            visibleExchanges={filteredExchanges.length}
            responsiveExchanges={totalResponsive}
            allExchanges={exchangeData.filter((e) => e.status === "ok" || e.featured)}
            selectedExchangeIds={selectedExchangeIds}
            onToggleExchange={toggleExchange}
            onSelectAllVisible={() =>
              selectAllVisible(
                filteredExchanges.map((e) => e.id)
              )
            }
            onClearSelection={clearSelection}
          />
        </div>
      )}

      {/* Loading indicator for initial load */}
      {isLoading && exchangeData.length === 0 && (
        <div aria-busy="true" aria-live="polite" className="max-w-6xl mx-auto flex items-center justify-center py-12 gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          <span>Fetching prices from exchanges...</span>
        </div>
      )}

      {/* Main content area */}
      <div className="max-w-6xl mx-auto">
        {viewMode === "list" && (
          <ComparisonTable
            results={filteredResults}
            currency={currency}
            amount={amount}
            isLoading={isLoading}
          />
        )}
        {viewMode === "cards" && hasExchangeData && (
          <ExchangeCardView
            exchanges={displayedExchanges}
            investmentAmount={amount}
          />
        )}
        {viewMode === "cards" && !hasExchangeData && !isLoading && (
          <ComparisonTable
            results={filteredResults}
            currency={currency}
            amount={amount}
            isLoading={isLoading}
          />
        )}
        {viewMode === "table" && hasExchangeData && (
          <ExchangeComparisonTable
            exchanges={displayedExchanges}
            investmentAmount={amount}
          />
        )}
        {viewMode === "table" && !hasExchangeData && !isLoading && (
          <ComparisonTable
            results={filteredResults}
            currency={currency}
            amount={amount}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Show More / Show Less button */}
      {hasExchangeData && viewMode !== "list" && (
        <div className="max-w-6xl mx-auto text-center">
          {hasMore && (
            <button
              onClick={() => setShowAll(true)}
              className="px-6 py-2.5 rounded-lg text-sm font-medium bg-muted text-foreground border border-border hover:border-gold/30 transition-all"
            >
              Show All {filteredExchanges.length} Exchanges
              <span className="text-xs text-muted-foreground ml-2">
                (showing top {ITEMS_PER_PAGE})
              </span>
            </button>
          )}
          {showAll && filteredExchanges.length > ITEMS_PER_PAGE && (
            <button
              onClick={() => setShowAll(false)}
              className="px-6 py-2.5 rounded-lg text-sm font-medium bg-muted text-foreground border border-border hover:border-gold/30 transition-all"
            >
              Show Top {ITEMS_PER_PAGE} Only
            </button>
          )}
        </div>
      )}

      {/* Data source attribution */}
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-xs text-muted-foreground/60">
          {hasExchangeData
            ? `Live prices across ${totalResponsive} exchanges. Fee data verified for featured exchanges. CoinGecko as fallback.`
            : "Prices from CoinGecko. Fee data may vary."}{" "}
          Not financial advice.
        </p>
      </div>
    </div>
  );
}
