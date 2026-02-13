"use client";

import { useState, useRef, useEffect } from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check, Search, X } from "lucide-react";
import { Currency, DepositMethod, CryptoAsset, ASSET_CONFIG, ExchangeData } from "@/types";
import { countryCodeToFlag } from "@/lib/country-flags";

const CS: Record<string, string> = { USD: "$", EUR: "\u20AC", ILS: "\u20AA", GBP: "\u00A3" };
const DL: Record<string, string> = { bank_transfer: "Bank Transfer", credit_card: "Credit Card", crypto: "Crypto", wire: "Wire" };
const QA = [100, 500, 1000, 5000, 10000, 50000];
const CURR: Currency[] = ["USD", "EUR", "ILS", "GBP"];
const DM: DepositMethod[] = ["bank_transfer", "credit_card", "crypto", "wire"];
const ASSETS: CryptoAsset[] = ["BTC", "ETH", "DOGE"];

function exchangeFlag(ex: ExchangeData): string {
  if (ex.countries && ex.countries.length > 0) return countryCodeToFlag(ex.countries[0]);
  return "\u{1F310}"; // globe
}

interface Props {
  amount: number; currency: Currency; depositMethod: DepositMethod;
  asset: CryptoAsset; onAssetChange: (a: CryptoAsset) => void;
  onAmountChange: (n: number) => void; onCurrencyChange: (c: Currency) => void; onDepositMethodChange: (m: DepositMethod) => void;
  exchanges: ExchangeData[];
  selectedExchangeIds: Set<string>;
  onToggleExchange: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onClearSelection: () => void;
}

