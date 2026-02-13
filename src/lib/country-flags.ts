import { COUNTRY_TO_REGION, COUNTRY_NAMES } from "./exchange-registry";
import { ExchangeRegion } from "@/types";

/**
 * Converts ISO 3166-1 alpha-2 country code to Unicode flag emoji
 * via regional indicator symbols (U+1F1E6..U+1F1FF).
 */
export function countryCodeToFlag(code: string): string {
  const upper = code.toUpperCase();
  if (upper.length !== 2) return "";
  return String.fromCodePoint(
    ...Array.from(upper).map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  );
}

export const REGION_EMOJI: Record<ExchangeRegion | "All", string> = {
  All: "\u{1F30D}",
  Global: "\u{1F310}",
  Americas: "\u{1F30E}",
  Europe: "\u{1F1EA}\u{1F1FA}",
  APAC: "\u{1F30F}",
  MENA: "\u{1F3DC}\u{FE0F}",
  Africa: "\u{1F30D}",
  Israel: "\u{1F1EE}\u{1F1F1}",
  Other: "\u{1F310}",
};

export const REGION_LABEL: Record<ExchangeRegion | "All", string> = {
  All: "All Regions",
  Global: "Global",
  Americas: "Americas",
  Europe: "Europe",
  APAC: "APAC",
  MENA: "MENA",
  Africa: "Africa",
  Israel: "Israel",
  Other: "Other",
};

export interface CountryEntry {
  code: string;
  name: string;
  flag: string;
}

export interface RegionCountryGroup {
  region: ExchangeRegion;
  emoji: string;
  label: string;
  countries: CountryEntry[];
}

/**
 * Builds grouped region -> countries data for the dropdown.
 */
export function getRegionCountryGroups(): RegionCountryGroup[] {
  const regionMap = new Map<ExchangeRegion, CountryEntry[]>();

  for (const [code, region] of Object.entries(COUNTRY_TO_REGION)) {
    if (!regionMap.has(region)) regionMap.set(region, []);
    regionMap.get(region)!.push({
      code,
      name: COUNTRY_NAMES[code] || code,
      flag: countryCodeToFlag(code),
    });
  }

  for (const countries of Array.from(regionMap.values())) {
    countries.sort((a: CountryEntry, b: CountryEntry) => a.name.localeCompare(b.name));
  }

  const order: ExchangeRegion[] = ["Global", "Americas", "Europe", "APAC", "MENA", "Africa", "Israel"];

  return order
    .filter((r) => regionMap.has(r))
    .map((r) => ({
      region: r,
      emoji: REGION_EMOJI[r],
      label: REGION_LABEL[r],
      countries: regionMap.get(r)!,
    }));
}

/** Reverse lookup: country name -> ISO code. */
const _nameToCode: Record<string, string> = {};
for (const [code, name] of Object.entries(COUNTRY_NAMES)) {
  _nameToCode[name] = code;
}

export function countryNameToCode(name: string): string | undefined {
  return _nameToCode[name];
}
