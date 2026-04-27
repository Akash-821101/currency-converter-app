import React from 'react';
import {act, create} from 'react-test-renderer';
import {CurrencyProvider, useCurrency} from '../../src/store/CurrencyContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
  getAllKeys: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../src/services/exchangeRateService', () => ({
  fetchRates: jest.fn().mockResolvedValue({
    base: 'USD',
    date: '2024-01-15',
    rates: {EUR: 0.92, GBP: 0.78},
  }),
  fetchCurrencies: jest.fn().mockResolvedValue([
    {code: 'USD', name: 'US Dollar'},
    {code: 'EUR', name: 'Euro'},
    {code: 'GBP', name: 'British Pound'},
  ]),
  clearRatesCache: jest.fn().mockResolvedValue(undefined),
}));

let ctx: ReturnType<typeof useCurrency>;

function TestConsumer() {
  ctx = useCurrency();
  return null;
}

async function renderProvider() {
  await act(async () => {
    create(
      <CurrencyProvider>
        <TestConsumer />
      </CurrencyProvider>,
    );
  });
}

beforeEach(async () => {
  jest.clearAllMocks();
  // Restore default mock return values after clearAllMocks
  const svc = require('../../src/services/exchangeRateService');
  svc.fetchRates.mockResolvedValue({
    base: 'USD',
    date: '2024-01-15',
    rates: {EUR: 0.92, GBP: 0.78},
  });
  svc.fetchCurrencies.mockResolvedValue([
    {code: 'USD', name: 'US Dollar'},
    {code: 'EUR', name: 'Euro'},
    {code: 'GBP', name: 'British Pound'},
  ]);
  svc.clearRatesCache.mockResolvedValue(undefined);
});

describe('CurrencyProvider — initial state', () => {
  it('defaults to USD → EUR with empty amount', async () => {
    await renderProvider();
    expect(ctx.fromCurrency).toBe('USD');
    expect(ctx.toCurrency).toBe('EUR');
    expect(ctx.fromAmount).toBe('');
    expect(ctx.toAmount).toBe('');
  });

  it('loads currencies on mount', async () => {
    await renderProvider();
    expect(ctx.currencies).toHaveLength(3);
    expect(ctx.currencies[0].code).toBe('USD');
  });

  it('loads rates on mount and sets currentRate', async () => {
    await renderProvider();
    expect(ctx.rates).not.toBeNull();
    expect(ctx.currentRate).toBeCloseTo(0.92);
  });
});

describe('CurrencyProvider — conversions', () => {
  it('computes toAmount when fromAmount is set', async () => {
    await renderProvider();
    act(() => {
      ctx.setFromAmount('100');
    });
    expect(ctx.toAmount).toBe('92.0000');
  });

  it('toAmount is empty when fromAmount is cleared', async () => {
    await renderProvider();
    act(() => {
      ctx.setFromAmount('100');
    });
    act(() => {
      ctx.setFromAmount('');
    });
    expect(ctx.toAmount).toBe('');
  });
});

describe('CurrencyProvider — currency selection', () => {
  it('swaps from and to currencies and clears the amount', async () => {
    await renderProvider();
    act(() => {
      ctx.setFromAmount('50');
    });
    act(() => {
      ctx.swapCurrencies();
    });
    expect(ctx.fromCurrency).toBe('EUR');
    expect(ctx.toCurrency).toBe('USD');
    expect(ctx.fromAmount).toBe('');
  });

  it('updates toCurrency via setToCurrency', async () => {
    await renderProvider();
    act(() => {
      ctx.setToCurrency('GBP');
    });
    expect(ctx.toCurrency).toBe('GBP');
    expect(ctx.currentRate).toBeCloseTo(0.78);
  });
});

describe('CurrencyProvider — history', () => {
  it('adds a record with generated id and timestamp', async () => {
    await renderProvider();
    act(() => {
      ctx.addToHistory({
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        fromAmount: '100',
        toAmount: '92.0000',
        rate: 0.92,
      });
    });
    expect(ctx.history).toHaveLength(1);
    expect(ctx.history[0].id).toBeDefined();
    expect(ctx.history[0].timestamp).toBeGreaterThan(0);
    expect(ctx.history[0].fromCurrency).toBe('USD');
  });

  it('prepends new records so the most recent is first', async () => {
    await renderProvider();
    act(() => {
      ctx.addToHistory({fromCurrency: 'USD', toCurrency: 'EUR', fromAmount: '10', toAmount: '9.2000', rate: 0.92});
    });
    act(() => {
      ctx.addToHistory({fromCurrency: 'USD', toCurrency: 'GBP', fromAmount: '20', toAmount: '15.6000', rate: 0.78});
    });
    expect(ctx.history[0].toCurrency).toBe('GBP');
    expect(ctx.history[1].toCurrency).toBe('EUR');
  });

  it('clears history via clearHistory', async () => {
    await renderProvider();
    act(() => {
      ctx.addToHistory({fromCurrency: 'USD', toCurrency: 'EUR', fromAmount: '100', toAmount: '92.0000', rate: 0.92});
    });
    act(() => {
      ctx.clearHistory();
    });
    expect(ctx.history).toHaveLength(0);
  });
});
