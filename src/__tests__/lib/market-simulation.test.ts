/**
 * @jest-environment node
 */

/**
 * Tests for the Market Order Simulation Engine.
 * Verifies order book walking logic for market buy and sell orders.
 */

import { simulateMarketBuy, simulateMarketSell } from "@/lib/market-simulation";

describe("simulateMarketBuy", () => {
  it("returns empty result for empty order book", () => {
    const result = simulateMarketBuy([], 1000);
    expect(result.btcReceived).toBe(0);
    expect(result.fullyFilled).toBe(false);
    expect(result.amountUnfilled).toBe(1000);
  });

  it("returns empty result for zero amount", () => {
    const result = simulateMarketBuy([[100000, 1]], 0);
    expect(result.btcReceived).toBe(0);
    expect(result.fullyFilled).toBe(false);
  });

  it("returns empty result for negative amount", () => {
    const result = simulateMarketBuy([[100000, 1]], -500);
    expect(result.btcReceived).toBe(0);
    expect(result.fullyFilled).toBe(false);
  });

  it("handles single level full fill", () => {
    // Order book: 1 BTC at $100,000
    // Buy with $50,000 -> should get 0.5 BTC
    const asks: [number, number][] = [[100000, 1]];
    const result = simulateMarketBuy(asks, 50000);

    expect(result.btcReceived).toBeCloseTo(0.5, 8);
    expect(result.avgFillPrice).toBeCloseTo(100000, 2);
    expect(result.slippagePercent).toBeCloseTo(0, 4);
    expect(result.totalSpent).toBeCloseTo(50000, 2);
    expect(result.fullyFilled).toBe(true);
    expect(result.levelsConsumed).toBe(1);
    expect(result.amountUnfilled).toBeCloseTo(0, 2);
  });

  it("consumes entire level when exact match", () => {
    // Order book: 1 BTC at $100,000
    // Buy with $100,000 -> should get exactly 1 BTC
    const asks: [number, number][] = [[100000, 1]];
    const result = simulateMarketBuy(asks, 100000);

    expect(result.btcReceived).toBeCloseTo(1, 8);
    expect(result.avgFillPrice).toBeCloseTo(100000, 2);
    expect(result.fullyFilled).toBe(true);
    expect(result.levelsConsumed).toBe(1);
  });

  it("walks multiple levels with increasing prices", () => {
    // Order book:
    //   Level 1: 0.5 BTC at $100,000 ($50,000 worth)
    //   Level 2: 0.5 BTC at $100,100 ($50,050 worth)
    //   Level 3: 1.0 BTC at $100,200 ($100,200 worth)
    // Buy with $100,000
    // Should consume all of L1 (0.5 BTC, $50K), then partial L2
    const asks: [number, number][] = [
      [100000, 0.5],
      [100100, 0.5],
      [100200, 1.0],
    ];
    const result = simulateMarketBuy(asks, 100000);

    // L1: 0.5 BTC for $50,000. Remaining: $50,000
    // L2: $50,000 / $100,100 per BTC = ~0.4995 BTC
    const expectedBtc = 0.5 + 50000 / 100100;
    expect(result.btcReceived).toBeCloseTo(expectedBtc, 6);
    expect(result.fullyFilled).toBe(true);
    expect(result.levelsConsumed).toBe(2);
    expect(result.slippagePercent).toBeGreaterThan(0); // Avg price > best ask
  });

  it("reports partial fill when book is exhausted", () => {
    // Order book: only 0.1 BTC at $100,000 ($10,000 worth)
    // Try to buy $50,000 worth -> can only fill $10,000
    const asks: [number, number][] = [[100000, 0.1]];
    const result = simulateMarketBuy(asks, 50000);

    expect(result.btcReceived).toBeCloseTo(0.1, 8);
    expect(result.totalSpent).toBeCloseTo(10000, 2);
    expect(result.fullyFilled).toBe(false);
    expect(result.amountUnfilled).toBeCloseTo(40000, 2);
    expect(result.levelsConsumed).toBe(1);
  });

  it("calculates correct slippage on large orders", () => {
    // Order book with thin liquidity and increasing prices
    const asks: [number, number][] = [
      [100000, 0.1],   // $10,000
      [100500, 0.1],   // $10,050
      [101000, 0.1],   // $10,100
      [102000, 0.1],   // $10,200
      [105000, 0.1],   // $10,500
    ];
    // Buy $50,000 -> should consume all 5 levels ($50,850 available)
    const result = simulateMarketBuy(asks, 50000);

    expect(result.btcReceived).toBeGreaterThan(0);
    expect(result.avgFillPrice).toBeGreaterThan(100000); // Higher than best ask
    expect(result.slippagePercent).toBeGreaterThan(0);
    expect(result.fullyFilled).toBe(true);
  });

  it("handles $1M order across deep book", () => {
    // Simulate a deep order book
    const asks: [number, number][] = [];
    let price = 100000;
    for (let i = 0; i < 100; i++) {
      asks.push([price, 0.5]); // 0.5 BTC at each level
      price += 10; // $10 increment
    }
    // Total available: 50 BTC, ~$5M worth
    const result = simulateMarketBuy(asks, 1000000);

    expect(result.btcReceived).toBeGreaterThan(9.9);
    expect(result.fullyFilled).toBe(true);
    expect(result.avgFillPrice).toBeGreaterThan(100000);
    expect(result.slippagePercent).toBeGreaterThan(0);
    expect(result.levelsConsumed).toBeGreaterThan(1);
  });

  it("skips zero-price and zero-quantity levels", () => {
    const asks: [number, number][] = [
      [0, 1],          // invalid price
      [100000, 0],     // invalid quantity
      [100000, 0.5],   // valid
    ];
    const result = simulateMarketBuy(asks, 25000);

    expect(result.btcReceived).toBeCloseTo(0.25, 8);
    expect(result.levelsConsumed).toBe(1);
  });
});

