"use client";

import { CcxtExchangeData } from "@/types";
import { ExternalLink, Star, Wifi, WifiOff, AlertTriangle } from "lucide-react";

interface CcxtComparisonTableProps {
  exchanges: CcxtExchangeData[];
  investmentAmount: number;
}

function HealthIndicator({ exchange }: { exchange: CcxtExchangeData }) {
  if (exchange.status === "ok" && exchange.healthStatus === "healthy") {
    return (
      <span
        className="inline-block w-2.5 h-2.5 rounded-full bg-crypto-green"
        title="Live - Healthy"
      />
    );
  }
  if (exchange.healthStatus === "degraded") {
    return (
      <span title={`Degraded - ${exchange.consecutiveFailures} failures`}>
        <AlertTriangle className="h-3.5 w-3.5 text-gold" />
      </span>
    );
  }
  if (exchange.healthStatus === "down") {
    return (
      <span title={`Down - ${exchange.error || "Unreachable"}`}>
        <WifiOff className="h-3.5 w-3.5 text-crypto-red" />
      </span>
    );
  }
  if (exchange.status === "ok") {
    return (
      <span title="Live">
        <Wifi className="h-3.5 w-3.5 text-crypto-green" />
      </span>
    );
  }
  return (
    <span
      className="inline-block w-2.5 h-2.5 rounded-full bg-crypto-red"
      title={exchange.error ?? "Error"}
    />
  );
}

export function CcxtComparisonTable({
  exchanges,
  investmentAmount,
}: CcxtComparisonTableProps) {
  const usdExchanges = exchanges.filter(
    (e) =>
      e.price != null &&
      !e.tradingPair.includes("ILS") &&
      !e.tradingPair.includes("NIS")
  );
  const bestUSDPrice = usdExchanges.length
    ? Math.min(...usdExchanges.map((e) => e.price!))
    : null;

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
            <th className="py-3 px-3 text-right hidden md:table-cell">BTC Withdrawal</th>
            <th className="py-3 px-3 text-right">
              Cost on ${investmentAmount.toLocaleString()}
            </th>
            <th className="py-3 px-3 text-center">Status</th>
            <th className="py-3 px-3"></th>
          </tr>
        </thead>
        <tbody>
          {exchanges.map((ex, idx) => {
            const isILS =
              ex.tradingPair.includes("ILS") ||
              ex.tradingPair.includes("NIS");
            const takerCost =
              investmentAmount * (ex.fees.takerFee / 100);
            const spreadCost = ex.orderBook
              ? investmentAmount * (ex.orderBook.spreadPercent / 100)
              : 0;
            const totalCost = takerCost + spreadCost;
            const priceDiff =
              ex.price != null && bestUSDPrice != null && !isILS
                ? ((ex.price - bestUSDPrice) / bestUSDPrice) * 100
                : null;

            const linkUrl = ex.affiliateUrl || ex.websiteUrl || ex.feePageUrl;

            return (
              <tr
                key={ex.id}
                className={`border-b border-border/50 hover:bg-muted/50 transition-colors ${
                  ex.featured ? "bg-gold/[0.02]" : ""
                } ${ex.israeliExchange ? "bg-crypto-blue/5" : ""}`}
              >
                <td className="py-3 px-3 font-mono text-muted-foreground">
                  <div className="flex items-center gap-1">
                    {idx + 1}
                    {ex.featured && (
                      <span title="Featured exchange">
                        <Star className="h-3 w-3 text-gold fill-gold" />
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-3">
                  <div className="font-semibold text-foreground">
                    {ex.name}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    {ex.country}
                    <span className="text-[10px] px-1 py-0.5 rounded bg-muted text-muted-foreground">
                      {ex.region}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3 text-right font-mono">
                  {ex.price != null ? (
                    <div>
                      <div className="text-foreground">
                        {isILS
                          ? `${ex.price.toLocaleString("he-IL", { maximumFractionDigits: 0 })} ILS`
                          : `$${ex.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                      </div>
                      {priceDiff != null && priceDiff !== 0 && (
                        <div
                          className={`text-[10px] ${priceDiff > 0 ? "text-crypto-red" : "text-crypto-green"}`}
                        >
                          {priceDiff > 0 ? "+" : ""}
                          {priceDiff.toFixed(3)}%
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </td>
                <td className="py-3 px-3 text-right font-mono text-gold">
                  {ex.fees.takerFee}%
                </td>
                <td className="py-3 px-3 text-right font-mono text-crypto-green">
                  {ex.fees.makerFee}%
                </td>
                <td className="py-3 px-3 text-right font-mono text-crypto-purple">
                  {ex.orderBook
                    ? `${ex.orderBook.spreadPercent.toFixed(4)}%`
                    : "N/A"}
                </td>
                <td className="py-3 px-3 text-right font-mono text-gold-light hidden md:table-cell">
                  {ex.fees.withdrawalFeeBTC != null
                    ? `${ex.fees.withdrawalFeeBTC} BTC`
                    : "N/A"}
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-foreground">
                  {ex.price != null ? `$${totalCost.toFixed(2)}` : "N/A"}
                </td>
                <td className="py-3 px-3 text-center">
                  <HealthIndicator exchange={ex} />
                </td>
                <td className="py-3 px-3">
                  {linkUrl ? (
                    <a
                      href={linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                        ex.featured
                          ? "bg-gold text-black hover:bg-gold-light"
                          : "bg-muted text-foreground border border-border hover:border-gold/30"
                      }`}
                    >
                      {ex.featured ? "Buy Here" : "Visit"}{" "}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {exchanges.some(
        (e) =>
          e.tradingPair.includes("ILS") || e.tradingPair.includes("NIS")
      ) && (
        <p className="text-xs text-muted-foreground mt-2 px-3">
          * Israeli exchanges show ILS prices. Price comparison percentages
          are only shown for USD-denominated pairs.
        </p>
      )}
    </div>
  );
}
