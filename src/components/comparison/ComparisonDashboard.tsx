"use client";
import { useState, useEffect, useCallback } from "react";
import { ComparisonResult, ComparisonResponse, Currency, DepositMethod } from "@/types";
import { AmountInput } from "./AmountInput";
import { ComparisonTable } from "./ComparisonTable";
import { TrendingUp, RefreshCw, Clock } from "lucide-react";
const CS: Record<string, string> = { USD: "$", EUR: "\u20AC", ILS: "\u20AA", GBP: "\u00A3" };

export function ComparisonDashboard() {
  const [amount, setAmount] = useState(1000);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [depositMethod, setDepositMethod] = useState<DepositMethod>("bank_transfer");
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchComparison = useCallback(async () => {
    if (amount <= 0) return;
    setIsLoading(true); setError(null);
    try {
      const p = new URLSearchParams({ amount: String(amount), currency, depositMethod, mode: "buy" });
      const res = await fetch(`/api/compare?${p}`);
      if (!res.ok) throw new Error("Failed");
      const data: ComparisonResponse = await res.json();
      setResults(data.results); setLastUpdated(new Date(data.timestamp));
    } catch { setError("Unable to fetch prices. Please try again."); }
    finally { setIsLoading(false); }
  }, [amount, currency, depositMethod]);

  useEffect(() => { const t = setTimeout(fetchComparison, 300); return () => clearTimeout(t); }, [fetchComparison]);
  useEffect(() => { const i = setInterval(fetchComparison, 30000); return () => clearInterval(i); }, [fetchComparison]);

  const savings = results.length > 1 ? results[results.length - 1].totalCostDollar - results[0].totalCostDollar : 0;
  const sym = CS[currency] || "$";

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">Compare Bitcoin ROI<br/><span className="text-gold">Across Exchanges</span></h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Find the cheapest way to buy Bitcoin. Real-time comparison across 7 exchanges.</p>
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-black/20">
          <AmountInput amount={amount} currency={currency} depositMethod={depositMethod} onAmountChange={setAmount} onCurrencyChange={setCurrency} onDepositMethodChange={setDepositMethod}/>
        </div>
      </div>
      {savings > 0 && !isLoading && (
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="rounded-xl bg-gradient-to-r from-success/10 to-gold/10 border border-success/20 p-4 flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-success/20 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-success"/></div>
            <div><p className="text-sm font-semibold text-foreground">Save up to {sym}{savings.toFixed(2)} on a {sym}{amount.toLocaleString()} purchase</p><p className="text-xs text-muted-foreground">Best exchange saves {((savings/amount)*100).toFixed(2)}% in fees</p></div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5"/>{lastUpdated && <span>Updated {lastUpdated.toLocaleTimeString()}</span>}</div>
        <button onClick={fetchComparison} disabled={isLoading} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-50" aria-label="Refresh"><RefreshCw className={`h-3.5 w-3.5 ${isLoading?"animate-spin":""}`}/> Refresh</button>
      </div>
      {error && <div className="max-w-4xl mx-auto rounded-xl bg-danger/10 border border-danger/20 p-4 text-sm text-danger">{error}</div>}
      <div className="max-w-4xl mx-auto"><ComparisonTable results={results} currency={currency} amount={amount} isLoading={isLoading}/></div>
      <div className="max-w-4xl mx-auto text-center"><p className="text-xs text-muted-foreground/60">Prices from CoinGecko. Fee data may vary. Not financial advice.</p></div>
    </div>
  );
}
