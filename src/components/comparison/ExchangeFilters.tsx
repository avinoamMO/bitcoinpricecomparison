"use client";

import { ExchangeRegion } from "@/types";
import { Search, Filter } from "lucide-react";

export type SortOption = "best_price" | "lowest_fees" | "alphabetical" | "highest_volume";

const REGIONS: { value: ExchangeRegion | "All"; label: string }[] = [
  { value: "All", label: "All" },
  { value: "Global", label: "Global" },
  { value: "Americas", label: "Americas" },
  { value: "Europe", label: "Europe" },
  { value: "Asia", label: "Asia" },
  { value: "Israel", label: "Israel" },
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
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  showFeaturedOnly: boolean;
  onToggleFeatured: () => void;
  totalExchanges: number;
  visibleExchanges: number;
  responsiveExchanges: number;
}

export function ExchangeFilters({
  searchQuery,
  onSearchChange,
  selectedRegion,
  onRegionChange,
  sortBy,
  onSortChange,
  showFeaturedOnly,
  onToggleFeatured,
  totalExchanges,
  visibleExchanges,
  responsiveExchanges,
}: ExchangeFiltersProps) {
  return (
    <div className="space-y-3">
      {/* Stats bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing {visibleExchanges} of {totalExchanges} exchanges
          ({responsiveExchanges} live)
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

      {/* Search + Sort row */}
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

      {/* Region tabs */}
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
      </div>
    </div>
  );
}
