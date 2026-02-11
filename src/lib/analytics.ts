// Plausible Analytics custom event helpers
// Uses window.plausible which is set up by the Plausible script tag.
// All calls are no-ops if Plausible is not loaded (env var not set).

type PlausibleArgs = [string, { props: Record<string, string | number> }];

declare global {
  interface Window {
    plausible?: (...args: PlausibleArgs) => void;
  }
}

function trackEvent(name: string, props: Record<string, string | number>) {
  window.plausible?.(name, { props });
}

/** User clicks an affiliate/visit link on an exchange */
export function trackExchangeClick(exchangeName: string, exchangeId: string, featured: boolean) {
  trackEvent("Exchange Click", {
    exchange: exchangeName,
    exchange_id: exchangeId,
    featured: featured ? "yes" : "no",
  });
}

/** User switches between BTC / ETH / DOGE */
export function trackAssetSwitch(asset: string) {
  trackEvent("Asset Switch", { asset });
}

/** User changes region, currency, CEX/DEX, platform type, or deposit method filter */
export function trackFilterChange(filterType: string, value: string) {
  trackEvent("Filter Change", { filter: filterType, value });
}
