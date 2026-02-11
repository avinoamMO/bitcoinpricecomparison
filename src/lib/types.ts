export interface FeeTier { takerFee: number; makerFee: number; minVolume: number; maxVolume: number; tierLabel: string; }
export interface ExchangeFees { takerFee: number; makerFee: number; withdrawalFeeBTC: number | null; fiatDepositFee: string; fiatWithdrawalFee: string; feeTiers: FeeTier[]; }
export interface OrderBookData { bestBid: number; bestAsk: number; spreadUSD: number; spreadPercent: number; bidDepth: number; askDepth: number; }
export interface ExchangeData { id: string; name: string; country: string; israeliExchange: boolean; price: number | null; tradingPair: string; fees: ExchangeFees; orderBook: OrderBookData | null; feePageUrl: string; fetchedAt: string; status: 'ok' | 'error'; error?: string; }
export interface ExchangeApiResponse { exchanges: ExchangeData[]; timestamp: string; cache: { pricesCachedAt: string | null; feesCachedAt: string | null; pricesTTL: number; feesTTL: number; }; }
