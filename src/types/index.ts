export interface Currency {
  code: string;
  name: string;
}

export interface ExchangeRates {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface CachedRates {
  data: ExchangeRates;
  timestamp: number;
}

export interface ConversionRecord {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: string;
  toAmount: string;
  rate: number;
  timestamp: number;
}
