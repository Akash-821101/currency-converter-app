import {fetchRates, fetchCurrencies, clearRatesCache} from '../../src/services/exchangeRateService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
  getAllKeys: jest.fn(),
}));

jest.mock('axios');

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockGet = axios.get as jest.Mock;
const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockSetItem = AsyncStorage.setItem as jest.Mock;
const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;
const mockGetAllKeys = AsyncStorage.getAllKeys as jest.Mock;

const mockRates = {
  base: 'USD',
  date: '2024-01-15',
  rates: {EUR: 0.92, GBP: 0.78},
};

beforeEach(() => {
  jest.clearAllMocks();
  mockSetItem.mockResolvedValue(undefined);
  mockRemoveItem.mockResolvedValue(undefined);
});

describe('fetchRates', () => {
  it('fetches from API when no cache exists and caches the result', async () => {
    mockGetItem.mockResolvedValue(null);
    mockGet.mockResolvedValue({data: mockRates});

    const result = await fetchRates('USD');

    expect(mockGet).toHaveBeenCalledWith(
      'https://api.frankfurter.app/latest?from=USD',
    );
    expect(result).toEqual(mockRates);
    expect(mockSetItem).toHaveBeenCalledWith(
      'rates_USD',
      expect.any(String),
    );
  });

  it('returns cached data without hitting the API when cache is fresh', async () => {
    const fresh = {data: mockRates, timestamp: Date.now()};
    mockGetItem.mockResolvedValue(JSON.stringify(fresh));

    const result = await fetchRates('USD');

    expect(mockGet).not.toHaveBeenCalled();
    expect(result).toEqual(mockRates);
  });

  it('refetches when the cache is older than 1 hour', async () => {
    const staleTimestamp = Date.now() - 2 * 60 * 60 * 1000;
    const stale = {data: {...mockRates, date: '2024-01-14'}, timestamp: staleTimestamp};
    mockGetItem.mockResolvedValue(JSON.stringify(stale));
    mockGet.mockResolvedValue({data: mockRates});

    const result = await fetchRates('USD');

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockRates);
  });

  it('falls back to stale cache when the network request fails', async () => {
    const staleTimestamp = Date.now() - 2 * 60 * 60 * 1000;
    const stale = {data: mockRates, timestamp: staleTimestamp};
    mockGetItem.mockResolvedValue(JSON.stringify(stale));
    mockGet.mockRejectedValue(new Error('Network error'));

    const result = await fetchRates('USD');

    expect(result).toEqual(mockRates);
  });

  it('throws a user-friendly error when the network fails and there is no cache', async () => {
    mockGetItem.mockResolvedValue(null);
    mockGet.mockRejectedValue(new Error('Network error'));

    await expect(fetchRates('USD')).rejects.toThrow(
      'Unable to fetch exchange rates. Check your connection.',
    );
  });
});

describe('fetchCurrencies', () => {
  it('returns parsed currencies from the API and caches them', async () => {
    mockGetItem.mockResolvedValue(null);
    mockGet.mockResolvedValue({data: {USD: 'US Dollar', EUR: 'Euro'}});

    const result = await fetchCurrencies();

    expect(result).toEqual([
      {code: 'USD', name: 'US Dollar'},
      {code: 'EUR', name: 'Euro'},
    ]);
    expect(mockSetItem).toHaveBeenCalledWith(
      'currencies_list',
      expect.any(String),
    );
  });

  it('returns cached currencies without hitting the API', async () => {
    const cached = [{code: 'USD', name: 'US Dollar'}];
    mockGetItem.mockResolvedValue(JSON.stringify(cached));

    const result = await fetchCurrencies();

    expect(mockGet).not.toHaveBeenCalled();
    expect(result).toEqual(cached);
  });
});

describe('clearRatesCache', () => {
  it('removes all keys prefixed with rates_ and leaves other keys intact', async () => {
    mockGetAllKeys.mockResolvedValue(['rates_USD', 'rates_EUR', 'currencies_list']);

    await clearRatesCache();

    expect(mockRemoveItem).toHaveBeenCalledWith('rates_USD');
    expect(mockRemoveItem).toHaveBeenCalledWith('rates_EUR');
    expect(mockRemoveItem).not.toHaveBeenCalledWith('currencies_list');
    expect(mockRemoveItem).toHaveBeenCalledTimes(2);
  });

  it('does nothing when there are no rate keys', async () => {
    mockGetAllKeys.mockResolvedValue(['currencies_list']);

    await clearRatesCache();

    expect(mockRemoveItem).not.toHaveBeenCalled();
  });
});
