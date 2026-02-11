import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/data/articles";
import { Clock, ArrowRight, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Learn About Crypto Exchange Fees & Trading",
  description:
    "Educational guides on cryptocurrency exchange fees, trading costs, and how to find the cheapest way to buy Bitcoin. Free resources from CryptoROI.",
  alternates: {
    canonical: "https://cryptoroi.com/learn",
  },
  openGraph: {
    title: "Learn About Crypto Exchange Fees & Trading | CryptoROI",
    description:
      "Educational guides on cryptocurrency exchange fees, trading costs, and how to find the cheapest way to buy Bitcoin.",
    url: "https://cryptoroi.com/learn",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn About Crypto Exchange Fees & Trading | CryptoROI",
    description:
      "Educational guides on cryptocurrency exchange fees, trading costs, and how to find the cheapest way to buy Bitcoin.",
  },
};

export default function LearnPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
            <BookOpen className="h-5 w-5 text-gold" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Learning Center
        </h1>
        <p className="text-lg text-muted-foreground">
          Understand how crypto exchange fees work, compare platforms, and learn
          how to minimize the cost of buying Bitcoin and other cryptocurrencies.
        </p>
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/learn/${article.slug}`}
            className="group rounded-xl border border-border bg-card p-6 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5 transition-all duration-200 flex flex-col"
          >
            <h2 className="text-lg font-semibold text-foreground group-hover:text-gold transition-colors mb-2">
              {article.title}
            </h2>
            <p className="text-sm text-muted-foreground mb-4 flex-1">
              {article.description}
            </p>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {article.readTime} min read
              </span>
              <span className="flex items-center text-sm font-medium text-gold group-hover:text-gold-light transition-colors">
                Read
                <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center border-t border-border pt-10 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Ready to compare exchanges?
        </h2>
        <p className="text-muted-foreground mb-6">
          Use our real-time comparison tool to see actual prices, fees, and net
          ROI across 100+ exchanges for your specific amount and payment method.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gold text-black rounded-xl font-semibold hover:bg-gold-light transition-colors shadow-lg shadow-gold/20"
        >
          Compare Prices Now
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* JSON-LD for the learning center */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "CryptoROI Learning Center",
            description:
              "Educational guides on cryptocurrency exchange fees, trading costs, and how to find the cheapest way to buy Bitcoin.",
            url: "https://cryptoroi.com/learn",
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: articles.length,
              itemListElement: articles.map((article, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: article.title,
                url: `https://cryptoroi.com/learn/${article.slug}`,
              })),
            },
          }),
        }}
      />
    </div>
  );
}
