import { notFound } from "next/navigation";
import { exchanges, getExchangeBySlug } from "@/data/exchanges";
import { ExchangeProfile } from "@/components/exchange/ExchangeProfile";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return exchanges.map((exchange) => ({ slug: exchange.slug }));
}

export default function ExchangePage({ params }: Props) {
  const exchange = getExchangeBySlug(params.slug);
  if (!exchange) notFound();
  return <ExchangeProfile exchange={exchange} />;
}
