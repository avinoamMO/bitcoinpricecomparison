"use client";

import { useState } from "react";
import { ExchangeData, ExchangeRegion } from "@/types";
import { Search, Filter, ChevronDown, ChevronUp, Check, X } from "lucide-react";

export type SortOption = "best_price" | "lowest_fees" | "alphabetical" | "highest_volume";
export type CexDexFilter = "all" | "cex" | "dex";
export type CurrencyPairFilter = "usd" | "eur" | "all";
export type PlatformTypeFilter = "all" | "exchange" | "broker";
export type DepositMethodFilter = "all" | "bank_transfer" | "credit_card" | "crypto" | "cash_p2p";

const REGIONS: { value: ExchangeRegion | "All"; label: string }[] = [
  { value: "All", label: "All" },
  { value: "Global", label: "Global" },
  { value: "Americas", label: "Americas" },
  { value: "Europe", label: "Europe" },
  { value: "APAC", label: "APAC" },
  { value: "MENA", label: "MENA" },
  { value: "Israel", label: "Israel" },
];

const CEX_DEX_OPTIONS: { value: CexDexFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "cex", label: "CEX Only" },
  { value: "dex", label: "DEX Only" },
];

const CURRENCY_PAIR_OPTIONS: { value: CurrencyPairFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "usd", label: "USD" },
  { value: "eur", label: "EUR" },
];

const PLATFORM_TYPE_OPTIONS: { value: PlatformTypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "exchange", label: "Exchanges" },
  { value: "broker", label: "Brokers" },
];

const DEPOSIT_METHOD_OPTIONS: { value: DepositMethodFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "credit_card", label: "Credit Card" },
  { value: "crypto", label: "Crypto" },
  { value: "cash_p2p", label: "Cash/P2P" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "best_price", label: "Best Price" },
  { value: "lowest_fees", label: "Lowest Fees" },
  { value: "highest_volume", label: "Highest Liquidity" },
  { value: "alphabetical", label: "A-Z" },
];

interface ExchangeFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRegion: ExchangeRegion | "All";
  onRegionChange: (region: ExchangeRegion | "All") => void;
  cexDexFilter: CexDexFilter;
  onCexDexFilterChange: (filter: CexDexFilter) => void;
  currencyPairFilter: CurrencyPairFilter;
  onCurrencyPairFilterChange: (filter: CurrencyPairFilter) => void;
  platformTypeFilter: PlatformTypeFilter;
  onPlatformTypeFilterChange: (filter: PlatformTypeFilter) => void;
  depositMethodFilter: DepositMethodFilter;
  onDepositMethodFilterChange: (filter: DepositMethodFilter) => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  availableCountries: string[];
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  showFeaturedOnly: boolean;
  onToggleFeatured: () => void;
  totalExchanges: number;
  visibleExchanges: number;
  responsiveExchanges: number;
  // Exchange selection
  allExchanges: ExchangeData[];
  selectedExchangeIds: Set<string>;
  onToggleExchange: (id: string) => void;
  onSelectAllVisible: () => void;
  onClearSelection: () => void;
}

