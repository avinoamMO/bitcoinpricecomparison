"use client";
import { ComparisonResult } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Trophy, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { getExchangeById } from "@/data/exchanges";
const CS: Record<string, string> = { USD: "$", EUR: "\u20AC", ILS: "\u20AA", GBP: "\u00A3" };
interface Props { results: ComparisonResult[]; currency: string; amount: number; isLoading: boolean; }
function Skel() { return (<div className="space-y-3">{[1,2,3,4,5].map(i=><div key={i} className="rounded-xl border border-border bg-card p-5 animate-pulse"><div className="flex items-center gap-4"><div className="w-8 h-8 rounded-full bg-muted"/><div className="flex-1"><div className="h-4 w-32 bg-muted rounded"/></div><div className="h-9 w-24 bg-muted rounded-lg"/></div></div>)}</div>); }
export function ComparisonTable({ results, currency, isLoading }: Props) {
  const [exp, setExp] = useState<string | null>(null);
  const s = CS[currency] || "$";
  if (isLoading) return <Skel />;
  if (!results.length) return <div className="text-center py-12 text-muted-foreground">Enter an amount to compare</div>;
  return (
    <div className="space-y-3">
      {results.map((r, i) => (
        <div key={r.exchangeId} className={`rounded-xl border transition-all duration-300 animate-slide-up ${r.isBestDeal ? "border-gold/50 bg-gold/5 shadow-lg shadow-gold/5" : "border-border bg-card"}`} style={{animationDelay:`${i*50}ms`}}>
          <div className="p-4 sm:p-5 cursor-pointer" onClick={() => setExp(exp === r.exchangeId ? null : r.exchangeId)}>
            <div className="flex items-center gap-4">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${r.isBestDeal ? "bg-gold text-black" : "bg-muted text-muted-foreground"}`}>
                {r.isBestDeal ? <Trophy className="h-4 w-4"/> : r.rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground truncate">{r.exchangeName}</h3>
                  {r.isBestDeal && <Badge variant="default" className="text-[10px] px-2 py-0">BEST DEAL</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{s}{r.btcPrice.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})} / BTC</p>
              </div>
              <div className="hidden sm:flex items-center gap-6">
                <div className="text-right"><p className="text-xs text-muted-foreground">Total Cost</p><p className={`text-sm font-bold ${r.isBestDeal?"text-success":"text-foreground"}`}>{s}{r.totalCostDollar.toFixed(2)}</p><p className="text-[10px] text-muted-foreground">{r.totalCostPercent.toFixed(2)}%</p></div>
                <div className="text-right"><p className="text-xs text-muted-foreground">You Get</p><p className="text-sm font-bold font-mono text-foreground">{r.netBtcReceived.toFixed(8)}</p><p className="text-[10px] text-muted-foreground">BTC</p></div>
                <div className="text-right min-w-[70px]">{r.isBestDeal ? <Badge variant="success" className="text-xs">Cheapest</Badge> : <><p className="text-xs text-muted-foreground">Extra Cost</p><p className="text-sm font-bold text-danger">+{s}{(r.totalCostDollar-results[0].totalCostDollar).toFixed(2)}</p></>}</div>
              </div>
              <div className="sm:hidden text-right"><p className={`text-sm font-bold ${r.isBestDeal?"text-success":"text-foreground"}`}>{s}{r.totalCostDollar.toFixed(2)}</p><p className="text-[10px] text-muted-foreground">total fees</p></div>
              <div className="flex items-center gap-2">
                <a href={r.affiliateUrl} target="_blank" rel="noopener noreferrer" className={`hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${r.isBestDeal?"bg-gold text-black hover:bg-gold-light":"bg-muted text-foreground border border-border"}`} onClick={e=>e.stopPropagation()}>Buy Here <ExternalLink className="h-3.5 w-3.5"/></a>
                <button className="p-1 text-muted-foreground" aria-label="Toggle details">{exp===r.exchangeId?<ChevronUp className="h-4 w-4"/>:<ChevronDown className="h-4 w-4"/>}</button>
              </div>
            </div>
            <div className="sm:hidden mt-3"><a href={r.affiliateUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium ${r.isBestDeal?"bg-gold text-black":"bg-muted text-foreground border border-border"}`} onClick={e=>e.stopPropagation()}>Buy Here <ExternalLink className="h-3.5 w-3.5"/></a></div>
          </div>
          {exp===r.exchangeId && (
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-border/50 pt-4 animate-fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div><p className="text-xs text-muted-foreground">Trading Fee</p><p className="text-sm font-semibold">{s}{r.tradingFeeDollar.toFixed(2)}</p><p className="text-[10px] text-muted-foreground">{r.tradingFeePercent.toFixed(2)}%</p></div>
                <div><p className="text-xs text-muted-foreground">Deposit Fee</p><p className="text-sm font-semibold">{s}{r.depositFeeDollar.toFixed(2)}</p><p className="text-[10px] text-muted-foreground">{r.depositFeePercent.toFixed(2)}%</p></div>
                <div><p className="text-xs text-muted-foreground">Spread</p><p className="text-sm font-semibold">{s}{r.spreadDollar.toFixed(2)}</p><p className="text-[10px] text-muted-foreground">{r.spreadPercent.toFixed(2)}%</p></div>
                <div><p className="text-xs text-muted-foreground">Withdrawal</p><p className="text-sm font-semibold">{s}{r.withdrawalFeeDollar.toFixed(2)}</p><p className="text-[10px] text-muted-foreground font-mono">{r.withdrawalFeeBtc.toFixed(8)} BTC</p></div>
              </div>
              <div className="mt-4"><Link href={`/exchanges/${getExchangeById(r.exchangeId)?.slug ?? r.exchangeId}`} className="text-sm text-gold hover:text-gold-light flex items-center gap-1">Full review <ExternalLink className="h-3 w-3"/></Link></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
