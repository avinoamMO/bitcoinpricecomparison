"use client";
import { useState, useEffect, useCallback } from "react";
import {
  ComparisonResult,
  ComparisonResponse,
  CcxtExchangeData,
  CcxtApiResponse,
  Currency,
  DepositMethod,
} from "@/types";
import { AmountInput } from "./AmountInput";
import { ComparisonTable } from "./ComparisonTable";
import { ExchangeCardView } from "./ExchangeCardView";
import { CcxtComparisonTable } from "./CcxtComparisonTable";
import { FeeSummaryBar } from "./FeeSummaryBar";
import {
  TrendingUp,
  RefreshCw,
  Clock,
  LayoutGrid,
  List,
  Table2,
} from "lucide-react";

const CS: Record<string, string> = {
  USD: "$",
  EUR: "\u20AC",
  ILS: "\u20AA",
  GBP: "\u00A3",
};

type ViewMode = "list" | "cards" | "table";

export function ComparisonDashboard() {
  const [amount, setAmount] = useState(1000);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [depositMethod, setDepositMethod] =
    useState<DepositMethod>("bank_transfer");
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [ccxtData, setCcxtData] = useState<CcxtExchangeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const fetchData = useCallback(async () => {
    if (amount <= 0) return;
    setIsLoading(true);
    setError(null);

    try {
      // Fetch both comparison data and CCXT data in parallel
      const [compareRes, ccxtRes] = await Promise.allSettled([
        fetch(
          `/api/compare?${new URLSearchParams({
            amount: String(amount),
            currency,
            depositMethod,
            mode: "buy",
          })}`
        ),
        fetch("/api/ccxt"),
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

      // Process CCXT results
      if (ccxtRes.status === "fulfilled" && ccxtRes.value.ok) {
        const data: CcxtApiResponse = await ccxtRes.value.json();
        setCcxtData(data.exchanges);
        // If comparison failed but CCXT succeeded, still update timestamp
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
        (ccxtRes.status !== "fulfilled" || !ccxtRes.value.ok)
      ) {
        setError("Unable to fetch prices. Please try again.");
      }
    } catch {
      setError("Unable to fetch prices. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [amount, currency, depositMethod]);

  useEffect(() => {
    const t = setTimeout(fetchData, 300);
    return () => clearTimeout(t);
  }, [fetchData]);

  useEffect(() => {
    const i = setInterval(fetchData, 30000);
    return () => clearInterval(i);
  }, [fetchData]);

  const savings =
    results.length > 1
      ? results[results.length - 1].totalCostDollar -
        results[0].totalCostDollar
      : 0;
  const sym = CS[currency] || "$";

  const hasCcxtData = ccxtData.length > 0;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
          Compare Bitcoin ROI
          <br />
          <span className="text-gold">Across Exchanges</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Find the cheapest way to buy Bitcoin. Real-time comparison across
          7 exchanges with live CCXT data.
        </p>
      </div>

      {/* Amount Input */}
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-black/20">
          <AmountInput
            amount={amount}
            currency={currency}
            depositMethod={depositMethod}
            onAmountChange={setAmount}
            onCurrencyChange={setCurrency}
            onDepositMethodChange={setDepositMethod}
          />
        </div>
      </div>

      {/* Savings banner */}
      {savings > 0 && !isLoading && (
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="rounded-xl bg-gradient-to-r from-success/10 to-gold/10 border border-success/20 p-4 flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-success" />
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

      {/* Fee Summary Bar (CCXT data) */}
      {hasCcxtData && !isLoading && (
        <div className="max-w-6xl mx-auto animate-fade-in">
          <FeeSummaryBar exchanges={ccxtData} />
        </div>
      )}

      {/* Controls bar */}
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {lastUpdated && (
            <span>Updated {lastUpdated.toLocaleTimeString()}</span>
          )}
          {hasCcxtData && (
            <span className="ml-2 px-1.5 py-0.5 rounded bg-crypto-green/10 text-crypto-green text-[10px] font-medium">
              CCXT Live
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
              title="Detailed cards (CCXT)"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded transition-colors ${viewMode === "table" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              aria-label="Table view"
              title="Comparison table (CCXT)"
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
        <div className="max-w-6xl mx-auto rounded-xl bg-danger/10 border border-danger/20 p-4 text-sm text-danger">
          {error}
        </div>
      )}

      {/* Main content area */}
      <div className="max-w-6xl mx-auto">
        {viewMode === "list" && (
          <ComparisonTable
            results={results}
            currency={currency}
            amount={amount}
            isLoading={isLoading}
          />
        )}
        {viewMode === "cards" && hasCcxtData && (
          <ExchangeCardView
            exchanges={ccxtData}
            investmentAmount={amount}
          />
        )}
        {viewMode === "cards" && !hasCcxtData && (
          <ComparisonTable
            results={results}
            currency={currency}
            amount={amount}
            isLoading={isLoading}
          />
        )}
        {viewMode === "table" && hasCcxtData && (
          <CcxtComparisonTable
            exchanges={ccxtData}
            investmentAmount={amount}
          />
        )}
        {viewMode === "table" && !hasCcxtData && (
          <ComparisonTable
            results={results}
            currency={currency}
            amount={amount}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Data source attribution */}
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-xs text-muted-foreground/60">
          {hasCcxtData
            ? "Live prices from CCXT (exchange APIs). Fee data verified against exchange fee pages. CoinGecko as fallback."
            : "Prices from CoinGecko. Fee data may vary."}{" "}
          Not financial advice.
        </p>
      </div>
    </div>
  );
}
