import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles, getArticleBySlug } from "@/data/articles";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, ArrowRight, RefreshCw } from "lucide-react";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const article = getArticleBySlug(params.slug);
  if (!article) return {};

  const title = article.title;
  const description = article.description;

  return {
    title,
    description,
    keywords: article.keywords,
    alternates: {
      canonical: `https://cryptoroi.com/learn/${article.slug}`,
    },
    openGraph: {
      title: `${title} | CryptoROI`,
      description,
      url: `https://cryptoroi.com/learn/${article.slug}`,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | CryptoROI`,
      description,
    },
  };
}

/** Extract h2 headings from markdown content for table of contents */
function extractHeadings(content: string): { id: string; text: string }[] {
  const headings: { id: string; text: string }[] = [];
  const lines = content.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ") && !trimmed.startsWith("### ")) {
      const text = trimmed.replace("## ", "");
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      headings.push({ id, text });
    }
  }
  return headings;
}

/** Render markdown-like content to JSX */
function renderContent(content: string) {
  return content.split("\n\n").map((block, i) => {
    const trimmed = block.trim();
    if (trimmed.startsWith("## ") && !trimmed.startsWith("### ")) {
      const text = trimmed.replace("## ", "");
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return (
        <h2
          key={i}
          id={id}
          className="text-xl font-bold text-foreground mt-8 mb-4 scroll-mt-24"
        >
          {text}
        </h2>
      );
    }
    if (trimmed.startsWith("### ")) {
      return (
        <h3
          key={i}
          className="text-lg font-semibold text-foreground mt-6 mb-3"
        >
          {trimmed.replace("### ", "")}
        </h3>
      );
    }
    if (trimmed.startsWith("- ")) {
      const items = trimmed.split("\n").filter((l) => l.startsWith("- "));
      return (
        <ul key={i} className="list-disc pl-6 space-y-2 mb-4">
          {items.map((item, j) => {
            const text = item.replace("- ", "");
            return (
              <li key={j} className="text-muted-foreground">
                {renderInlineFormatting(text)}
              </li>
            );
          })}
        </ul>
      );
    }
    if (
      trimmed.match(/^\d+\.\s/) ||
      trimmed.split("\n").every((l) => l.match(/^\d+\.\s/))
    ) {
      const items = trimmed.split("\n").filter((l) => l.match(/^\d+\.\s/));
      return (
        <ol key={i} className="list-decimal pl-6 space-y-2 mb-4">
          {items.map((item, j) => {
            const text = item.replace(/^\d+\.\s/, "");
            return (
              <li key={j} className="text-muted-foreground">
                {renderInlineFormatting(text)}
              </li>
            );
          })}
        </ol>
      );
    }
    if (trimmed.length === 0) return null;
    return (
      <p key={i} className="text-muted-foreground leading-relaxed mb-4">
        {renderInlineFormatting(trimmed)}
      </p>
    );
  });
}

/** Render bold text within inline content */
function renderInlineFormatting(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-foreground font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export default function ArticlePage({ params }: Props) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const headings = extractHeadings(article.content);
  const relatedArticles = articles.filter((a) => a.slug !== article.slug);

  // Article JSON-LD schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Organization",
      name: "CryptoROI",
      url: "https://cryptoroi.com",
    },
    publisher: {
      "@type": "Organization",
      name: "CryptoROI",
      url: "https://cryptoroi.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://cryptoroi.com/learn/${article.slug}`,
    },
    keywords: article.keywords.join(", "),
  };

  return (
    <article className="max-w-3xl mx-auto">
      {/* Back link */}
      <Link
        href="/learn"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Learning Center
      </Link>

      {/* Article Header */}
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          {article.title}
        </h1>
        <p className="text-lg text-muted-foreground mb-4">
          {article.description}
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(article.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {article.readTime} min read
          </span>
          {article.updatedAt !== article.publishedAt && (
            <span className="flex items-center gap-1">
              <RefreshCw className="h-3.5 w-3.5" />
              Updated{" "}
              {new Date(article.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      </header>

      {/* Table of Contents */}
      {headings.length > 2 && (
        <nav className="mb-10 rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
            Table of Contents
          </h2>
          <ol className="space-y-1.5">
            {headings.map((heading, i) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className="text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  {i + 1}. {heading.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Article Content */}
      <div className="prose">{renderContent(article.content)}</div>

      {/* CTA Card */}
      <div className="mt-12 p-6 rounded-xl border border-gold/20 bg-gold/5 text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Compare these exchanges now
        </h3>
        <p className="text-muted-foreground mb-4">
          Use CryptoROI to compare real-time prices, fees, and net ROI across
          100+ exchanges.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-black rounded-xl font-semibold hover:bg-gold-light transition-colors"
        >
          Compare Exchanges Now
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Related Articles */}
      <div className="mt-12">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Related Articles
        </h3>
        <div className="grid gap-4">
          {relatedArticles.map((a) => (
            <Link
              key={a.slug}
              href={`/learn/${a.slug}`}
              className="group rounded-xl border border-border bg-card p-4 hover:border-gold/30 transition-colors block"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground group-hover:text-gold transition-colors">
                    {a.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {a.description}
                  </p>
                </div>
                <ArrowRight className="ml-4 h-4 w-4 text-muted-foreground group-hover:text-gold flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
    </article>
  );
}
