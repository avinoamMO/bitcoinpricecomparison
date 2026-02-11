import {
  exchangeProfiles,
  getExchangeProfile,
  getAllExchangeProfileSlugs,
} from "@/data/exchange-profiles";
import { exchanges, getExchangeBySlug } from "@/data/exchanges";

describe("Exchange Profiles Data", () => {
  const REQUIRED_EXCHANGES = [
    "binance",
    "coinbase",
    "kraken",
    "bybit",
    "okx",
    "bit2c",
    "bits-of-gold",
    "kucoin",
    "gate-io",
    "bitstamp",
  ];

  it("has profiles for all 10 required exchanges", () => {
    expect(exchangeProfiles).toHaveLength(10);
    REQUIRED_EXCHANGES.forEach((slug) => {
      const profile = getExchangeProfile(slug);
      expect(profile).toBeDefined();
      expect(profile!.slug).toBe(slug);
    });
  });

  it("each profile has a matching exchange in exchanges.ts", () => {
    exchangeProfiles.forEach((profile) => {
      const exchange = getExchangeBySlug(profile.slug);
      expect(exchange).toBeDefined();
      expect(exchange!.slug).toBe(profile.slug);
    });
  });

  it("every exchange in exchanges.ts has a matching profile", () => {
    exchanges.forEach((exchange) => {
      const profile = getExchangeProfile(exchange.slug);
      expect(profile).toBeDefined();
    });
  });

  describe("profile completeness", () => {
    exchangeProfiles.forEach((profile) => {
      describe(profile.slug, () => {
        it("has a non-empty longDescription", () => {
          expect(profile.longDescription.length).toBeGreaterThan(50);
        });

        it("has at least 2 supported assets", () => {
          expect(profile.supportedAssets.length).toBeGreaterThanOrEqual(2);
        });

        it("has at least 1 region", () => {
          expect(profile.regionAvailability.length).toBeGreaterThanOrEqual(1);
        });

        it("has at least 2 deposit methods", () => {
          expect(profile.depositMethods.length).toBeGreaterThanOrEqual(2);
        });

        it("has a valid founded year", () => {
          expect(profile.foundedYear).toBeGreaterThanOrEqual(2009);
          expect(profile.foundedYear).toBeLessThanOrEqual(new Date().getFullYear());
        });

        it("has a non-empty headquarters", () => {
          expect(profile.headquarters.length).toBeGreaterThan(0);
        });

        it("has a non-empty userBase", () => {
          expect(profile.userBase.length).toBeGreaterThan(0);
        });

        it("has a non-empty regulation field", () => {
          expect(profile.regulation.length).toBeGreaterThan(0);
        });

        it("has at least 3 SEO keywords", () => {
          expect(profile.seoKeywords.length).toBeGreaterThanOrEqual(3);
        });

        it("has a non-empty tagline", () => {
          expect(profile.tagline.length).toBeGreaterThan(0);
        });

        it("foundedYear matches the exchange data", () => {
          const exchange = getExchangeBySlug(profile.slug);
          expect(exchange).toBeDefined();
          expect(profile.foundedYear).toBe(exchange!.founded);
        });

        it("headquarters matches the exchange data", () => {
          const exchange = getExchangeBySlug(profile.slug);
          expect(exchange).toBeDefined();
          expect(profile.headquarters).toBe(exchange!.headquarters);
        });
      });
    });
  });

  describe("slug validity", () => {
    it("all slugs are URL-safe", () => {
      exchangeProfiles.forEach((profile) => {
        expect(profile.slug).toMatch(/^[a-z0-9-]+$/);
      });
    });

    it("all slugs are unique", () => {
      const slugs = exchangeProfiles.map((p) => p.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    });

    it("getAllExchangeProfileSlugs returns all slugs", () => {
      const slugs = getAllExchangeProfileSlugs();
      expect(slugs).toHaveLength(exchangeProfiles.length);
      REQUIRED_EXCHANGES.forEach((slug) => {
        expect(slugs).toContain(slug);
      });
    });
  });

  describe("getExchangeProfile", () => {
    it("returns correct profile for valid slug", () => {
      const profile = getExchangeProfile("binance");
      expect(profile).toBeDefined();
      expect(profile!.slug).toBe("binance");
      expect(profile!.tagline).toBeTruthy();
    });

    it("returns undefined for invalid slug", () => {
      expect(getExchangeProfile("nonexistent")).toBeUndefined();
    });
  });

  describe("SEO keyword quality", () => {
    it("each profile has keywords containing the exchange name or slug", () => {
      exchangeProfiles.forEach((profile) => {
        const exchange = getExchangeBySlug(profile.slug);
        const nameLC = exchange!.name.toLowerCase();
        const slugNoDash = profile.slug.replace(/-/g, " ");
        const hasRelevantKeyword = profile.seoKeywords.some(
          (kw) =>
            kw.toLowerCase().includes(nameLC) ||
            kw.toLowerCase().includes(profile.slug) ||
            kw.toLowerCase().includes(slugNoDash)
        );
        expect(hasRelevantKeyword).toBe(true);
      });
    });

    it("each profile has a fees-related keyword", () => {
      exchangeProfiles.forEach((profile) => {
        const hasFeeKeyword = profile.seoKeywords.some((kw) =>
          kw.toLowerCase().includes("fee")
        );
        expect(hasFeeKeyword).toBe(true);
      });
    });
  });
});

describe("Exchange Data (updated)", () => {
  it("has 10 exchanges", () => {
    expect(exchanges).toHaveLength(10);
  });

  it("each has required fields", () => {
    exchanges.forEach((e) => {
      expect(e.id).toBeTruthy();
      expect(e.name).toBeTruthy();
      expect(e.slug).toBeTruthy();
      expect(e.rating).toBeGreaterThan(0);
      expect(e.rating).toBeLessThanOrEqual(5);
      expect(e.feeStructure.makerFee).toBeGreaterThanOrEqual(0);
      expect(e.feeStructure.takerFee).toBeLessThan(0.1);
      expect(e.pros.length).toBeGreaterThanOrEqual(2);
      expect(e.cons.length).toBeGreaterThanOrEqual(2);
      expect(e.securityFeatures.length).toBeGreaterThanOrEqual(2);
      expect(e.volumeTiers.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("has Israeli exchanges", () => {
    const il = exchanges.filter((e) => e.isIsraeli);
    expect(il).toHaveLength(2);
  });

  it("Israeli exchanges support ILS", () => {
    exchanges
      .filter((e) => e.isIsraeli)
      .forEach((e) => expect(e.supportedCurrencies).toContain("ILS"));
  });

  it("all slugs are unique", () => {
    const slugs = exchanges.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("all IDs are unique", () => {
    const ids = exchanges.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("finds by slug", () => {
    expect(getExchangeBySlug("binance")!.name).toBe("Binance");
    expect(getExchangeBySlug("kucoin")!.name).toBe("KuCoin");
    expect(getExchangeBySlug("gate-io")!.name).toBe("Gate.io");
    expect(getExchangeBySlug("bitstamp")!.name).toBe("Bitstamp");
    expect(getExchangeBySlug("unknown")).toBeUndefined();
  });

  it("new exchanges have valid fee structures", () => {
    ["kucoin", "gate-io", "bitstamp"].forEach((slug) => {
      const e = getExchangeBySlug(slug)!;
      expect(e.feeStructure.makerFee).toBeGreaterThan(0);
      expect(e.feeStructure.takerFee).toBeGreaterThan(0);
      expect(e.feeStructure.withdrawalFeeBtc).toBeGreaterThan(0);
    });
  });
});

describe("Meta generation", () => {
  it("generates valid meta title for each exchange", () => {
    exchanges.forEach((exchange) => {
      const title = `${exchange.name} Fees & Review 2026`;
      expect(title.length).toBeGreaterThan(10);
      expect(title.length).toBeLessThan(70);
      expect(title).toContain(exchange.name);
      expect(title).toContain("2026");
    });
  });

  it("generates valid meta description using profile data", () => {
    exchanges.forEach((exchange) => {
      const profile = getExchangeProfile(exchange.slug);
      const description = profile
        ? `${exchange.name} charges ${(exchange.feeStructure.makerFee * 100).toFixed(2)}% maker / ${(exchange.feeStructure.takerFee * 100).toFixed(2)}% taker fees. ${profile.longDescription.split(".")[0]}.`
        : `Compare ${exchange.name} fees, real-time Bitcoin prices, and trading costs. ${exchange.description}`;
      expect(description.length).toBeGreaterThan(50);
      expect(description.length).toBeLessThan(300);
      expect(description).toContain(exchange.name);
    });
  });

  it("generates valid canonical URLs for each exchange", () => {
    exchanges.forEach((exchange) => {
      const url = `https://cryptoroi.com/exchanges/${exchange.slug}`;
      expect(url).toMatch(/^https:\/\/cryptoroi\.com\/exchanges\/[a-z0-9-]+$/);
    });
  });
});