describe("simulateMarketSell", () => {
  it("returns empty result for empty order book", () => {
    const result = simulateMarketSell([], 1);
    expect(result.btcReceived).toBe(0);
    expect(result.fullyFilled).toBe(false);
  });

  it("handles single level sell", () => {
    // Bid: someone will buy 1 BTC at $100,000
    // Sell 0.5 BTC -> get $50,000
    const bids: [number, number][] = [[100000, 1]];
    const result = simulateMarketSell(bids, 0.5);

    expect(result.btcReceived).toBeCloseTo(50000, 2); // fiat received
    expect(result.avgFillPrice).toBeCloseTo(100000, 2);
    expect(result.fullyFilled).toBe(true);
    expect(result.totalSpent).toBeCloseTo(0.5, 8); // BTC sold
  });

  it("walks multiple bid levels with decreasing prices", () => {
    const bids: [number, number][] = [
      [100000, 0.5], // best bid
      [99900, 0.5],
      [99800, 1.0],
    ];
    const result = simulateMarketSell(bids, 1.0);

    // L1: sell 0.5 BTC at $100,000 = $50,000
    // L2: sell 0.5 BTC at $99,900 = $49,950
    // Total: $99,950
    expect(result.btcReceived).toBeCloseTo(99950, 2);
    expect(result.avgFillPrice).toBeCloseTo(99950, 2);
    expect(result.fullyFilled).toBe(true);
    expect(result.slippagePercent).toBeGreaterThan(0);
  });

  it("reports partial fill when bids exhausted", () => {
    const bids: [number, number][] = [[100000, 0.1]];
    const result = simulateMarketSell(bids, 1.0);

    expect(result.btcReceived).toBeCloseTo(10000, 2);
    expect(result.fullyFilled).toBe(false);
    expect(result.amountUnfilled).toBeCloseTo(0.9, 8);
  });
});
