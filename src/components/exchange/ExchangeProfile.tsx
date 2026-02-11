"use client";
import { Exchange, DepositMethod } from "@/types";
import { ExchangeProfile as ExchangeProfileData } from "@/data/exchange-profiles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  ExternalLink,
  Star,
  MapPin,
  Calendar,
  CreditCard,
  Coins,
  ThumbsUp,
  ThumbsDown,
  Globe,
  Users,
  Scale,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const CS: Record<string, string> = {
  USD: "$",
  EUR: "\u20AC",
  ILS: "\u20AA",
  GBP: "\u00A3",
};

const DL: Record<string, string> = {
  bank_transfer: "Bank Transfer",
  credit_card: "Credit Card",
  crypto: "Crypto",
  wire: "Wire",
};

function FR({
  label,
  value,
  good,
}: {
  label: string;
  value: string;
  good?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={`text-sm font-medium ${good ? "text-success" : "text-foreground"}`}
      >
        {value}
      </span>
    </div>
  );
}

interface ExchangeProfileProps {
  exchange: Exchange;
  profile?: ExchangeProfileData;
}

export function ExchangeProfile({ exchange, profile }: ExchangeProfileProps) {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">
              {exchange.name}
            </h1>
            {exchange.isIsraeli && <Badge>Israeli</Badge>}
          </div>
          <p className="text-muted-foreground">
            {profile?.longDescription ?? exchange.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Founded {exchange.founded}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {exchange.headquarters}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-gold" />
              {exchange.rating}/5
            </span>
            {profile && (
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {profile.userBase}
              </span>
            )}
          </div>
        </div>
        <a
          href={exchange.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-black rounded-xl font-semibold hover:bg-gold-light transition-colors shadow-lg shadow-gold/20"
        >
          Sign Up <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fee Schedule */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Coins className="h-5 w-5 text-gold" />
            Fee Schedule
          </h2>
          <div className="space-y-3">
            <FR
              label="Maker Fee"
              value={`${(exchange.feeStructure.makerFee * 100).toFixed(2)}%`}
            />
            <FR
              label="Taker Fee"
              value={`${(exchange.feeStructure.takerFee * 100).toFixed(2)}%`}
            />
            <FR
              label="Spread"
              value={`~${(exchange.feeStructure.spreadEstimate * 100).toFixed(2)}%`}
            />
            <FR
              label="BTC Withdrawal"
              value={`${exchange.feeStructure.withdrawalFeeBtc} BTC`}
            />
            <div className="pt-3 border-t border-border">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Deposit Fees
              </h3>
              {Object.entries(exchange.feeStructure.depositFees).map(
                ([m, f]) =>
                  f > 0 ? (
                    <FR
                      key={m}
                      label={DL[m] || m}
                      value={`${(f * 100).toFixed(2)}%`}
                    />
                  ) : exchange.paymentMethods.includes(m as DepositMethod) ? (
                    <FR key={m} label={DL[m] || m} value="Free" good />
                  ) : null
              )}
            </div>
            {exchange.volumeTiers.length > 1 && (
              <div className="pt-3 border-t border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Volume Tiers
                </h3>
                {exchange.volumeTiers.map((t, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t.maxVolume
                        ? `$${(t.minVolume / 1000).toFixed(0)}K-$${(t.maxVolume / 1000).toFixed(0)}K`
                        : `$${(t.minVolume / 1000).toFixed(0)}K+`}
                    </span>
                    <span className="font-mono text-xs">
                      {(t.makerFee * 100).toFixed(2)}%/
                      {(t.takerFee * 100).toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Supported Assets */}
          {profile && profile.supportedAssets.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Coins className="h-5 w-5 text-gold" />
                Supported Assets
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.supportedAssets.map((asset) => (
                  <Badge key={asset} variant="outline">
                    {asset}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Currencies & Deposit Methods */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-gold" />
              Currencies & Deposit Methods
            </h2>
            <div className="mb-3">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Fiat Currencies
              </h3>
              <div className="flex flex-wrap gap-2">
                {exchange.supportedCurrencies.map((c) => (
                  <Badge key={c} variant="outline">
                    {CS[c]} {c}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Deposit Methods
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile
                  ? profile.depositMethods.map((m) => (
                      <Badge key={m} variant="secondary">
                        {m}
                      </Badge>
                    ))
                  : exchange.paymentMethods.map((m) => (
                      <Badge key={m} variant="secondary">
                        {DL[m]}
                      </Badge>
                    ))}
              </div>
            </div>
          </div>

          {/* Region Availability */}
          {profile && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-gold" />
                Region Availability
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.regionAvailability.map((region) => (
                  <Badge key={region} variant="secondary">
                    {region}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Regulation */}
          {profile && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Scale className="h-5 w-5 text-gold" />
                Regulation
              </h2>
              <p className="text-sm text-muted-foreground">
                {profile.regulation}
              </p>
            </div>
          )}

          {/* Security */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-gold" />
              Security Features
            </h2>
            <div className="flex flex-wrap gap-2">
              {exchange.securityFeatures.map((f) => (
                <Badge key={f} variant="success">
                  {f}
                </Badge>
              ))}
            </div>
          </div>

          {/* Pros & Cons */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Pros & Cons</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-success mb-2 flex items-center gap-1">
                  <ThumbsUp className="h-3.5 w-3.5" />
                  Pros
                </h3>
                <ul className="space-y-1">
                  {exchange.pros.map((p, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      <span className="text-success">+</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-danger mb-2 flex items-center gap-1">
                  <ThumbsDown className="h-3.5 w-3.5" />
                  Cons
                </h3>
                <ul className="space-y-1">
                  {exchange.cons.map((c, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      <span className="text-danger">-</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="rounded-xl border border-gold/20 bg-gold/5 p-8 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Compare {exchange.name} Prices in Real Time
        </h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          See how {exchange.name} stacks up against other exchanges for your
          specific purchase amount, including all fees, spreads, and slippage.
        </p>
        <Link href="/">
          <Button size="lg" className="gap-2">
            Compare Prices Now
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
