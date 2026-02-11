import { articles, getArticleBySlug } from "@/data/articles";

describe("Article Data", () => {
  it("has exactly 5 articles", () => {
    expect(articles.length).toBe(5);
  });

  it("each article has all required fields", () => {
    articles.forEach((a) => {
      expect(a.slug).toBeTruthy();
      expect(a.title).toBeTruthy();
      expect(a.description).toBeTruthy();
      expect(a.content).toBeTruthy();
      expect(a.publishedAt).toBeTruthy();
      expect(a.updatedAt).toBeTruthy();
      expect(a.readTime).toBeGreaterThan(0);
      expect(a.keywords).toBeDefined();
      expect(a.keywords.length).toBeGreaterThan(0);
    });
  });

  it("slugs are valid URL segments", () => {
    articles.forEach((a) => {
      expect(a.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    });
  });

  it("slugs are unique", () => {
    const slugs = articles.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("finds articles by slug", () => {
    expect(getArticleBySlug("compare-crypto-exchange-fees")).toBeDefined();
    expect(getArticleBySlug("binance-vs-coinbase-fees")).toBeDefined();
    expect(getArticleBySlug("best-crypto-exchanges-beginners")).toBeDefined();
    expect(getArticleBySlug("crypto-withdrawal-fees-explained")).toBeDefined();
    expect(
      getArticleBySlug("israeli-crypto-exchanges-bit2c-vs-bits-of-gold")
    ).toBeDefined();
    expect(getArticleBySlug("nonexistent-article")).toBeUndefined();
  });

  it("each article has reasonable word count (400+ words)", () => {
    articles.forEach((a) => {
      const wordCount = a.content.split(/\s+/).length;
      expect(wordCount).toBeGreaterThanOrEqual(400);
    });
  });

  it("dates are in valid YYYY-MM-DD format", () => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    articles.forEach((a) => {
      expect(a.publishedAt).toMatch(dateRegex);
      expect(a.updatedAt).toMatch(dateRegex);
      // Dates should be parseable
      expect(isNaN(new Date(a.publishedAt).getTime())).toBe(false);
      expect(isNaN(new Date(a.updatedAt).getTime())).toBe(false);
    });
  });

  it("updatedAt is on or after publishedAt", () => {
    articles.forEach((a) => {
      expect(new Date(a.updatedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(a.publishedAt).getTime()
      );
    });
  });

  it("readTime is reasonable (3-15 minutes)", () => {
    articles.forEach((a) => {
      expect(a.readTime).toBeGreaterThanOrEqual(3);
      expect(a.readTime).toBeLessThanOrEqual(15);
    });
  });

  it("titles are unique", () => {
    const titles = articles.map((a) => a.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("descriptions are non-empty and under 200 characters", () => {
    articles.forEach((a) => {
      expect(a.description.length).toBeGreaterThan(10);
      expect(a.description.length).toBeLessThanOrEqual(200);
    });
  });

  it("content does not reference ccxt", () => {
    articles.forEach((a) => {
      expect(a.content.toLowerCase()).not.toContain("ccxt");
      expect(a.title.toLowerCase()).not.toContain("ccxt");
      expect(a.description.toLowerCase()).not.toContain("ccxt");
    });
  });

  it("each article contains at least one h2 heading", () => {
    articles.forEach((a) => {
      expect(a.content).toContain("## ");
    });
  });
});
