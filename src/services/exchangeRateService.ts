import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Currency, ExchangeRates, CachedRates} from '../types';

const BASE_URL = 'https://api.frankfurter.app';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function ratesCacheKey(base: string) {
  return `rates_${base}`;
}

export async function fetchRates(base: string): Promise<ExchangeRates> {
  const key = ratesCacheKey(base);

  const cached = await AsyncStorage.getItem(key);
  if (cached) {
    const parsed: CachedRates = JSON.parse(cached);
    if (Date.now() - parsed.timestamp < CACHE_TTL) {
      return parsed.data;
    }
  }

  try {
    const {data} = await axios.get<ExchangeRates>(
      `${BASE_URL}/latest?from=${base}`,
    );
    const toCache: CachedRates = {data, timestamp: Date.now()};
    await AsyncStorage.setItem(key, JSON.stringify(toCache));
    return data;
  } catch {
    if (cached) {
      return (JSON.parse(cached) as CachedRates).data;
    }
    throw new Error('Unable to fetch exchange rates. Check your connection.');
  }
}

export async function fetchCurrencies(): Promise<Currency[]> {
  const key = 'currencies_list';
  const cached = await AsyncStorage.getItem(key);
  if (cached) {
    return JSON.parse(cached);
  }

  const {data} = await axios.get<Record<string, string>>(
    `${BASE_URL}/currencies`,
  );
  const currencies: Currency[] = Object.entries(data).map(([code, name]) => ({
    code,
    name,
  }));
  await AsyncStorage.setItem(key, JSON.stringify(currencies));
  return currencies;
}

export async function clearRatesCache(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  const rateKeys = (keys as string[]).filter(k => k.startsWith('rates_'));
  await Promise.all(rateKeys.map(k => AsyncStorage.removeItem(k)));
}
