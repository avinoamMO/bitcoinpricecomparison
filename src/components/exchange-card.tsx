'use client';

import { useState } from 'react';
import { ExchangeData } from '@/lib/types';

function formatPrice(price: number | null, pair: string): string {
  if (price == null) return 'N/A';
  const currency = pair.split('/')[1] || 'USD';
  if (currency === 'ILS') {
    return `${price.toLocaleString('he-IL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ILS`;
  }
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatBTC(amount: number | null): string {
  if (amount == null) return 'N/A';
  return `${amount} BTC`;
}

function formatPercent(value: number): string {
  return `${value}%`;
}

interface ExchangeCardProps {
  exchange: ExchangeData;
  bestPrice: number | null;
  investmentAmount: number;
}

export function ExchangeCard({ exchange, bestPrice, investmentAmount }: ExchangeCardProps) {
  const [showTiers, setShowTiers] = useState(false);

  const priceDiff =
    exchange.price != null && bestPrice != null && bestPrice > 0
      ? ((exchange.price - bestPrice) / bestPrice) * 100
      : null;

  const takerCost = investmentAmount * (exchange.fees.takerFee / 100);
  const makerCost = investmentAmount * (exchange.fees.makerFee / 100);
  const spreadCost = exchange.orderBook != null
    ? investmentAmount * (exchange.orderBook.spreadPercent / 100)
    : 0;
  const totalEffectiveCostTaker = takerCost + spreadCost;
  const totalEffectiveCostMaker = makerCost + spreadCost;

  const isIsraeli = exchange.israeliExchange;
  const borderColor = isIsraeli ? 'border-crypto-blue' : 'border-border';
  const statusColor = exchange.status === 'ok' ? 'bg-crypto-green' : 'bg-crypto-red';

  return (
    <div className={`rounded-xl border-2 ${borderColor} bg-card p-5 flex flex-col gap-4 transition-all hover:border-gold/30`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-foreground">{exchange.name}</h3>
            <span className={`w-2 h-2 rounded-full ${statusColor}`} title={exchange.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            {exchange.country}
            {isIsraeli && (
              <span className="ml-2 text-xs bg-crypto-blue text-white px-2 py-0.5 rounded-full">
                Israeli Exchange
              </span>
            )}
          </p>
        </div>
        <a href={exchange.feePageUrl} target="_blank" rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-foreground underline">
          Fee page
        </a>
      </div>

      <div className="bg-muted rounded-lg p-4">
        <div className="text-sm text-muted-foreground mb-1">Price ({exchange.tradingPair})</div>
        <div className="flex items-end gap-3">
          <span className="text-2xl font-mono font-bold text-foreground">
            {formatPrice(exchange.price, exchange.tradingPair)}
          </span>
          {priceDiff != null && (
            <span className={`text-sm font-mono ${priceDiff === 0 ? 'text-crypto-green' : priceDiff > 0 ? 'text-crypto-red' : 'text-crypto-green'}`}>
              {priceDiff > 0 ? '+' : ''}{priceDiff.toFixed(3)}% vs best
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted rounded-lg p-3">
          <div className="text-xs text-muted-foreground">Taker Fee</div>
          <div className="text-lg font-mono font-semibold text-gold">{formatPercent(exchange.fees.takerFee)}</div>
          <div className="text-xs text-muted-foreground">Market orders</div>
        </div>
        <div className="bg-muted rounded-lg p-3">
          <div className="text-xs text-muted-foreground">Maker Fee</div>
          <div className="text-lg font-mono font-semibold text-crypto-green">{formatPercent(exchange.fees.makerFee)}</div>
          <div className="text-xs text-muted-foreground">Limit orders</div>
        </div>
        <div className="bg-muted rounded-lg p-3">
          <div className="text-xs text-muted-foreground">BTC Withdrawal</div>
          <div className="text-sm font-mono font-semibold text-gold-light">{formatBTC(exchange.fees.withdrawalFeeBTC)}</div>
        </div>
        <div className="bg-muted rounded-lg p-3">
          <div className="text-xs text-muted-foreground">Spread</div>
          <div className="text-sm font-mono font-semibold text-crypto-purple">
            {exchange.orderBook ? `${exchange.orderBook.spreadPercent.toFixed(4)}%` : 'N/A'}
          </div>
          {exchange.orderBook && (
            <div className="text-xs text-muted-foreground">${exchange.orderBook.spreadUSD.toFixed(2)}</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div><span className="text-muted-foreground">Fiat Deposit: </span><span className="text-foreground">{exchange.fees.fiatDepositFee}</span></div>
        <div><span className="text-muted-foreground">Fiat Withdrawal: </span><span className="text-foreground">{exchange.fees.fiatWithdrawalFee}</span></div>
      </div>

      <div className="bg-muted/50 border border-border rounded-lg p-3">
        <div className="text-xs text-muted-foreground mb-2">Effective cost on ${investmentAmount.toLocaleString()} trade</div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-muted-foreground">Market: </span><span className="font-mono text-gold">${totalEffectiveCostTaker.toFixed(2)}</span></div>
          <div><span className="text-muted-foreground">Limit: </span><span className="font-mono text-crypto-green">${totalEffectiveCostMaker.toFixed(2)}</span></div>
        </div>
      </div>

      {exchange.orderBook && (
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div><span className="text-muted-foreground">Bid depth (top 10): </span><span className="text-crypto-green font-mono">{exchange.orderBook.bidDepth.toFixed(4)} BTC</span></div>
          <div><span className="text-muted-foreground">Ask depth (top 10): </span><span className="text-crypto-red font-mono">{exchange.orderBook.askDepth.toFixed(4)} BTC</span></div>
        </div>
      )}

      {exchange.fees.feeTiers.length > 1 && (
        <div>
          <button onClick={() => setShowTiers(!showTiers)}
            className="text-xs text-crypto-blue hover:text-crypto-blue/80 flex items-center gap-1">
            <span>{showTiers ? 'Hide' : 'Show'} volume discounts</span>
            <span className="text-[10px]">{showTiers ? '\u25B2' : '\u25BC'}</span>
          </button>
          {showTiers && (
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead><tr className="text-muted-foreground border-b border-border">
                  <th className="py-1 pr-3">Tier</th><th className="py-1 pr-3">Taker</th><th className="py-1">Maker</th>
                </tr></thead>
                <tbody>
                  {exchange.fees.feeTiers.map((tier, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-1 pr-3 text-foreground">{tier.tierLabel}</td>
                      <td className="py-1 pr-3 font-mono text-gold">{tier.takerFee}%</td>
                      <td className="py-1 font-mono text-crypto-green">{tier.makerFee}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {exchange.error && (
        <div className="text-xs text-crypto-red bg-crypto-red/10 p-2 rounded">{exchange.error}</div>
      )}

      <div className="text-[10px] text-muted-foreground/50">
        Updated: {new Date(exchange.fetchedAt).toLocaleTimeString()}
      </div>
    </div>
  );
}
