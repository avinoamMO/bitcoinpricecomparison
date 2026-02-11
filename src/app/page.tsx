'use client';

import { useState, useEffect, useCallback } from 'react';
import { ExchangeData, ExchangeApiResponse } from '@/lib/types';
import { ExchangeCard } from '@/components/exchange-card';
import { ComparisonTable } from '@/components/comparison-table';
import { FeeSummary } from '@/components/fee-summary';

type ViewMode = 'cards' | 'table';

export default function HomePage() {
  const [exchanges, setExchanges] = useState<ExchangeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [investmentAmount, setInvestmentAmount] = useState<number>(1000);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/exchanges');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ExchangeApiResponse = await res.json();
      setExchanges(data.exchanges);
      setLastUpdated(data.timestamp);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchData, 30_000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  const bestUSDPrice = (() => {
    const usd = exchanges.filter((e) => e.price != null && !e.tradingPair.includes('ILS'));
    return usd.length ? Math.min(...usd.map((e) => e.price!)) : null;
  })();

  const investmentPresets = [100, 500, 1_000, 5_000, 10_000, 50_000, 100_000];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="text-center py-8 space-y-3">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
          Compare Bitcoin ROI{' '}
          <span className="text-gold">Across Exchanges</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Real-time prices, fees, and spreads via CCXT &mdash; 7 exchanges including Israeli ones.
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-4 flex flex-col gap-6 pb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-card rounded-xl p-4 border border-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <label className="text-sm text-muted-foreground whitespace-nowrap">Investment:</label>
            <div className="flex flex-wrap gap-2">
              {investmentPresets.map((amount) => (
                <button key={amount} onClick={() => setInvestmentAmount(amount)}
                  className={`px-3 py-1 text-xs rounded-lg border transition-colors ${investmentAmount === amount ? 'bg-gold/20 text-gold border-gold/30' : 'bg-muted border-border text-muted-foreground hover:border-gold/30'}`}>
                  ${amount.toLocaleString()}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">$</span>
              <input type="number" value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-28 px-2 py-1 text-sm bg-muted border border-border rounded-lg text-foreground font-mono focus:outline-none focus:border-gold" min={1} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} className="accent-gold" />
              Auto-refresh (30s)
            </label>
            <button onClick={fetchData} disabled={loading}
              className="px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 rounded-lg border border-border disabled:opacity-50 transition-colors">
              {loading ? 'Loading...' : 'Refresh'}
            </button>
            <div className="flex bg-muted rounded-lg border border-border overflow-hidden">
              <button onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 text-xs transition-colors ${viewMode === 'cards' ? 'bg-gold text-black' : 'text-muted-foreground hover:text-foreground'}`}>Cards</button>
              <button onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 text-xs transition-colors ${viewMode === 'table' ? 'bg-gold text-black' : 'text-muted-foreground hover:text-foreground'}`}>Table</button>
            </div>
          </div>
        </div>
        {error && (<div className="bg-danger/10 border border-danger/20 rounded-xl p-4 text-danger text-sm">{error}. Data may be stale or unavailable.</div>)}
        {loading && exchanges.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground text-sm">Fetching real-time data from 7 exchanges...</p>
          </div>
        )}
        {exchanges.length > 0 && <FeeSummary exchanges={exchanges} />}
        {exchanges.length > 0 && viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exchanges.map((exchange) => (
              <ExchangeCard key={exchange.id} exchange={exchange} bestPrice={bestUSDPrice} investmentAmount={investmentAmount} />
            ))}
          </div>
        )}
        {exchanges.length > 0 && viewMode === 'table' && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <ComparisonTable exchanges={exchanges} investmentAmount={investmentAmount} />
          </div>
        )}
        {lastUpdated && (
          <div className="text-center text-xs text-muted-foreground/60 pb-4">
            Last updated: {new Date(lastUpdated).toLocaleString()} | Prices cached 30s | Fees cached 1hr | Powered by{' '}
            <a href="https://github.com/ccxt/ccxt" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground underline">CCXT</a>
          </div>
        )}
      </div>
    </div>
  );
}
