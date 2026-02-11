'use client';

import { ExchangeData } from '@/lib/types';

interface ComparisonTableProps {
  exchanges: ExchangeData[];
  investmentAmount: number;
}

export function ComparisonTable({ exchanges, investmentAmount }: ComparisonTableProps) {
  const usdExchanges = exchanges.filter((e) => e.price != null && !e.tradingPair.includes('ILS'));
  const ilsExchanges = exchanges.filter((e) => e.tradingPair.includes('ILS'));
  const bestUSDPrice = usdExchanges.length ? Math.min(...usdExchanges.map((e) => e.price!)) : null;

  const sorted = [...exchanges].sort((a, b) => {
    const costA = a.fees.takerFee + (a.orderBook?.spreadPercent ?? 0);
    const costB = b.fees.takerFee + (b.orderBook?.spreadPercent ?? 0);
    return costA - costB;
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="border-b-2 border-border text-muted-foreground text-xs uppercase tracking-wider">
            <th className="py-3 px-3">#</th>
            <th className="py-3 px-3">Exchange</th>
            <th className="py-3 px-3 text-right">Price</th>
            <th className="py-3 px-3 text-right">Taker</th>
            <th className="py-3 px-3 text-right">Maker</th>
            <th className="py-3 px-3 text-right">Spread</th>
            <th className="py-3 px-3 text-right">BTC Withdrawal</th>
            <th className="py-3 px-3 text-right">Cost on ${investmentAmount.toLocaleString()}</th>
            <th className="py-3 px-3 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((ex, idx) => {
            const isILS = ex.tradingPair.includes('ILS');
            const takerCost = investmentAmount * (ex.fees.takerFee / 100);
            const spreadCost = ex.orderBook ? investmentAmount * (ex.orderBook.spreadPercent / 100) : 0;
            const totalCost = takerCost + spreadCost;
            const priceDiff = ex.price != null && bestUSDPrice != null && !isILS
              ? ((ex.price - bestUSDPrice) / bestUSDPrice) * 100 : null;

            return (
              <tr key={ex.id} className={`border-b border-border/50 hover:bg-muted/50 transition-colors ${ex.israeliExchange ? 'bg-crypto-blue/5' : ''}`}>
                <td className="py-3 px-3 font-mono text-muted-foreground">{idx + 1}</td>
                <td className="py-3 px-3">
                  <div className="font-semibold text-foreground">{ex.name}</div>
                  <div className="text-xs text-muted-foreground">{ex.country}</div>
                </td>
                <td className="py-3 px-3 text-right font-mono">
                  {ex.price != null ? (
                    <div>
                      <div className="text-foreground">
                        {isILS ? `${ex.price.toLocaleString('he-IL', { maximumFractionDigits: 0 })} ILS`
                          : `$${ex.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                      </div>
                      {priceDiff != null && priceDiff !== 0 && (
                        <div className={`text-[10px] ${priceDiff > 0 ? 'text-crypto-red' : 'text-crypto-green'}`}>
                          {priceDiff > 0 ? '+' : ''}{priceDiff.toFixed(3)}%
                        </div>
                      )}
                    </div>
                  ) : <span className="text-muted-foreground">N/A</span>}
                </td>
                <td className="py-3 px-3 text-right font-mono text-gold">{ex.fees.takerFee}%</td>
                <td className="py-3 px-3 text-right font-mono text-crypto-green">{ex.fees.makerFee}%</td>
                <td className="py-3 px-3 text-right font-mono text-crypto-purple">
                  {ex.orderBook ? `${ex.orderBook.spreadPercent.toFixed(4)}%` : 'N/A'}
                </td>
                <td className="py-3 px-3 text-right font-mono text-gold-light">
                  {ex.fees.withdrawalFeeBTC != null ? `${ex.fees.withdrawalFeeBTC} BTC` : 'N/A'}
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-foreground">${totalCost.toFixed(2)}</td>
                <td className="py-3 px-3 text-center">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${ex.status === 'ok' ? 'bg-crypto-green' : 'bg-crypto-red'}`}
                    title={ex.status === 'ok' ? 'Live' : ex.error ?? 'Error'} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {ilsExchanges.length > 0 && (
        <p className="text-xs text-muted-foreground mt-2 px-3">
          * Israeli exchanges show ILS prices. Price comparison percentages are only shown for USD-denominated pairs.
        </p>
      )}
    </div>
  );
}
