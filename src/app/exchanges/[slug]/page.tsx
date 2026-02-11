import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { exchanges, getExchangeBySlug } from "@/data/exchanges";
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

  const title = `${exchange.name} Fees, Prices & Review`;
  const description = `Compare ${exchange.name} fees, real-time Bitcoin prices, and trading costs. ${exchange.description} See how ${exchange.name} stacks up against other exchanges.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://cryptoroi.com/exchanges/${exchange.slug}`,
    },
    openGraph: {
      title: `${title} | CryptoROI`,
      description,
      url: `https://cryptoroi.com/exchanges/${exchange.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${title} | CryptoROI`,
      description,
    },
  };
}

export default function ExchangePage({ params }: Props) {
  const exchange = getExchangeBySlug(params.slug);
  if (!exchange) notFound();
  return <ExchangeProfile exchange={exchange} />;
}
