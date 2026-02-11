import { exchangeCache, PRICE_TTL_MS, FEE_TTL_MS, ORDERBOOK_TTL_MS } from "@/lib/exchange-cache";

describe("ExchangeCache", () => {
  beforeEach(() => {
    exchangeCache.clear();
  });

  it("returns null for missing keys", () => {
    expect(exchangeCache.get("nonexistent", 1000)).toBeNull();
  });

  it("stores and retrieves values", () => {
    exchangeCache.set("test:key", { price: 97000 });
    const result = exchangeCache.get<{ price: number }>("test:key", 60000);
    expect(result).toEqual({ price: 97000 });
  });

  it("returns null for expired entries", async () => {
    exchangeCache.set("test:expired", { value: 1 });
    // Wait 2ms then get with 1ms TTL to ensure expiration
    await new Promise((resolve) => setTimeout(resolve, 2));
    const result = exchangeCache.get("test:expired", 1);
    expect(result).toBeNull();
  });

  it("returns value within TTL", () => {
    exchangeCache.set("test:valid", { value: 42 });
    // With a large TTL, value should be available
    const result = exchangeCache.get<{ value: number }>("test:valid", 60000);
    expect(result).toEqual({ value: 42 });
  });

  it("tracks timestamps", () => {
    const before = Date.now();
    exchangeCache.set("test:ts", "data");
    const ts = exchangeCache.getTimestamp("test:ts");
    expect(ts).not.toBeNull();
    expect(ts!).toBeGreaterThanOrEqual(before);
    expect(ts!).toBeLessThanOrEqual(Date.now());
  });

  it("returns null timestamp for missing keys", () => {
    expect(exchangeCache.getTimestamp("missing")).toBeNull();
  });

  it("clears all entries", () => {
    exchangeCache.set("a", 1);
    exchangeCache.set("b", 2);
    expect(exchangeCache.size).toBe(2);
    exchangeCache.clear();
    expect(exchangeCache.size).toBe(0);
  });

  it("clears entries by prefix", () => {
    exchangeCache.set("ccxt:price:binance", 97000);
    exchangeCache.set("ccxt:price:kraken", 97050);
    exchangeCache.set("ccxt:fees:binance", { taker: 0.1 });
    exchangeCache.set("other:key", "keep");

    exchangeCache.clearPrefix("ccxt:price:");
    expect(exchangeCache.get("ccxt:price:binance", 60000)).toBeNull();
    expect(exchangeCache.get("ccxt:price:kraken", 60000)).toBeNull();
    expect(exchangeCache.get("ccxt:fees:binance", 60000)).toEqual({ taker: 0.1 });
    expect(exchangeCache.get("other:key", 60000)).toBe("keep");
  });

  it("overwrites existing entries", () => {
    exchangeCache.set("test:overwrite", "original");
    exchangeCache.set("test:overwrite", "updated");
    expect(exchangeCache.get("test:overwrite", 60000)).toBe("updated");
  });
});

describe("TTL Constants", () => {
  it("price TTL is 30 seconds", () => {
    expect(PRICE_TTL_MS).toBe(30000);
  });

  it("fee TTL is 1 hour", () => {
    expect(FEE_TTL_MS).toBe(3600000);
  });

  it("orderbook TTL is 15 seconds", () => {
    expect(ORDERBOOK_TTL_MS).toBe(15000);
  });
});
