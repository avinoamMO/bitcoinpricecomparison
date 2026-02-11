import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { exchanges, getExchangeBySlug } from "@/data/exchanges";
import { getExchangeProfile } from "@/data/exchange-profiles";
import { ExchangeProfile } from "@/components/exchange/ExchangeProfile";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return exchanges.map((exchange) => ({ slug: exchange.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const exchange = getExchangeBySlug(params.slug);
  if (!exchange) return {};

  const profile = getExchangeProfile(params.slug);
  const title = `${exchange.name} Fees & Review 2026`;
  const description = profile
    ? `${exchange.name} charges ${(exchange.feeStructure.makerFee * 100).toFixed(2)}% maker / ${(exchange.feeStructure.takerFee * 100).toFixed(2)}% taker fees. ${profile.longDescription.split(".")[0]}.`
    : `Compare ${exchange.name} fees, real-time Bitcoin prices, and trading costs. ${exchange.description}`;

  const keywords = profile
    ? profile.seoKeywords
    : [`${exchange.name.toLowerCase()} fees`, `${exchange.name.toLowerCase()} review`];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `https://cryptoroi.com/exchanges/${exchange.slug}`,
    },
    openGraph: {
      title: `${title} | CryptoROI`,
      description,
      url: `https://cryptoroi.com/exchanges/${exchange.slug}`,
      type: "website",
      siteName: "CryptoROI",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | CryptoROI`,
      description,
    },
  };
}

export default function ExchangePage({ params }: Props) {
  const exchange = getExchangeBySlug(params.slug);
  if (!exchange) notFound();

  const profile = getExchangeProfile(params.slug);

  // JSON-LD Organization schema for the exchange
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: exchange.name,
    url: exchange.url,
    description: profile?.longDescription ?? exchange.description,
    foundingDate: `${exchange.founded}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: exchange.headquarters,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: exchange.rating.toString(),
      bestRating: "5",
      worstRating: "1",
      ratingCount: "1",
    },
  };

  // JSON-LD Review schema
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Organization",
      name: exchange.name,
      url: exchange.url,
    },
    author: {
      "@type": "Organization",
      name: "CryptoROI",
      url: "https://cryptoroi.com",
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: exchange.rating.toString(),
      bestRating: "5",
      worstRating: "1",
    },
    name: `${exchange.name} Fees & Review 2026`,
    reviewBody: profile?.longDescription ?? exchange.description,
    datePublished: "2026-01-01",
    dateModified: new Date().toISOString().split("T")[0],
  };

  return (
    <>
      <ExchangeProfile exchange={exchange} profile={profile ?? undefined} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(reviewSchema),
        }}
      />
    </>
  );
}
