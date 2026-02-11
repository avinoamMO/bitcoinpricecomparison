export const CACHE_DURATION_MS = 30000;
export const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3";
export const DEFAULT_AMOUNT = 1000;
export const DEFAULT_CURRENCY = "USD" as const;
export const DEFAULT_DEPOSIT_METHOD = "bank_transfer" as const;
export const CURRENCY_SYMBOLS: Record<string, string> = { USD: "$", EUR: "\u20AC", ILS: "\u20AA", GBP: "\u00A3" };
export const DEPOSIT_METHOD_LABELS: Record<string, string> = { bank_transfer: "Bank Transfer", credit_card: "Credit Card", crypto: "Crypto Deposit", wire: "Wire Transfer" };
