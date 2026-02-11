"use client";

import { Currency, DepositMethod, CryptoAsset, ASSET_CONFIG } from "@/types";

const CS: Record<string, string> = { USD: "$", EUR: "\u20AC", ILS: "\u20AA", GBP: "\u00A3" };
const DL: Record<string, string> = { bank_transfer: "Bank Transfer", credit_card: "Credit Card", crypto: "Crypto", wire: "Wire" };
const QA = [100, 500, 1000, 5000, 10000, 50000];
const CURR: Currency[] = ["USD", "EUR", "ILS", "GBP"];
const DM: DepositMethod[] = ["bank_transfer", "credit_card", "crypto", "wire"];
const ASSETS: CryptoAsset[] = ["BTC", "ETH", "DOGE"];

interface Props {
  amount: number; currency: Currency; depositMethod: DepositMethod;
  asset: CryptoAsset; onAssetChange: (a: CryptoAsset) => void;
  onAmountChange: (n: number) => void; onCurrencyChange: (c: Currency) => void; onDepositMethodChange: (m: DepositMethod) => void;
}

export function AmountInput({ amount, currency, depositMethod, asset, onAssetChange, onAmountChange, onCurrencyChange, onDepositMethodChange }: Props) {
  return (
    <div className="space-y-4">
      {/* Asset selector */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">Asset</label>
        <div className="flex gap-2">
          {ASSETS.map((a) => (
            <button
              key={a}
              onClick={() => onAssetChange(a)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                asset === a
                  ? "bg-gold/20 text-gold border border-gold/30"
                  : "bg-muted text-muted-foreground border border-border hover:border-gold/30"
              }`}
            >
              {a} <span className="text-xs font-normal opacity-70">{ASSET_CONFIG[a].name}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">I want to buy</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gold text-lg font-bold">{CS[currency]}</span>
          </div>
          <input type="number" value={amount || ""} onChange={(e) => onAmountChange(Number(e.target.value))}
            placeholder="1,000" min={1} step={100} aria-label="Amount to invest"
            className="w-full h-14 pl-10 pr-4 text-2xl font-bold bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all" />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center"><span className="text-sm text-muted-foreground">of {ASSET_CONFIG[asset].name}</span></div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {QA.map((q) => (
          <button key={q} onClick={() => onAmountChange(q)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${amount === q ? "bg-gold/20 text-gold border border-gold/30" : "bg-muted text-muted-foreground border border-border hover:border-gold/30"}`}>
            {CS[currency]}{q.toLocaleString()}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Currency</label>
          <select value={currency} onChange={(e) => onCurrencyChange(e.target.value as Currency)}
            className="w-full h-10 px-3 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 appearance-none cursor-pointer" aria-label="Select currency">
            {CURR.map((c) => <option key={c} value={c}>{CS[c]} {c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Deposit Method</label>
          <select value={depositMethod} onChange={(e) => onDepositMethodChange(e.target.value as DepositMethod)}
            className="w-full h-10 px-3 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 appearance-none cursor-pointer" aria-label="Select deposit method">
            {DM.map((m) => <option key={m} value={m}>{DL[m]}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
