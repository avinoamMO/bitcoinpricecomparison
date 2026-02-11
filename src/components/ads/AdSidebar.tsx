"use client";

import { useEffect, useRef } from "react";
import { adConfig } from "@/lib/ad-config";

/**
 * Vertical / square ad (300x250 or 160x600).
 * Used in sidebar positions.
 * Renders nothing when no ad network is configured.
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

  if (!network) return null;

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
