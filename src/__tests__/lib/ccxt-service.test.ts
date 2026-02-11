/**
 * @jest-environment node
 */

/**
 * Tests for the CCXT service module.
 * Tests configuration, type structure, dynamic discovery, and registry.
 */
import { EXCHANGE_CONFIGS } from "@/lib/ccxt-service";
import {
  FEATURED_EXCHANGES,
  getFeaturedConfig,
  isFeaturedExchange,
  EXCHANGE_BLOCKLIST,
  detectRegion,
  formatCountry,
} from "@/lib/exchange-registry";
import { exchangeHealth } from "@/lib/exchange-health";
import {
  CcxtFeeData,
  CcxtExchangeData,
  OrderBookData,
  FeeTier,
  CcxtApiResponse,
  ExchangeRegion,
} from "@/types";

describe("Featured Exchange Configs", () => {
  it("has 7 featured exchange configurations", () => {
    expect(FEATURED_EXCHANGES).toHaveLength(7);
  });

  it("EXCHANGE_CONFIGS is aliased to FEATURED_EXCHANGES for backward compat", () => {
    expect(EXCHANGE_CONFIGS).toBe(FEATURED_EXCHANGES);
  });

  it("includes all required featured exchanges", () => {
    const ids = FEATURED_EXCHANGES.map((c) => c.id);
    expect(ids).toContain("binance");
    expect(ids).toContain("coinbase");
    expect(ids).toContain("kraken");
    expect(ids).toContain("bybit");
    expect(ids).toContain("okx");
    expect(ids).toContain("bit2c");
    expect(ids).toContain("bitsofgold");
  });

  it("has valid trading pairs for each exchange", () => {
    FEATURED_EXCHANGES.forEach((config) => {
      expect(config.tradingPair).toMatch(/^BTC\//);
    });
  });

  it("has fee page URLs for all exchanges", () => {
    FEATURED_EXCHANGES.forEach((config) => {
      expect(config.feePageUrl).toMatch(/^https?:\/\//);
    });
  });

  it("has website URLs for all exchanges", () => {
    FEATURED_EXCHANGES.forEach((config) => {
      expect(config.websiteUrl).toMatch(/^https?:\/\//);
    });
  });

  it("has affiliate URLs for all exchanges", () => {
    FEATURED_EXCHANGES.forEach((config) => {
      expect(config.affiliateUrl).toBeTruthy();
    });
  });

  it("has logo URLs for all exchanges", () => {
    FEATURED_EXCHANGES.forEach((config) => {
      expect(config.logoUrl).toMatch(/^https?:\/\//);
    });
  });

  it("marks Israeli exchanges correctly", () => {
    const israeli = FEATURED_EXCHANGES.filter((c) => c.israeliExchange);
    expect(israeli).toHaveLength(2);
    expect(israeli.map((c) => c.id).sort()).toEqual(["bit2c", "bitsofgold"]);
  });

  it("assigns regions to all featured exchanges", () => {
    FEATURED_EXCHANGES.forEach((config) => {
      expect(["Global", "Americas", "Europe", "Asia", "Israel", "Other"]).toContain(config.region);
    });
  });

  it("marks Bits of Gold as manual-only", () => {
    const bog = FEATURED_EXCHANGES.find((c) => c.id === "bitsofgold");
    expect(bog?.manualOnly).toBe(true);
  });

  it("does not mark other exchanges as manual-only", () => {
    const nonManual = FEATURED_EXCHANGES.filter((c) => c.id !== "bitsofgold");
    nonManual.forEach((config) => {
      expect(config.manualOnly).toBeFalsy();
    });
  });

  it("has fee tiers for exchanges with volume discounts", () => {
    const binance = FEATURED_EXCHANGES.find((c) => c.id === "binance");
    expect(binance?.manualFeeTiers).toBeDefined();
    expect(binance!.manualFeeTiers!.length).toBeGreaterThan(1);
  });

  it("Bit2C uses BTC/NIS pair", () => {
    const bit2c = FEATURED_EXCHANGES.find((c) => c.id === "bit2c");
    expect(bit2c?.tradingPair).toBe("BTC/NIS");
    expect(bit2c?.manualOnly).toBeFalsy();
  });

  it("each config has a name and country", () => {
    FEATURED_EXCHANGES.forEach((config) => {
      expect(config.name).toBeTruthy();
      expect(config.country).toBeTruthy();
    });
  });

  it("global exchanges use USDT pairs", () => {
    const global = FEATURED_EXCHANGES.filter(
      (c) => !c.israeliExchange && c.id !== "bitsofgold"
    );
    global.forEach((config) => {
      expect(config.tradingPair).toBe("BTC/USDT");
    });
  });

  it("fallback pairs are provided for global exchanges", () => {
    const global = FEATURED_EXCHANGES.filter((c) => !c.israeliExchange);
    global.forEach((config) => {
      expect(config.fallbackPairs.length).toBeGreaterThanOrEqual(1);
    });
  });
});

describe("Exchange Registry Helpers", () => {
  it("getFeaturedConfig returns config for featured exchanges", () => {
    expect(getFeaturedConfig("binance")).toBeDefined();
    expect(getFeaturedConfig("binance")?.name).toBe("Binance");
  });

  it("getFeaturedConfig returns undefined for non-featured exchanges", () => {
    expect(getFeaturedConfig("nonexistent")).toBeUndefined();
    expect(getFeaturedConfig("gateio")).toBeUndefined();
  });

  it("isFeaturedExchange correctly identifies featured exchanges", () => {
    expect(isFeaturedExchange("binance")).toBe(true);
    expect(isFeaturedExchange("coinbase")).toBe(true);
    expect(isFeaturedExchange("gateio")).toBe(false);
    expect(isFeaturedExchange("unknown")).toBe(false);
  });
});

describe("Region Detection", () => {
  it("detects Americas region", () => {
    expect(detectRegion(["US"])).toBe("Americas");
    expect(detectRegion(["CA"])).toBe("Americas");
    expect(detectRegion(["BR"])).toBe("Americas");
  });

  it("detects Europe region", () => {
    expect(detectRegion(["GB"])).toBe("Europe");
    expect(detectRegion(["DE"])).toBe("Europe");
    expect(detectRegion(["MT"])).toBe("Europe");
  });

  it("detects Asia region", () => {
    expect(detectRegion(["JP"])).toBe("Asia");
    expect(detectRegion(["SG"])).toBe("Asia");
    expect(detectRegion(["AE"])).toBe("Asia");
  });

  it("detects Israel region", () => {
    expect(detectRegion(["IL"])).toBe("Israel");
  });

  it("detects Global for multi-region exchanges", () => {
    expect(detectRegion(["US", "JP"])).toBe("Global");
    expect(detectRegion(["GB", "SG"])).toBe("Global");
  });

  it("returns Other for unknown countries", () => {
    expect(detectRegion(["XX"])).toBe("Other");
    expect(detectRegion([])).toBe("Other");
  });

  it("prioritizes Israel when IL is in the list", () => {
    expect(detectRegion(["IL", "US"])).toBe("Israel");
  });
});

describe("Country Formatting", () => {
  it("formats single country code", () => {
    expect(formatCountry(["US"])).toBe("United States");
    expect(formatCountry(["IL"])).toBe("Israel");
  });

  it("formats multiple country codes", () => {
    const result = formatCountry(["US", "GB"]);
    expect(result).toBe("United States, United Kingdom");
  });

  it("truncates long lists", () => {
    const result = formatCountry(["US", "GB", "DE", "JP"]);
    expect(result).toContain("+3 more");
  });

  it("handles empty array", () => {
    expect(formatCountry([])).toBe("Unknown");
  });

  it("handles unknown country codes", () => {
    expect(formatCountry(["XX"])).toBe("XX");
  });
});

describe("Exchange Blocklist", () => {
  it("contains known defunct exchanges", () => {
    expect(EXCHANGE_BLOCKLIST.has("ftx")).toBe(true);
    expect(EXCHANGE_BLOCKLIST.has("ftxus")).toBe(true);
  });

  it("does not contain active exchanges", () => {
    expect(EXCHANGE_BLOCKLIST.has("binance")).toBe(false);
    expect(EXCHANGE_BLOCKLIST.has("kraken")).toBe(false);
  });

  it("is a Set for O(1) lookups", () => {
    expect(EXCHANGE_BLOCKLIST).toBeInstanceOf(Set);
  });
});

describe("Exchange Health Monitor", () => {
  beforeEach(() => {
    exchangeHealth.clear();
  });

  it("starts with unknown status", () => {
    expect(exchangeHealth.getHealthStatus("test")).toBe("unknown");
  });

  it("reports healthy after success", () => {
    exchangeHealth.recordSuccess("test");
    expect(exchangeHealth.getHealthStatus("test")).toBe("healthy");
  });

  it("reports degraded after 1-2 failures", () => {
    exchangeHealth.recordFailure("test", "timeout");
    expect(exchangeHealth.getHealthStatus("test")).toBe("degraded");

    exchangeHealth.recordFailure("test", "timeout");
    expect(exchangeHealth.getHealthStatus("test")).toBe("degraded");
  });

  it("reports down after 3+ failures", () => {
    exchangeHealth.recordFailure("test", "timeout");
    exchangeHealth.recordFailure("test", "timeout");
    exchangeHealth.recordFailure("test", "timeout");
    expect(exchangeHealth.getHealthStatus("test")).toBe("down");
  });

  it("resets to healthy after success", () => {
    exchangeHealth.recordFailure("test", "error1");
    exchangeHealth.recordFailure("test", "error2");
    exchangeHealth.recordSuccess("test");
    expect(exchangeHealth.getHealthStatus("test")).toBe("healthy");
    expect(exchangeHealth.getConsecutiveFailures("test")).toBe(0);
  });

  it("shouldHide returns true for 3+ failures", () => {
    expect(exchangeHealth.shouldHide("test")).toBe(false);

    exchangeHealth.recordFailure("test", "e1");
    exchangeHealth.recordFailure("test", "e2");
    expect(exchangeHealth.shouldHide("test")).toBe(false);

    exchangeHealth.recordFailure("test", "e3");
    expect(exchangeHealth.shouldHide("test")).toBe(true);
  });

  it("tracks consecutive failures count", () => {
    expect(exchangeHealth.getConsecutiveFailures("test")).toBe(0);

    exchangeHealth.recordFailure("test", "e1");
    expect(exchangeHealth.getConsecutiveFailures("test")).toBe(1);

    exchangeHealth.recordFailure("test", "e2");
    expect(exchangeHealth.getConsecutiveFailures("test")).toBe(2);
  });

  it("tracks last error message", () => {
    expect(exchangeHealth.getLastError("test")).toBeNull();

    exchangeHealth.recordFailure("test", "timeout error");
    expect(exchangeHealth.getLastError("test")).toBe("timeout error");
  });

  it("clears all records", () => {
    exchangeHealth.recordSuccess("ex1");
    exchangeHealth.recordFailure("ex2", "err");
    expect(exchangeHealth.size).toBe(2);

    exchangeHealth.clear();
    expect(exchangeHealth.size).toBe(0);
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

  it("CcxtExchangeData handles new fields", () => {
    const exchange: CcxtExchangeData = {
      id: "test",
      name: "Test Exchange",
      country: "Test",
      region: "Global",
      israeliExchange: false,
      featured: false,
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
      websiteUrl: "https://example.com",
      fetchedAt: new Date().toISOString(),
      status: "error",
      healthStatus: "unknown",
      consecutiveFailures: 0,
      error: "Test error",
    };
    expect(exchange.price).toBeNull();
    expect(exchange.orderBook).toBeNull();
    expect(exchange.status).toBe("error");
    expect(exchange.region).toBe("Global");
    expect(exchange.featured).toBe(false);
    expect(exchange.healthStatus).toBe("unknown");
  });

  it("CcxtExchangeData supports featured exchange fields", () => {
    const exchange: CcxtExchangeData = {
      id: "binance",
      name: "Binance",
      country: "Global (Cayman Islands)",
      region: "Global",
      israeliExchange: false,
      featured: true,
      price: 97000,
      tradingPair: "BTC/USDT",
      fees: {
        takerFee: 0.1,
        makerFee: 0.1,
        withdrawalFeeBTC: 0.0000025,
        fiatDepositFee: "Free (bank transfer)",
        fiatWithdrawalFee: "Free (bank transfer)",
        feeTiers: [],
      },
      orderBook: null,
      feePageUrl: "https://www.binance.com/en/fee/schedule",
      websiteUrl: "https://www.binance.com",
      affiliateUrl: "https://www.binance.com/en/register?ref=CRYPTOROI",
      logoUrl: "https://assets.coingecko.com/markets/images/52/small/binance.jpg",
      fetchedAt: new Date().toISOString(),
      status: "ok",
      healthStatus: "healthy",
      consecutiveFailures: 0,
    };
    expect(exchange.featured).toBe(true);
    expect(exchange.affiliateUrl).toBeTruthy();
    expect(exchange.logoUrl).toBeTruthy();
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

  it("CcxtApiResponse has correct shape with new fields", () => {
    const response: CcxtApiResponse = {
      exchanges: [],
      timestamp: new Date().toISOString(),
      totalDiscovered: 120,
      totalResponsive: 85,
      cache: {
        pricesCachedAt: null,
        feesCachedAt: null,
        pricesTTL: 30,
        feesTTL: 3600,
      },
    };
    expect(response.cache.pricesTTL).toBe(30);
    expect(response.cache.feesTTL).toBe(3600);
    expect(response.totalDiscovered).toBe(120);
    expect(response.totalResponsive).toBe(85);
  });

  it("ExchangeRegion type covers all expected values", () => {
    const regions: ExchangeRegion[] = ["Global", "Americas", "Europe", "Asia", "Israel", "Other"];
    expect(regions).toHaveLength(6);
  });
});

describe("Fee Tier Validation", () => {
  it("Binance tiers have increasing volume thresholds", () => {
    const binance = FEATURED_EXCHANGES.find((c) => c.id === "binance");
    const tiers = binance!.manualFeeTiers!;
    for (let i = 1; i < tiers.length; i++) {
      expect(tiers[i].minVolume).toBeGreaterThanOrEqual(tiers[i - 1].maxVolume);
    }
  });

  it("Binance tiers have decreasing fees at higher volumes", () => {
    const binance = FEATURED_EXCHANGES.find((c) => c.id === "binance");
    const tiers = binance!.manualFeeTiers!;
    for (let i = 1; i < tiers.length; i++) {
      expect(tiers[i].takerFee).toBeLessThanOrEqual(tiers[i - 1].takerFee);
    }
  });

  it("Coinbase tiers have decreasing fees at higher volumes", () => {
    const coinbase = FEATURED_EXCHANGES.find((c) => c.id === "coinbase");
    const tiers = coinbase!.manualFeeTiers!;
    for (let i = 1; i < tiers.length; i++) {
      expect(tiers[i].takerFee).toBeLessThanOrEqual(tiers[i - 1].takerFee);
    }
  });

  it("Bit2C tiers have decreasing fees at higher volumes", () => {
    const bit2c = FEATURED_EXCHANGES.find((c) => c.id === "bit2c");
    const tiers = bit2c!.manualFeeTiers!;
    for (let i = 1; i < tiers.length; i++) {
      expect(tiers[i].takerFee).toBeLessThanOrEqual(tiers[i - 1].takerFee);
    }
  });

  it("all fee values are non-negative", () => {
    FEATURED_EXCHANGES.forEach((config) => {
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
