"use client";

import { useEffect, useRef } from "react";
import { adConfig } from "@/lib/ad-config";

/**
 * Native-style in-feed ad that blends between exchange cards.
 * Less intrusive than banners — styled to match the card grid.
 * Shows a styled placeholder when no ad network is configured.
 */
export function AdInFeed() {
  const network = adConfig.activeNetwork;
  const adRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!network || !adRef.current || pushed.current) return;

    if (network === "adsense" && adConfig.adsense?.slotInFeed) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
          {}
        );
        pushed.current = true;
      } catch {
        // AdSense not loaded yet — safe to ignore
      }
    }
  }, [network]);

  if (!network) {
    return (
      <div className="rounded-xl border border-border/30 bg-card/20 p-5 flex flex-col items-center justify-center min-h-[200px] gap-3">
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-sm font-medium text-muted-foreground/60">
            Sponsor This Comparison
          </span>
          <span className="text-xs text-muted-foreground/35 max-w-[240px]">
            Put your exchange or crypto brand in front of active traders
          </span>
        </div>
        <a
          href="mailto:advertise@cryptoroi.com"
          className="text-xs font-medium text-primary/60 hover:text-primary transition-colors border border-primary/20 hover:border-primary/40 rounded-md px-3 py-1.5"
        >
          Learn more
        </a>
      </div>
    );
  }

  // ─── AdSense ────────────────────────────────────────────────────────────────
  if (network === "adsense" && adConfig.adsense?.slotInFeed) {
    return (
      <div className="rounded-xl border-2 border-border/50 bg-card/50 p-5 flex flex-col items-center justify-center min-h-[200px]">
        <span className="block text-[10px] text-muted-foreground/40 mb-2">
          Advertisement
        </span>
        <div ref={adRef} className="w-full">
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client={adConfig.adsense.clientId}
            data-ad-slot={adConfig.adsense.slotInFeed}
            data-ad-format="fluid"
            data-ad-layout-key="-6t+ed+2i-1n-4w"
          />
        </div>
      </div>
    );
  }

  // ─── Coinzilla ──────────────────────────────────────────────────────────────
  if (network === "coinzilla" && adConfig.coinzilla?.zoneId) {
    return (
      <div className="rounded-xl border-2 border-border/50 bg-card/50 p-5 flex flex-col items-center justify-center min-h-[200px]">
        <span className="block text-[10px] text-muted-foreground/40 mb-2">
          Advertisement
        </span>
        <div
          className="coinzilla w-full"
          data-zone={adConfig.coinzilla.zoneId}
        />
      </div>
    );
  }

  // ─── Custom ─────────────────────────────────────────────────────────────────
  if (network === "custom" && adConfig.custom?.slotInFeed) {
    return (
      <div className="rounded-xl border-2 border-border/50 bg-card/50 p-5 flex flex-col items-center justify-center min-h-[200px]">
        <span className="block text-[10px] text-muted-foreground/40 mb-2">
          Advertisement
        </span>
        <div data-ad-slot={adConfig.custom.slotInFeed} className="w-full" />
      </div>
    );
  }

  return null;
}
