'use client';

import { ExchangeData } from '@/lib/types';

interface FeeSummaryProps {
  exchanges: ExchangeData[];
}

interface WinnerInfo {
  category: string;
  winner: string;
  value: string;
  description: string;
}

export function FeeSummary({ exchanges }: FeeSummaryProps) {
  const validExchanges = exchanges.filter((e) => e.status === 'ok');
  if (validExchanges.length === 0) return null;

  const winners: WinnerInfo[] = [];

  const bestTaker = [...validExchanges].sort((a, b) => a.fees.takerFee - b.fees.takerFee)[0];
  winners.push({ category: 'Lowest Taker Fee', winner: bestTaker.name, value: `${bestTaker.fees.takerFee}%`, description: 'Best for market orders' });

  const bestMaker = [...validExchanges].sort((a, b) => a.fees.makerFee - b.fees.makerFee)[0];
  winners.push({ category: 'Lowest Maker Fee', winner: bestMaker.name, value: `${bestMaker.fees.makerFee}%`, description: 'Best for limit orders' });

  const withSpread = validExchanges.filter((e) => e.orderBook != null);
  if (withSpread.length > 0) {
    const bestSpread = [...withSpread].sort((a, b) => (a.orderBook?.spreadPercent ?? Infinity) - (b.orderBook?.spreadPercent ?? Infinity))[0];
    winners.push({ category: 'Tightest Spread', winner: bestSpread.name, value: `${bestSpread.orderBook!.spreadPercent.toFixed(4)}%`, description: 'Lowest bid-ask difference' });
  }

  const withWithdrawal = validExchanges.filter((e) => e.fees.withdrawalFeeBTC != null);
  if (withWithdrawal.length > 0) {
    const bestWithdrawal = [...withWithdrawal].sort((a, b) => (a.fees.withdrawalFeeBTC ?? Infinity) - (b.fees.withdrawalFeeBTC ?? Infinity))[0];
    winners.push({ category: 'Lowest BTC Withdrawal', winner: bestWithdrawal.name, value: `${bestWithdrawal.fees.withdrawalFeeBTC} BTC`, description: 'Cheapest to move BTC out' });
  }

  const usdExchanges = validExchanges.filter((e) => e.price != null && !e.tradingPair.includes('ILS'));
  if (usdExchanges.length > 0) {
    const bestPrice = [...usdExchanges].sort((a, b) => a.price! - b.price!)[0];
    winners.push({ category: 'Best USD Price', winner: bestPrice.name, value: `$${bestPrice.price!.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, description: 'Lowest BTC buy price' });
  }

  if (withSpread.length > 0) {
    const deepest = [...withSpread].sort((a, b) => (b.orderBook!.bidDepth + b.orderBook!.askDepth) - (a.orderBook!.bidDepth + a.orderBook!.askDepth))[0];
    winners.push({ category: 'Deepest Liquidity', winner: deepest.name, value: `${(deepest.orderBook!.bidDepth + deepest.orderBook!.askDepth).toFixed(2)} BTC`, description: 'Top 10 levels combined' });
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {winners.map((w) => (
        <div key={w.category} className="bg-card rounded-lg p-3 border border-border">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{w.category}</div>
          <div className="text-sm font-bold text-foreground truncate">{w.winner}</div>
          <div className="text-lg font-mono font-bold text-crypto-green">{w.value}</div>
          <div className="text-[10px] text-muted-foreground mt-1">{w.description}</div>
        </div>
      ))}
    </div>
  );
}
