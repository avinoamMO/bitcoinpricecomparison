"use client";

import { useEffect, useRef } from "react";
import { adConfig } from "@/lib/ad-config";

/**
 * Vertical / square ad (300x250 or 160x600).
 * Used in sidebar positions.
 * Shows a styled placeholder when no ad network is configured.
 */
export function AdSidebar() {
  const network = adConfig.activeNetwork;
  const adRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!network || !adRef.current || pushed.current) return;

    if (network === "adsense" && adConfig.adsense?.slotSidebar) {
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
      <div className="flex justify-center my-4">
        <div className="w-[300px]">
          <div className="rounded-lg border border-border/30 bg-card/20 p-6 flex flex-col items-center justify-center gap-3 aspect-square">
            <div className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center">
              <span className="text-lg text-muted-foreground/30">&#x25C8;</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-sm font-medium text-muted-foreground/60">
                Your Brand Here
              </span>
              <span className="text-xs text-muted-foreground/35 max-w-[200px]">
                Premium sidebar placement for crypto &amp; fintech brands
              </span>
            </div>
            <a
              href="mailto:advertise@cryptoroi.com"
              className="text-xs font-medium text-primary/60 hover:text-primary transition-colors border border-primary/20 hover:border-primary/40 rounded-md px-3 py-1.5"
            >
              Inquire
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ─── AdSense ────────────────────────────────────────────────────────────────
  if (network === "adsense" && adConfig.adsense?.slotSidebar) {
    return (
      <div className="flex justify-center my-4">
        <div className="w-[300px]">
          <span className="block text-[10px] text-muted-foreground/40 mb-1">
            Advertisement
          </span>
          <div ref={adRef}>
            <ins
              className="adsbygoogle"
              style={{ display: "inline-block", width: 300, height: 250 }}
              data-ad-client={adConfig.adsense.clientId}
              data-ad-slot={adConfig.adsense.slotSidebar}
            />
          </div>
        </div>
      </div>
    );
  }

  // ─── Coinzilla ──────────────────────────────────────────────────────────────
  if (network === "coinzilla" && adConfig.coinzilla?.zoneId) {
    return (
      <div className="flex justify-center my-4">
        <div className="w-[300px]">
          <span className="block text-[10px] text-muted-foreground/40 mb-1">
            Advertisement
          </span>
          <div
            className="coinzilla"
            data-zone={adConfig.coinzilla.zoneId}
          />
        </div>
      </div>
    );
  }

  // ─── Custom ─────────────────────────────────────────────────────────────────
  if (network === "custom" && adConfig.custom?.slotSidebar) {
    return (
      <div className="flex justify-center my-4">
        <div className="w-[300px]">
          <span className="block text-[10px] text-muted-foreground/40 mb-1">
            Advertisement
          </span>
          <div data-ad-slot={adConfig.custom.slotSidebar} />
        </div>
      </div>
    );
  }

  return null;
}