export function AmountInput({
  amount, currency, depositMethod, asset,
  onAssetChange, onAmountChange, onCurrencyChange, onDepositMethodChange,
  exchanges, selectedExchangeIds, onToggleExchange, onSelectAll, onClearSelection,
}: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker on outside click
  useEffect(() => {
    if (!pickerOpen) return;
    function handleClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [pickerOpen]);

  const filteredExchanges = search.trim()
    ? exchanges.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.id.toLowerCase().includes(search.toLowerCase()) ||
        e.country.toLowerCase().includes(search.toLowerCase())
      )
    : exchanges;

  const triggerLabel = selectedExchangeIds.size === 0
    ? `All Exchanges (${exchanges.length})`
    : `${selectedExchangeIds.size} Exchange${selectedExchangeIds.size > 1 ? "s" : ""} Selected`;

  return (
    <div className="space-y-4">
      {/* Amount input with inline asset dropdown */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">I want to buy</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gold text-lg font-bold">{CS[currency]}</span>
          </div>
          <input type="number" value={amount || ""} onChange={(e) => onAmountChange(Number(e.target.value))}
            placeholder="1,000" min={1} step={100} aria-label="Amount to invest"
            className="w-full h-14 pl-10 pr-36 text-2xl font-bold bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all" />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
            <span className="text-sm text-muted-foreground">of</span>
            <Select.Root value={asset} onValueChange={(v) => onAssetChange(v as CryptoAsset)}>
              <Select.Trigger
                className="inline-flex items-center gap-1 text-sm font-semibold text-gold hover:text-gold/80 transition-colors cursor-pointer outline-none"
                aria-label="Select cryptocurrency"
              >
                <span>{ASSET_CONFIG[asset].name}</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content
                  className="overflow-hidden rounded-xl border border-border bg-card shadow-xl shadow-black/30 z-50"
                  position="popper" sideOffset={8}
                >
                  <Select.Viewport className="p-1.5">
                    {ASSETS.map((a) => (
                      <Select.Item
                        key={a} value={a}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer outline-none data-[highlighted]:bg-gold/10 data-[highlighted]:text-gold text-foreground transition-colors"
                      >
                        <span className="font-semibold">{a}</span>
                        <Select.ItemText>{ASSET_CONFIG[a].name}</Select.ItemText>
                        <Select.ItemIndicator className="ml-auto">
                          <Check className="h-3.5 w-3.5 text-gold" />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
        </div>
      </div>

      {/* Quick amount buttons */}
      <div className="flex flex-wrap gap-2">
        {QA.map((q) => (
          <button key={q} onClick={() => onAmountChange(q)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${amount === q ? "bg-gold/20 text-gold border border-gold/30" : "bg-muted text-muted-foreground border border-border hover:border-gold/30"}`}>
            {CS[currency]}{q.toLocaleString()}
          </button>
        ))}
      </div>

      {/* Bottom row: Exchange Picker | Currency | Deposit Method */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Exchange multi-picker */}
        <div ref={pickerRef} className="relative">
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Exchanges</label>
          <button
            onClick={() => setPickerOpen(!pickerOpen)}
            className={`w-full h-10 px-3 bg-muted border rounded-lg text-sm text-foreground cursor-pointer flex items-center justify-between gap-2 transition-all ${
              selectedExchangeIds.size > 0
                ? "border-gold/30 text-gold"
                : "border-border"
            }`}
            aria-label="Pick exchanges"
            aria-expanded={pickerOpen}
          >
            <span className="truncate">{triggerLabel}</span>
            <ChevronDown className={`h-3.5 w-3.5 flex-shrink-0 transition-transform ${pickerOpen ? "rotate-180" : ""}`} />
          </button>

          {pickerOpen && (
            <div className="absolute top-full left-0 w-72 sm:w-80 mt-1 rounded-xl border border-border bg-card shadow-xl shadow-black/30 z-50 p-3 space-y-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search exchanges..."
                  autoFocus
                  className="w-full h-8 pl-8 pr-3 bg-muted border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
                  aria-label="Search exchanges"
                />
              </div>

              {/* Select All / Clear */}
              <div className="flex items-center justify-between text-xs">
                <button
                  onClick={() => onSelectAll(filteredExchanges.map((e) => e.id))}
                  className="text-gold hover:text-gold/80 transition-colors"
                >
                  Select All{search.trim() ? " Matching" : ""}
                </button>
                {selectedExchangeIds.size > 0 && (
                  <button
                    onClick={onClearSelection}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Exchange list */}
              <div className="max-h-56 overflow-y-auto space-y-0.5">
                {filteredExchanges.map((ex) => {
                  const selected = selectedExchangeIds.has(ex.id);
                  const flag = exchangeFlag(ex);
                  return (
                    <button
                      key={ex.id}
                      onClick={() => onToggleExchange(ex.id)}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all text-left ${
                        selected
                          ? "bg-gold/10 text-gold"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <span
                        className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          selected ? "bg-gold border-gold" : "border-border"
                        }`}
                      >
                        {selected && <Check className="h-3 w-3 text-black" />}
                      </span>
                      <span className="text-base leading-none">{flag}</span>
                      <span className="truncate">{ex.name}</span>
                      {ex.featured && <span className="text-[9px] text-gold ml-auto">&#9733;</span>}
                    </button>
                  );
                })}
                {filteredExchanges.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-3">No exchanges match</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Currency dropdown */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Currency</label>
          <select value={currency} onChange={(e) => onCurrencyChange(e.target.value as Currency)}
            className="w-full h-10 px-3 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 appearance-none cursor-pointer" aria-label="Select currency">
            {CURR.map((c) => <option key={c} value={c}>{CS[c]} {c}</option>)}
          </select>
        </div>

        {/* Deposit Method dropdown */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Deposit Method</label>
          <select value={depositMethod} onChange={(e) => onDepositMethodChange(e.target.value as DepositMethod)}
            className="w-full h-10 px-3 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 appearance-none cursor-pointer" aria-label="Select deposit method">
            {DM.map((m) => <option key={m} value={m}>{DL[m]}</option>)}
          </select>
        </div>
      </div>

      {/* Selected exchange chips (shown below the grid when exchanges are picked) */}
      {selectedExchangeIds.size > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {Array.from(selectedExchangeIds).map((id) => {
            const ex = exchanges.find((e) => e.id === id);
            if (!ex) return null;
            return (
              <span key={id} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gold/10 text-gold text-xs border border-gold/20">
                <span className="text-sm leading-none">{exchangeFlag(ex)}</span>
                {ex.name}
                <button onClick={() => onToggleExchange(id)} aria-label={`Remove ${ex.name}`} className="hover:text-gold/70">
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
          <button onClick={onClearSelection} className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1">
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
