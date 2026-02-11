import { articles, getArticleBySlug } from "@/data/articles";

describe("Article Data", () => {
  it("has at least 3 articles", () => { expect(articles.length).toBeGreaterThanOrEqual(3); });

  it("each has required fields", () => {
    articles.forEach(a => {
      expect(a.slug).toBeTruthy();
      expect(a.title).toBeTruthy();
      expect(a.content).toBeTruthy();
      expect(a.readTime).toBeGreaterThan(0);
    });
  });

  it("finds by slug", () => {
    expect(getArticleBySlug("how-exchange-fees-work")).toBeDefined();
    expect(getArticleBySlug("nonexistent")).toBeUndefined();
  });

  it("slugs are unique", () => {
    const slugs = articles.map(a => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
