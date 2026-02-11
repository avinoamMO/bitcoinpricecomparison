import { exchanges } from "@/data/exchanges";
import { ComparisonRequest, ComparisonResult, ComparisonResponse, DepositMethod, Exchange } from "@/types";

export function calculateComparison(prices: Record<string, number>, request: ComparisonRequest): ComparisonResponse {
  const { amount, currency, depositMethod, mode } = request;
  const results: ComparisonResult[] = exchanges
    .map((ex) => { const p = prices[ex.id]; return p ? calculateExchangeResult(ex, p, amount, depositMethod, mode) : null; })
    .filter((r): r is ComparisonResult => r !== null);

  results.sort((a, b) => a.totalCostDollar - b.totalCostDollar);
  if (results.length > 0) {
    const best = results[0].totalCostDollar;
    results.forEach((r, i) => { r.rank = i + 1; r.isBestDeal = i === 0; r.roiVsBest = best === 0 ? 0 : ((r.totalCostDollar - best) / amount) * 100; });
  }
  return { results, amount, currency, depositMethod, timestamp: Date.now() };
}

export function calculateExchangeResult(exchange: Exchange, btcPrice: number, amount: number, depositMethod: DepositMethod, mode: "buy" | "sell"): ComparisonResult {
  const tf = exchange.feeStructure.takerFee;
  const tfd = amount * tf;
  const df = exchange.feeStructure.depositFees[depositMethod] || 0;
  const dfd = amount * df;
  const sp = exchange.feeStructure.spreadEstimate;
  const spd = amount * sp;
  const wf = exchange.feeStructure.withdrawalFeeBtc;
  const wfd = wf * btcPrice;
  const total = tfd + dfd + spd + wfd;
  const eff = amount - dfd;
  const btcBefore = eff / btcPrice;
  const net = mode === "buy" ? btcBefore - btcBefore * tf - btcBefore * sp - wf : btcBefore;

  return {
    exchangeId: exchange.id, exchangeName: exchange.name, exchangeLogo: exchange.logo,
    affiliateUrl: exchange.affiliateUrl, btcPrice,
    tradingFeePercent: tf * 100, tradingFeeDollar: tfd,
    depositFeePercent: df * 100, depositFeeDollar: dfd,
    withdrawalFeeBtc: wf, withdrawalFeeDollar: wfd,
    spreadPercent: sp * 100, spreadDollar: spd,
    totalCostDollar: total, totalCostPercent: (total / amount) * 100,
    netBtcReceived: net, roiVsBest: 0, isBestDeal: false, rank: 0,
  };
}

export function getFeesForVolume(exchange: Exchange, vol: number): { makerFee: number; takerFee: number } {
  const t = exchange.volumeTiers.find((t) => vol >= t.minVolume && (t.maxVolume === null || vol < t.maxVolume));
  return t ? { makerFee: t.makerFee, takerFee: t.takerFee } : { makerFee: exchange.feeStructure.makerFee, takerFee: exchange.feeStructure.takerFee };
}
