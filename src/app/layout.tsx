import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdScript } from "@/components/ads";
import { Analytics } from "@/components/Analytics";
import { faqItems } from "@/data/faq";

const siteName = "CryptoROI";
const siteUrl = "https://cryptoroi.com";
const defaultTitle =
  "Compare Bitcoin & Crypto Prices Across 100+ Exchanges | CryptoROI";
const defaultDescription =
  "Compare real-time prices, fees, and net ROI for Bitcoin, Ethereum, and Dogecoin across 100+ cryptocurrency exchanges. Find the cheapest way to buy crypto.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: [
    "bitcoin exchange comparison",
    "cheapest bitcoin exchange",
    "bitcoin fee comparison",
    "best place to buy bitcoin",
    "crypto exchange fees",
    "bitcoin ROI calculator",
    "bitcoin trading fees",
    "compare crypto exchanges",
    "ethereum exchange fees",
    "cheapest way to buy crypto",
    "crypto fee calculator",
    "exchange fee comparison tool",
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
    siteName: siteName,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    creator: "@CryptoROI",
    site: "@CryptoROI",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: siteName,
  description: defaultDescription,
  url: siteUrl,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Real-time price comparison across 100+ exchanges",
    "Total cost calculation including fees, spreads, and slippage",
    "Order book simulation for accurate fill prices",
    "Support for Bitcoin, Ethereum, and Dogecoin",
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webApplicationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Analytics />
        <AdScript />
        <Header />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
