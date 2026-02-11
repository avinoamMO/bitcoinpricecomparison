/**
 * Market Order Simulation Engine
 *
 * Walks the order book to calculate the actual return on a market buy order.
 * Originally conceived by Avinoam Oltchik (2019), ported to TypeScript.
 *
 * Input:
 *   (1) Order book ask levels: [price, quantity][] sorted by price ascending
 *   (2) Desired purchase amount in fiat (e.g., USD)
 *
 * Output:
 *   - Aggregated BTC received
 *   - Weighted average fill price
 *   - Slippage vs. best ask
 *   - Whether the book had enough liquidity
 */

import { MarketSimulationResult } from "@/types";

/**
 * Simulates a market buy order by walking through the order book ask levels.
 *
 * For each ask level:
 *   - If remaining fiat >= full level value: consume the entire level
 *   - If remaining fiat < full level value but > 0: partially fill
 *   - Stop when fiat is exhausted or order book is empty
 *
 * @param asks - Array of [price, quantity] tuples, sorted by price ascending
 * @param amountFiat - Total fiat amount to spend (e.g., 1000000 for $1M)
 * @returns Simulation result with BTC received, avg price, slippage, etc.
 */
export function simulateMarketBuy(
  asks: [number, number][],
  amountFiat: number
): MarketSimulationResult {
  if (!asks || asks.length === 0 || amountFiat <= 0) {
    return {
      btcReceived: 0,
      avgFillPrice: 0,
      slippagePercent: 0,
      totalSpent: 0,
      fullyFilled: false,
      levelsConsumed: 0,
      amountUnfilled: amountFiat,
    };
  }

  let fiatRemaining = amountFiat;
  let btcAccumulated = 0;
  let levelsConsumed = 0;
  const bestAskPrice = asks[0][0];

  for (const [price, quantity] of asks) {
    if (fiatRemaining <= 0) break;
    if (price <= 0 || quantity <= 0) continue;

    const levelValueFiat = price * quantity;

    if (fiatRemaining >= levelValueFiat) {
      // Consume the entire level
      fiatRemaining -= levelValueFiat;
      btcAccumulated += quantity;
      levelsConsumed++;
    } else {
      // Partial fill: buy as much BTC as remaining fiat allows at this price
      const btcAffordable = fiatRemaining / price;
      btcAccumulated += btcAffordable;
      fiatRemaining = 0;
      levelsConsumed++;
    }
  }

  const totalSpent = amountFiat - fiatRemaining;
  const avgFillPrice = btcAccumulated > 0 ? totalSpent / btcAccumulated : 0;
  const slippagePercent =
    bestAskPrice > 0 && avgFillPrice > 0
      ? ((avgFillPrice - bestAskPrice) / bestAskPrice) * 100
      : 0;

  return {
    btcReceived: btcAccumulated,
    avgFillPrice,
    slippagePercent,
    totalSpent,
    fullyFilled: fiatRemaining <= 0.01, // floating point tolerance
    levelsConsumed,
    amountUnfilled: fiatRemaining,
  };
}

/**
 * Simulates a market sell order by walking through the order book bid levels.
 *
 * @param bids - Array of [price, quantity] tuples, sorted by price descending
 * @param amountBtc - Total BTC amount to sell
 * @returns Simulation result (btcReceived = fiat received, avgFillPrice = avg sell price)
 */
export function simulateMarketSell(
  bids: [number, number][],
  amountBtc: number
): MarketSimulationResult {
  if (!bids || bids.length === 0 || amountBtc <= 0) {
    return {
      btcReceived: 0,
      avgFillPrice: 0,
      slippagePercent: 0,
      totalSpent: 0,
      fullyFilled: false,
      levelsConsumed: 0,
      amountUnfilled: amountBtc,
    };
  }

  let btcRemaining = amountBtc;
  let fiatAccumulated = 0;
  let levelsConsumed = 0;
  const bestBidPrice = bids[0][0];

  for (const [price, quantity] of bids) {
    if (btcRemaining <= 0) break;
    if (price <= 0 || quantity <= 0) continue;

    if (btcRemaining >= quantity) {
      btcRemaining -= quantity;
      fiatAccumulated += price * quantity;
      levelsConsumed++;
    } else {
      fiatAccumulated += price * btcRemaining;
      btcRemaining = 0;
      levelsConsumed++;
    }
  }

  const totalBtcSold = amountBtc - btcRemaining;
  const avgFillPrice = totalBtcSold > 0 ? fiatAccumulated / totalBtcSold : 0;
  const slippagePercent =
    bestBidPrice > 0 && avgFillPrice > 0
      ? ((bestBidPrice - avgFillPrice) / bestBidPrice) * 100
      : 0;

  return {
    btcReceived: fiatAccumulated,
    avgFillPrice,
    slippagePercent,
    totalSpent: totalBtcSold,
    fullyFilled: btcRemaining <= 0.00000001,
    levelsConsumed,
    amountUnfilled: btcRemaining,
  };
}
