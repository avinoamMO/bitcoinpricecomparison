"use client";

import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { Currency, DepositMethod, CryptoAsset, ASSET_CONFIG, ExchangeRegion } from "@/types";
import { REGION_EMOJI, REGION_LABEL, getRegionCountryGroups, countryCodeToFlag, countryNameToCode } from "@/lib/country-flags";
import { COUNTRY_NAMES } from "@/lib/exchange-registry";

const CS: Record<string, string> = { USD: "$", EUR: "\u20AC", ILS: "\u20AA", GBP: "\u00A3" };
const DL: Record<string, string> = { bank_transfer: "Bank Transfer", credit_card: "Credit Card", crypto: "Crypto", wire: "Wire" };
const QA = [100, 500, 1000, 5000, 10000, 50000];
const CURR: Currency[] = ["USD", "EUR", "ILS", "GBP"];
const DM: DepositMethod[] = ["bank_transfer", "credit_card", "crypto", "wire"];
const ASSETS: CryptoAsset[] = ["BTC", "ETH", "DOGE"];
const REGION_GROUPS = getRegionCountryGroups();

interface Props {
  amount: number; currency: Currency; depositMethod: DepositMethod;
  asset: CryptoAsset; onAssetChange: (a: CryptoAsset) => void;
  onAmountChange: (n: number) => void; onCurrencyChange: (c: Currency) => void; onDepositMethodChange: (m: DepositMethod) => void;
  selectedRegion: ExchangeRegion | "All"; onRegionChange: (r: ExchangeRegion | "All") => void;
  selectedCountry: string; onCountryChange: (c: string) => void;
}

export function AmountInput({
  amount, currency, depositMethod, asset,
  onAssetChange, onAmountChange, onCurrencyChange, onDepositMethodChange,
  selectedRegion, onRegionChange, selectedCountry, onCountryChange,
}: Props) {
  // Derive combined value for region/country Select
  const regionValue = selectedCountry !== "All"
    ? (() => { const c = countryNameToCode(selectedCountry); return c ? `country:${c}` : "all"; })()
    : selectedRegion !== "All" ? `region:${selectedRegion}` : "all";

  const regionDisplay = selectedCountry !== "All"
    ? (() => { const c = countryNameToCode(selectedCountry); return c ? `${countryCodeToFlag(c)} ${selectedCountry}` : selectedCountry; })()
    : selectedRegion !== "All"
    ? `${REGION_EMOJI[selectedRegion]} ${REGION_LABEL[selectedRegion]}`
    : `${REGION_EMOJI.All} All Regions`;

  function handleRegionSelect(value: string) {
    if (value === "all") {
      onRegionChange("All");
      onCountryChange("All");
    } else if (value.startsWith("region:")) {
      onRegionChange(value.slice(7) as ExchangeRegion);
      onCountryChange("All");
    } else if (value.startsWith("country:")) {
      const code = value.slice(8);
      onCountryChange(COUNTRY_NAMES[code] || code);
      onRegionChange("All");
    }
  }

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

      {/* Bottom row: Region/Country | Currency | Deposit Method */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Region/Country dropdown */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Region</label>
          <Select.Root value={regionValue} onValueChange={handleRegionSelect}>
            <Select.Trigger
              className="w-full h-10 px-3 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 cursor-pointer flex items-center justify-between gap-2"
              aria-label="Select region or country"
            >
              <span className="truncate">{regionDisplay}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                className="overflow-hidden rounded-xl border border-border bg-card shadow-xl shadow-black/30 z-50"
                position="popper" sideOffset={4}
              >
                <Select.Viewport className="p-1.5 max-h-72 overflow-y-auto">
                  <Select.Item
                    value="all"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer outline-none data-[highlighted]:bg-gold/10 data-[highlighted]:text-gold text-foreground transition-colors"
                  >
                    <Select.ItemText>{REGION_EMOJI.All} All Regions</Select.ItemText>
                    <Select.ItemIndicator className="ml-auto">
                      <Check className="h-3.5 w-3.5 text-gold" />
                    </Select.ItemIndicator>
                  </Select.Item>

                  <Select.Separator className="h-px bg-border my-1" />

                  {REGION_GROUPS.map((group) => (
                    <Select.Group key={group.region}>
                      <Select.Item
                        value={`region:${group.region}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer outline-none data-[highlighted]:bg-gold/10 data-[highlighted]:text-gold text-foreground transition-colors"
                      >
                        <Select.ItemText>{group.emoji} {group.label}</Select.ItemText>
                        <Select.ItemIndicator className="ml-auto">
                          <Check className="h-3.5 w-3.5 text-gold" />
                        </Select.ItemIndicator>
                      </Select.Item>
                      {group.countries.map((c) => (
                        <Select.Item
                          key={c.code}
                          value={`country:${c.code}`}
                          className="flex items-center gap-2 px-3 py-2 pl-7 rounded-lg text-sm cursor-pointer outline-none data-[highlighted]:bg-gold/10 data-[highlighted]:text-gold text-muted-foreground data-[highlighted]:text-gold transition-colors"
                        >
                          <Select.ItemText>{c.flag} {c.name}</Select.ItemText>
                          <Select.ItemIndicator className="ml-auto">
                            <Check className="h-3.5 w-3.5 text-gold" />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.Group>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
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
    </div>
  );
}
