import { exchanges, getExchangeBySlug, getExchangeById } from "@/data/exchanges";

describe("Exchange Data", () => {
  it("has 10 exchanges", () => { expect(exchanges).toHaveLength(10); });

  it("each has required fields", () => {
    exchanges.forEach(e => {
      expect(e.id).toBeTruthy();
      expect(e.name).toBeTruthy();
      expect(e.slug).toBeTruthy();
      expect(e.rating).toBeGreaterThan(0);
      expect(e.rating).toBeLessThanOrEqual(5);
    });
  });

  it("each has valid fees", () => {
    exchanges.forEach(e => {
      expect(e.feeStructure.makerFee).toBeGreaterThanOrEqual(0);
      expect(e.feeStructure.takerFee).toBeLessThan(0.1);
    });
  });

  it("has Israeli exchanges", () => {
    const il = exchanges.filter(e => e.isIsraeli);
    expect(il).toHaveLength(2);
  });

  it("Israeli exchanges support ILS", () => {
    exchanges.filter(e => e.isIsraeli).forEach(e => expect(e.supportedCurrencies).toContain("ILS"));
  });

  it("finds by slug", () => {
    expect(getExchangeBySlug("binance")!.name).toBe("Binance");
    expect(getExchangeBySlug("unknown")).toBeUndefined();
  });

  it("finds by id", () => {
    expect(getExchangeById("coinbase")!.name).toBe("Coinbase");
    expect(getExchangeById("unknown")).toBeUndefined();
  });
});
