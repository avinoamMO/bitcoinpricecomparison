"use client";

import { ExchangeData, ASSET_CONFIG } from "@/types";
import { ExternalLink, Star, Wifi, WifiOff, AlertTriangle, TrendingDown } from "lucide-react";

interface ExchangeComparisonTableProps {
  exchanges: ExchangeData[];
  investmentAmount: number;
}

function HealthIndicator({ exchange }: { exchange: ExchangeData }) {
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

export function ExchangeComparisonTable({
  exchanges,
  investmentAmount,
}: ExchangeComparisonTableProps) {
  const usdExchanges = exchanges.filter(
    (e) =>
      e.price != null &&
      !e.tradingPair.includes("ILS") &&
      !e.tradingPair.includes("NIS")
  );
  const bestUSDPrice = usdExchanges.length
    ? Math.min(...usdExchanges.map((e) => e.price!))
    : null;

  // Find best simulation result for ROI comparison
  const exchangesWithSim = exchanges.filter((e) => e.simulation && e.simulation.btcReceived > 0);
  const bestBtcReceived = exchangesWithSim.length
    ? Math.max(...exchangesWithSim.map((e) => e.simulation!.btcReceived))
    : null;

  const hasSimulation = exchangesWithSim.length > 0;

  // Derive asset symbol from exchange data (all should be same asset in one fetch)
  const assetSymbol = exchanges[0]?.assetSymbol || "BTC";
  const assetConfig = ASSET_CONFIG[assetSymbol as keyof typeof ASSET_CONFIG] || ASSET_CONFIG.BTC;
  const assetDecimals = assetConfig.decimals;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="border-b-2 border-border text-muted-foreground text-xs uppercase tracking-wider">
            <th className="py-3 px-3">#</th>
            <th className="py-3 px-3">Exchange</th>
            <th className="py-3 px-3 text-right">Price</th>
            <th className="py-3 px-3 text-right">Taker</th>
            <th className="py-3 px-3 text-right">Spread</th>
            {hasSimulation && (
              <>
                <th className="py-3 px-3 text-right hidden lg:table-cell">
                  Avg Fill
                </th>
                <th className="py-3 px-3 text-right hidden md:table-cell">
                  Slippage
                </th>
                <th className="py-3 px-3 text-right">
                  {assetSymbol} Received
                </th>
              </>
            )}
            {!hasSimulation && (
              <th className="py-3 px-3 text-right">
                Cost on ${investmentAmount.toLocaleString()}
              </th>
            )}
            <th className="py-3 px-3 text-center">Status</th>
            <th className="py-3 px-3"></th>
          </tr>
        </thead>
        <tbody>
          {exchanges.map((ex, idx) => {
            const isILS =
              ex.tradingPair.includes("ILS") ||
              ex.tradingPair.includes("NIS");
            const isEUR = ex.tradingPair.includes("EUR");
            const takerCost =
              investmentAmount * (ex.fees.takerFee / 100);
            const spreadCost = ex.orderBook
              ? investmentAmount * (ex.orderBook.spreadPercent / 100)
              : 0;
            const totalCost = takerCost + spreadCost;
            const priceDiff =
              ex.price != null && bestUSDPrice != null && !isILS && !isEUR
                ? ((ex.price - bestUSDPrice) / bestUSDPrice) * 100
                : null;

            const sim = ex.simulation;
            const btcDiff =
              sim && bestBtcReceived && sim.btcReceived > 0
                ? ((bestBtcReceived - sim.btcReceived) / bestBtcReceived) * 100
                : null;
            const isBestBtc =
              sim && bestBtcReceived
                ? Math.abs(sim.btcReceived - bestBtcReceived) < 0.00000001
                : false;

            const linkUrl = ex.affiliateUrl || ex.websiteUrl || ex.feePageUrl;

            return (
              <tr
                key={ex.id}
                className={`border-b border-border/50 hover:bg-muted/50 transition-colors ${
                  ex.featured ? "bg-gold/[0.02]" : ""
                } ${ex.israeliExchange ? "bg-crypto-blue/5" : ""} ${
                  isBestBtc ? "bg-crypto-green/5" : ""
                }`}
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
                          : isEUR
                            ? `\u20AC${ex.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
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
                <td className="py-3 px-3 text-right font-mono text-crypto-purple">
                  {ex.orderBook
                    ? `${ex.orderBook.spreadPercent.toFixed(4)}%`
                    : "N/A"}
                </td>

                {hasSimulation && (
                  <>
                    {/* Average fill price from order book simulation */}
                    <td className="py-3 px-3 text-right font-mono hidden lg:table-cell">
                      {sim && sim.avgFillPrice > 0 ? (
                        <span className="text-foreground">
                          ${sim.avgFillPrice.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </td>

                    {/* Slippage */}
                    <td className="py-3 px-3 text-right font-mono hidden md:table-cell">
                      {sim && sim.slippagePercent > 0 ? (
                        <div className="flex items-center justify-end gap-1">
                          <TrendingDown className="h-3 w-3 text-crypto-red" />
                          <span
                            className={
                              sim.slippagePercent > 0.5
                                ? "text-crypto-red"
                                : sim.slippagePercent > 0.1
                                  ? "text-gold"
                                  : "text-crypto-green"
                            }
                          >
                            {sim.slippagePercent.toFixed(4)}%
                          </span>
                        </div>
                      ) : sim ? (
                        <span className="text-crypto-green">0%</span>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                      {sim && !sim.fullyFilled && (
                        <div className="text-[10px] text-crypto-red">
                          Partial fill
                        </div>
                      )}
                    </td>

                    {/* BTC Received (the key metric) */}
                    <td className="py-3 px-3 text-right font-mono">
                      {sim && sim.btcReceived > 0 ? (
                        <div>
                          <div
                            className={`font-bold ${
                              isBestBtc
                                ? "text-crypto-green"
                                : "text-foreground"
                            }`}
                          >
                            {sim.btcReceived.toFixed(assetDecimals)} {assetSymbol}
                          </div>
                          {btcDiff != null && btcDiff > 0 && (
                            <div className="text-[10px] text-crypto-red">
                              -{btcDiff.toFixed(4)}% vs best
                            </div>
                          )}
                          {isBestBtc && (
                            <div className="text-[10px] text-crypto-green font-medium">
                              Best Deal
                            </div>
                          )}
                          {sim && !sim.fullyFilled && (
                            <div className="text-[10px] text-crypto-red">
                              Book exhausted ($
                              {sim.amountUnfilled.toFixed(0)} unfilled)
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </td>
                  </>
                )}

                {!hasSimulation && (
                  <td className="py-3 px-3 text-right font-mono font-bold text-foreground">
                    {ex.price != null ? `$${totalCost.toFixed(2)}` : "N/A"}
                  </td>
                )}

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

      {/* Simulation explanation */}
      {hasSimulation && (
        <div className="mt-3 px-3 py-2 rounded-lg bg-muted/50 border border-border/50">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Market Order Simulation:</strong>{" "}
            {assetSymbol} Received is calculated by walking the real-time order book — simulating
            what happens if you place a ${investmentAmount.toLocaleString()} market buy
            right now. Includes slippage from consuming multiple price levels.
            {exchanges.some((e) => e.simulation && !e.simulation.fullyFilled) && (
              <span className="text-crypto-red ml-1">
                Some exchanges lack sufficient liquidity at this amount.
              </span>
            )}
          </p>
        </div>
      )}

      {exchanges.some(
        (e) =>
          e.tradingPair.includes("ILS") || e.tradingPair.includes("NIS") || e.tradingPair.includes("EUR")
      ) && (
        <p className="text-xs text-muted-foreground mt-2 px-3">
          * Israeli exchanges show ILS prices, European pairs show EUR prices. Price comparison percentages
          are only shown for USD-denominated pairs.
        </p>
      )}
    </div>
  );
}
