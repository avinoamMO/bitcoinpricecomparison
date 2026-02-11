import { calculateComparison, calculateExchangeResult, getFeesForVolume } from "@/lib/comparison-engine";
import { getExchangeById } from "@/data/exchanges";

const prices: Record<string, number> = { binance: 97000, coinbase: 97050, kraken: 97020, bybit: 97010, okx: 96990, bit2c: 97100, bitsofgold: 97200 };

describe("calculateComparison", () => {
  it("returns results for all exchanges", () => {
    const r = calculateComparison(prices, { amount: 1000, currency: "USD", depositMethod: "bank_transfer", mode: "buy" });
    expect(r.results).toHaveLength(7);
  });

  it("sorts by total cost ascending", () => {
    const r = calculateComparison(prices, { amount: 1000, currency: "USD", depositMethod: "bank_transfer", mode: "buy" });
    for (let i = 1; i < r.results.length; i++) {
      expect(r.results[i].totalCostDollar).toBeGreaterThanOrEqual(r.results[i-1].totalCostDollar);
    }
  });

  it("marks first result as best deal", () => {
    const r = calculateComparison(prices, { amount: 1000, currency: "USD", depositMethod: "bank_transfer", mode: "buy" });
    expect(r.results[0].isBestDeal).toBe(true);
    expect(r.results[0].rank).toBe(1);
  });

  it("calculates roiVsBest for non-best", () => {
    const r = calculateComparison(prices, { amount: 1000, currency: "USD", depositMethod: "bank_transfer", mode: "buy" });
    for (let i = 1; i < r.results.length; i++) { expect(r.results[i].roiVsBest).toBeGreaterThan(0); }
  });

  it("assigns correct ranks", () => {
    const r = calculateComparison(prices, { amount: 1000, currency: "USD", depositMethod: "bank_transfer", mode: "buy" });
    r.results.forEach((x, i) => expect(x.rank).toBe(i+1));
  });

  it("credit card costs more than bank transfer", () => {
    const bank = calculateComparison(prices, { amount: 1000, currency: "USD", depositMethod: "bank_transfer", mode: "buy" });
    const cc = calculateComparison(prices, { amount: 1000, currency: "USD", depositMethod: "credit_card", mode: "buy" });
    const cb = bank.results.find(r => r.exchangeId === "coinbase")!.totalCostDollar;
    const ccc = cc.results.find(r => r.exchangeId === "coinbase")!.totalCostDollar;
    expect(ccc).toBeGreaterThan(cb);
  });

  it("handles missing prices", () => {
    const r = calculateComparison({ binance: 97000 }, { amount: 1000, currency: "USD", depositMethod: "bank_transfer", mode: "buy" });
    expect(r.results).toHaveLength(1);
  });

  it("includes timestamp", () => {
    const r = calculateComparison(prices, { amount: 1000, currency: "USD", depositMethod: "bank_transfer", mode: "buy" });
    expect(typeof r.timestamp).toBe("number");
  });
});

describe("calculateExchangeResult", () => {
  it("calculates trading fee", () => {
    const r = calculateExchangeResult(getExchangeById("binance")!, 97000, 1000, "bank_transfer", "buy");
    expect(r.tradingFeePercent).toBeCloseTo(0.1, 1);
  });

  it("calculates deposit fee for credit card", () => {
    const r = calculateExchangeResult(getExchangeById("coinbase")!, 97000, 1000, "credit_card", "buy");
    expect(r.depositFeePercent).toBeCloseTo(3.99, 1);
  });

  it("calculates net BTC received", () => {
    const r = calculateExchangeResult(getExchangeById("binance")!, 100000, 1000, "bank_transfer", "buy");
    expect(r.netBtcReceived).toBeLessThan(0.01);
    expect(r.netBtcReceived).toBeGreaterThan(0.009);
  });

  it("total cost is sum of all fees", () => {
    const r = calculateExchangeResult(getExchangeById("kraken")!, 97000, 5000, "bank_transfer", "buy");
    expect(r.totalCostDollar).toBeCloseTo(r.tradingFeeDollar + r.depositFeeDollar + r.spreadDollar + r.withdrawalFeeDollar, 2);
  });

  it("zero deposit fee for bank on Binance", () => {
    const r = calculateExchangeResult(getExchangeById("binance")!, 97000, 1000, "bank_transfer", "buy");
    expect(r.depositFeeDollar).toBe(0);
  });
});

describe("getFeesForVolume", () => {
  it("returns base tier for low volume", () => {
    const f = getFeesForVolume(getExchangeById("binance")!, 500);
    expect(f.makerFee).toBe(0.001);
  });

  it("returns higher tier for high volume", () => {
    const f = getFeesForVolume(getExchangeById("binance")!, 2000000);
    expect(f.makerFee).toBe(0.0009);
  });

  it("returns highest tier", () => {
    const f = getFeesForVolume(getExchangeById("binance")!, 15000000);
    expect(f.makerFee).toBe(0.0007);
  });

  it("returns flat fees for Bit2C", () => {
    const f = getFeesForVolume(getExchangeById("bit2c")!, 50000);
    expect(f.makerFee).toBe(0.005);
  });
});
