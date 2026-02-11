/**
 * Ad network configuration for CryptoROI.
 *
 * All ad slots are opt-in: if the environment variables are not set,
 * no ads render and no external scripts are loaded.
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export type AdNetwork = "adsense" | "coinzilla" | "custom";

export interface AdSenseConfig {
  clientId: string;
  slotBanner: string;
  slotSidebar: string;
  slotInFeed: string;
}

export interface CoinzillaConfig {
  zoneId: string;
}

export interface CustomAdConfig {
  scriptUrl: string;
  slotBanner: string;
  slotSidebar: string;
  slotInFeed: string;
}

export interface AdConfig {
  adsense: AdSenseConfig | null;
  coinzilla: CoinzillaConfig | null;
  custom: CustomAdConfig | null;
  /** Which network to use. First configured network wins. */
  activeNetwork: AdNetwork | null;
}

// ─── Build config from env vars ─────────────────────────────────────────────

function buildAdConfig(): AdConfig {
  // AdSense
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "";
  const adsense: AdSenseConfig | null = adsenseClientId
    ? {
        clientId: adsenseClientId,
        slotBanner: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER ?? "",
        slotSidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR ?? "",
        slotInFeed: process.env.NEXT_PUBLIC_ADSENSE_SLOT_INFEED ?? "",
      }
    : null;

  // Coinzilla (crypto-specific network)
  const coinzillaZoneId = process.env.NEXT_PUBLIC_COINZILLA_ZONE_ID ?? "";
  const coinzilla: CoinzillaConfig | null = coinzillaZoneId
    ? { zoneId: coinzillaZoneId }
    : null;

  // Custom / generic network
  const customScriptUrl = process.env.NEXT_PUBLIC_CUSTOM_AD_SCRIPT_URL ?? "";
  const custom: CustomAdConfig | null = customScriptUrl
    ? {
        scriptUrl: customScriptUrl,
        slotBanner: process.env.NEXT_PUBLIC_CUSTOM_AD_SLOT_BANNER ?? "",
        slotSidebar: process.env.NEXT_PUBLIC_CUSTOM_AD_SLOT_SIDEBAR ?? "",
        slotInFeed: process.env.NEXT_PUBLIC_CUSTOM_AD_SLOT_INFEED ?? "",
      }
    : null;

  // Determine active network (first configured wins)
  let activeNetwork: AdNetwork | null = null;
  if (adsense) activeNetwork = "adsense";
  else if (coinzilla) activeNetwork = "coinzilla";
  else if (custom) activeNetwork = "custom";

  return { adsense, coinzilla, custom, activeNetwork };
}

/** Singleton ad config — evaluated once at module load. */
export const adConfig: AdConfig = buildAdConfig();

/** Quick check: are any ads configured at all? */
export function isAdsEnabled(): boolean {
  return adConfig.activeNetwork !== null;
}