export function ExchangeFilters({
  searchQuery,
  onSearchChange,
  selectedRegion,
  onRegionChange,
  cexDexFilter,
  onCexDexFilterChange,
  currencyPairFilter,
  onCurrencyPairFilterChange,
  platformTypeFilter,
  onPlatformTypeFilterChange,
  depositMethodFilter,
  onDepositMethodFilterChange,
  selectedCountry,
  onCountryChange,
  availableCountries,
  sortBy,
  onSortChange,
  showFeaturedOnly,
  onToggleFeatured,
  totalExchanges,
  visibleExchanges,
  responsiveExchanges,
  allExchanges,
  selectedExchangeIds,
  onToggleExchange,
  onSelectAllVisible,
  onClearSelection,
}: ExchangeFiltersProps) {
  const [showExchangePicker, setShowExchangePicker] = useState(false);
  const [exchangeSearch, setExchangeSearch] = useState("");

  const filteredExchanges = exchangeSearch.trim()
    ? allExchanges.filter(
        (e) =>
          e.name.toLowerCase().includes(exchangeSearch.toLowerCase()) ||
          e.id.toLowerCase().includes(exchangeSearch.toLowerCase())
      )
    : allExchanges;

  return (
    <div className="space-y-3">
      {/* Stats bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing {visibleExchanges} of {totalExchanges} exchanges
          ({responsiveExchanges} live)
          {selectedExchangeIds.size > 0 && (
            <span className="ml-2 text-gold">
              {selectedExchangeIds.size} selected
            </span>
          )}
        </span>
        <button
          onClick={onToggleFeatured}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
            showFeaturedOnly
              ? "bg-gold/20 text-gold border border-gold/30"
              : "bg-muted text-muted-foreground border border-border hover:border-gold/30"
          }`}
        >
          {showFeaturedOnly ? "Featured Only" : "Show All"}
        </button>
      </div>

      {/* Search + Sort + Country row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search exchanges..."
            className="w-full h-9 pl-9 pr-4 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
            aria-label="Search exchanges"
          />
        </div>

        {/* Country dropdown */}
        <select
          value={selectedCountry}
          onChange={(e) => onCountryChange(e.target.value)}
          className="h-9 px-3 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 appearance-none cursor-pointer"
          aria-label="Filter by country"
        >
          <option value="All">All Countries</option>
          {availableCountries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="h-9 px-3 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 appearance-none cursor-pointer"
            aria-label="Sort by"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Region tabs + CEX/DEX filter + Platform Type filter */}
      <div className="flex flex-wrap gap-1.5">
        {REGIONS.map((region) => (
          <button
            key={region.value}
            onClick={() => onRegionChange(region.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedRegion === region.value
                ? "bg-gold/20 text-gold border border-gold/30"
                : "bg-muted text-muted-foreground border border-border hover:border-gold/30"
            }`}
          >
            {region.label}
          </button>
        ))}

        {/* CEX / DEX filter */}
        <span className="mx-1 border-l border-border" />
        {CEX_DEX_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onCexDexFilterChange(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              cexDexFilter === opt.value
                ? "bg-crypto-purple/20 text-crypto-purple border border-crypto-purple/30"
                : "bg-muted text-muted-foreground border border-border hover:border-crypto-purple/30"
            }`}
          >
            {opt.label}
          </button>
        ))}

        {/* Platform Type filter (Broker vs Exchange) */}
        <span className="mx-1 border-l border-border" />
        {PLATFORM_TYPE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onPlatformTypeFilterChange(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              platformTypeFilter === opt.value
                ? "bg-crypto-blue/20 text-crypto-blue border border-crypto-blue/30"
                : "bg-muted text-muted-foreground border border-border hover:border-crypto-blue/30"
            }`}
          >
            {opt.label}
          </button>
        ))}

        {/* Exchange picker toggle */}
        <button
          onClick={() => setShowExchangePicker(!showExchangePicker)}
          className={`ml-auto px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
            selectedExchangeIds.size > 0
              ? "bg-gold/20 text-gold border border-gold/30"
              : "bg-muted text-muted-foreground border border-border hover:border-gold/30"
          }`}
        >
          {showExchangePicker ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
          {selectedExchangeIds.size > 0
            ? `${selectedExchangeIds.size} Exchanges Selected`
            : "Select Exchanges"}
        </button>
      </div>

      {/* Currency pair + Deposit method filter row */}
      <div className="flex flex-wrap gap-1.5">
        {/* Currency pair filter (USD / EUR / All) */}
        {CURRENCY_PAIR_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onCurrencyPairFilterChange(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currencyPairFilter === opt.value
                ? "bg-crypto-green/20 text-crypto-green border border-crypto-green/30"
                : "bg-muted text-muted-foreground border border-border hover:border-crypto-green/30"
            }`}
          >
            {opt.label}
          </button>
        ))}

        {/* Deposit method filter */}
        <span className="mx-1 border-l border-border" />
        {DEPOSIT_METHOD_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onDepositMethodFilterChange(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              depositMethodFilter === opt.value
                ? "bg-gold/20 text-gold border border-gold/30"
                : "bg-muted text-muted-foreground border border-border hover:border-gold/30"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Exchange Selection Panel */}
      {showExchangePicker && (
        <div className="rounded-xl border border-border bg-card/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Pick Exchanges to Compare
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={onSelectAllVisible}
                className="text-xs text-gold hover:text-gold-light transition-colors"
              >
                Select All
              </button>
              <span className="text-muted-foreground text-xs">|</span>
              <button
                onClick={onClearSelection}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Search within picker */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={exchangeSearch}
              onChange={(e) => setExchangeSearch(e.target.value)}
              placeholder="Find exchange..."
              className="w-full h-8 pl-8 pr-4 bg-muted border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
            />
          </div>

          {/* Selected exchanges summary */}
          {selectedExchangeIds.size > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {Array.from(selectedExchangeIds).map((id) => {
                const ex = allExchanges.find((e) => e.id === id);
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gold/10 text-gold text-xs border border-gold/20"
                  >
                    {ex?.name || id}
                    <button
                      onClick={() => onToggleExchange(id)}
                      className="hover:text-gold-light"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          {/* Exchange checkbox grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 max-h-60 overflow-y-auto">
            {filteredExchanges.map((ex) => {
              const isSelected = selectedExchangeIds.has(ex.id);
              return (
                <button
                  key={ex.id}
                  onClick={() => onToggleExchange(ex.id)}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs transition-all text-left ${
                    isSelected
                      ? "bg-gold/10 text-gold border border-gold/30"
                      : "bg-muted text-muted-foreground border border-border hover:border-gold/20 hover:text-foreground"
                  }`}
                >
                  <span
                    className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-gold border-gold"
                        : "border-border"
                    }`}
                  >
                    {isSelected && (
                      <Check className="h-3 w-3 text-black" />
                    )}
                  </span>
                  <span className="truncate">{ex.name}</span>
                  {ex.featured && (
                    <span className="text-[9px] text-gold">★</span>
                  )}
                </button>
              );
            })}
          </div>

          {filteredExchanges.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-2">
              No exchanges match your search
            </p>
          )}
        </div>
      )}
    </div>
  );
}
