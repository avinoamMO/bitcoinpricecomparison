/**
 * @jest-environment node
 */

/**
 * Tests for the CCXT service module.
 * These test the configuration and type structure, not live API calls.
 * Live API tests would require network access and are better suited for integration tests.
 */
import { EXCHANGE_CONFIGS } from "@/lib/ccxt-service";
import { CcxtFeeData, CcxtExchangeData, OrderBookData, FeeTier, CcxtApiResponse } from "@/types";

describe("CCXT Exchange Configs", () => {
  it("has 7 exchange configurations", () => {
    expect(EXCHANGE_CONFIGS).toHaveLength(7);
  });

  it("includes all required exchanges", () => {
    const ids = EXCHANGE_CONFIGS.map((c) => c.id);
    expect(ids).toContain("binance");
    expect(ids).toContain("coinbase");
    expect(ids).toContain("kraken");
    expect(ids).toContain("bybit");
    expect(ids).toContain("okx");
    expect(ids).toContain("bit2c");
    expect(ids).toContain("bitsofgold");
  });

  it("has valid trading pairs for each exchange", () => {
    EXCHANGE_CONFIGS.forEach((config) => {
      expect(config.tradingPair).toMatch(/^BTC\//);
    });
  });

  it("has fee page URLs for all exchanges", () => {
    EXCHANGE_CONFIGS.forEach((config) => {
      expect(config.feePageUrl).toMatch(/^https?:\/\//);
    });
  });

  it("marks Israeli exchanges correctly", () => {
    const israeli = EXCHANGE_CONFIGS.filter((c) => c.israeliExchange);
    expect(israeli).toHaveLength(2);
    expect(israeli.map((c) => c.id).sort()).toEqual(["bit2c", "bitsofgold"]);
  });

  it("marks Bits of Gold as manual-only", () => {
    const bog = EXCHANGE_CONFIGS.find((c) => c.id === "bitsofgold");
    expect(bog?.manualOnly).toBe(true);
  });

  it("does not mark other exchanges as manual-only", () => {
    const nonManual = EXCHANGE_CONFIGS.filter((c) => c.id !== "bitsofgold");
    nonManual.forEach((config) => {
      expect(config.manualOnly).toBeFalsy();
    });
  });

  it("has fee tiers for exchanges with volume discounts", () => {
    const binance = EXCHANGE_CONFIGS.find((c) => c.id === "binance");
    expect(binance?.manualFeeTiers).toBeDefined();
    expect(binance!.manualFeeTiers!.length).toBeGreaterThan(1);
  });

  it("Bit2C uses BTC/NIS pair (CCXT native)", () => {
    const bit2c = EXCHANGE_CONFIGS.find((c) => c.id === "bit2c");
    expect(bit2c?.tradingPair).toBe("BTC/NIS");
    expect(bit2c?.manualOnly).toBeFalsy();
  });

  it("each config has a name and country", () => {
    EXCHANGE_CONFIGS.forEach((config) => {
      expect(config.name).toBeTruthy();
      expect(config.country).toBeTruthy();
    });
  });

  it("global exchanges use USDT pairs", () => {
    const global = EXCHANGE_CONFIGS.filter(
      (c) => !c.israeliExchange && c.id !== "bitsofgold"
    );
    global.forEach((config) => {
      expect(config.tradingPair).toBe("BTC/USDT");
    });
  });

  it("fallback pairs are provided for global exchanges", () => {
    const global = EXCHANGE_CONFIGS.filter((c) => !c.israeliExchange);
    global.forEach((config) => {
      expect(config.fallbackPairs.length).toBeGreaterThanOrEqual(1);
    });
  });
});

describe("CCXT Type Structures", () => {
  it("CcxtFeeData has correct shape", () => {
    const fee: CcxtFeeData = {
      takerFee: 0.1,
      makerFee: 0.1,
      withdrawalFeeBTC: 0.0001,
      fiatDepositFee: "Free",
      fiatWithdrawalFee: "Free",
      feeTiers: [],
    };
    expect(fee.takerFee).toBe(0.1);
    expect(fee.withdrawalFeeBTC).toBe(0.0001);
  });

  it("OrderBookData has correct shape", () => {
    const ob: OrderBookData = {
      bestBid: 96990,
      bestAsk: 97010,
      spreadUSD: 20,
      spreadPercent: 0.0206,
      bidDepth: 5.5,
      askDepth: 4.2,
    };
    expect(ob.spreadUSD).toBe(20);
    expect(ob.bidDepth).toBe(5.5);
  });

  it("CcxtExchangeData handles null price and orderBook", () => {
    const exchange: CcxtExchangeData = {
      id: "test",
      name: "Test Exchange",
      country: "Test",
      israeliExchange: false,
      price: null,
      tradingPair: "BTC/USDT",
      fees: {
        takerFee: 0.1,
        makerFee: 0.1,
        withdrawalFeeBTC: null,
        fiatDepositFee: "Varies",
        fiatWithdrawalFee: "Varies",
        feeTiers: [],
      },
      orderBook: null,
      feePageUrl: "https://example.com",
      fetchedAt: new Date().toISOString(),
      status: "error",
      error: "Test error",
    };
    expect(exchange.price).toBeNull();
    expect(exchange.orderBook).toBeNull();
    expect(exchange.status).toBe("error");
  });

  it("FeeTier has correct shape", () => {
    const tier: FeeTier = {
      tierLabel: "Regular",
      minVolume: 0,
      maxVolume: 1000000,
      takerFee: 0.1,
      makerFee: 0.1,
    };
    expect(tier.tierLabel).toBe("Regular");
    expect(tier.maxVolume).toBe(1000000);
  });

  it("CcxtApiResponse has correct shape", () => {
    const response: CcxtApiResponse = {
      exchanges: [],
      timestamp: new Date().toISOString(),
      cache: {
        pricesCachedAt: null,
        feesCachedAt: null,
        pricesTTL: 30,
        feesTTL: 3600,
      },
    };
    expect(response.cache.pricesTTL).toBe(30);
    expect(response.cache.feesTTL).toBe(3600);
  });
});

describe("Fee Tier Validation", () => {
  it("Binance tiers have increasing volume thresholds", () => {
    const binance = EXCHANGE_CONFIGS.find((c) => c.id === "binance");
    const tiers = binance!.manualFeeTiers!;
    for (let i = 1; i < tiers.length; i++) {
      expect(tiers[i].minVolume).toBeGreaterThanOrEqual(tiers[i - 1].maxVolume);
    }
  });

  it("Binance tiers have decreasing fees at higher volumes", () => {
    const binance = EXCHANGE_CONFIGS.find((c) => c.id === "binance");
    const tiers = binance!.manualFeeTiers!;
    for (let i = 1; i < tiers.length; i++) {
      expect(tiers[i].takerFee).toBeLessThanOrEqual(tiers[i - 1].takerFee);
    }
  });

  it("Coinbase tiers have decreasing fees at higher volumes", () => {
    const coinbase = EXCHANGE_CONFIGS.find((c) => c.id === "coinbase");
    const tiers = coinbase!.manualFeeTiers!;
    for (let i = 1; i < tiers.length; i++) {
      expect(tiers[i].takerFee).toBeLessThanOrEqual(tiers[i - 1].takerFee);
    }
  });

  it("Bit2C tiers have decreasing fees at higher volumes", () => {
    const bit2c = EXCHANGE_CONFIGS.find((c) => c.id === "bit2c");
    const tiers = bit2c!.manualFeeTiers!;
    for (let i = 1; i < tiers.length; i++) {
      expect(tiers[i].takerFee).toBeLessThanOrEqual(tiers[i - 1].takerFee);
    }
  });

  it("all fee values are non-negative", () => {
    EXCHANGE_CONFIGS.forEach((config) => {
      if (config.manualFeeTiers) {
        config.manualFeeTiers.forEach((tier) => {
          expect(tier.takerFee).toBeGreaterThanOrEqual(0);
          expect(tier.makerFee).toBeGreaterThanOrEqual(0);
          expect(tier.minVolume).toBeGreaterThanOrEqual(0);
        });
      }
      if (config.manualFees?.takerFee != null) {
        expect(config.manualFees.takerFee).toBeGreaterThanOrEqual(0);
      }
      if (config.manualFees?.makerFee != null) {
        expect(config.manualFees.makerFee).toBeGreaterThanOrEqual(0);
      }
    });
  });
});
