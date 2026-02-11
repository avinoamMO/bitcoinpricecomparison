"use client";

import { useEffect, useRef } from "react";
import { adConfig } from "@/lib/ad-config";

/**
 * Horizontal banner ad (728x90 responsive).
 * Used at top of page and between content sections.
 * Shows a styled placeholder when no ad network is configured.
 */
export function AdBanner() {
  const network = adConfig.activeNetwork;
  const adRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!network || !adRef.current || pushed.current) return;

    if (network === "adsense" && adConfig.adsense?.slotBanner) {
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
      <div className="w-full flex justify-center my-4">
        <div className="w-full max-w-[728px]">
          <div className="rounded-lg border border-border/40 bg-card/30 px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-muted-foreground/70">
                Advertise Here
              </span>
              <span className="text-xs text-muted-foreground/40">
                Reach crypto traders and investors
              </span>
            </div>
            <a
              href="mailto:advertise@cryptoroi.com"
              className="shrink-0 text-xs font-medium text-primary/60 hover:text-primary transition-colors border border-primary/20 hover:border-primary/40 rounded-md px-3 py-1.5"
            >
              Get in touch
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ─── AdSense ────────────────────────────────────────────────────────────────
  if (network === "adsense" && adConfig.adsense?.slotBanner) {
    return (
      <div className="w-full flex justify-center my-4">
        <div className="w-full max-w-[728px]">
          <span className="block text-[10px] text-muted-foreground/40 mb-1">
            Advertisement
          </span>
          <div ref={adRef}>
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client={adConfig.adsense.clientId}
              data-ad-slot={adConfig.adsense.slotBanner}
              data-ad-format="horizontal"
              data-full-width-responsive="true"
            />
          </div>
        </div>
      </div>
    );
  }

  // ─── Coinzilla ──────────────────────────────────────────────────────────────
  if (network === "coinzilla" && adConfig.coinzilla?.zoneId) {
    return (
      <div className="w-full flex justify-center my-4">
        <div className="w-full max-w-[728px]">
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
  if (network === "custom" && adConfig.custom?.slotBanner) {
    return (
      <div className="w-full flex justify-center my-4">
        <div className="w-full max-w-[728px]">
          <span className="block text-[10px] text-muted-foreground/40 mb-1">
            Advertisement
          </span>
          <div data-ad-slot={adConfig.custom.slotBanner} />
        </div>
      </div>
    );
  }

  return null;
}
