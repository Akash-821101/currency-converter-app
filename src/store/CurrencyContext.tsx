import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import {Currency, ConversionRecord, ExchangeRates} from '../types';
import {
  fetchRates,
  fetchCurrencies,
  clearRatesCache,
} from '../services/exchangeRateService';
import {convert} from '../utils/conversion';

interface State {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: string;
  rates: ExchangeRates | null;
  currencies: Currency[];
  history: ConversionRecord[];
  isLoading: boolean;
  isOffline: boolean;
  error: string | null;
}

type Action =
  | {type: 'SET_FROM_CURRENCY'; payload: string}
  | {type: 'SET_TO_CURRENCY'; payload: string}
  | {type: 'SET_FROM_AMOUNT'; payload: string}
  | {type: 'SET_RATES'; payload: ExchangeRates}
  | {type: 'SET_CURRENCIES'; payload: Currency[]}
  | {type: 'SET_LOADING'; payload: boolean}
  | {type: 'SET_OFFLINE'; payload: boolean}
  | {type: 'SET_ERROR'; payload: string | null}
  | {type: 'ADD_HISTORY'; payload: ConversionRecord}
  | {type: 'CLEAR_HISTORY'};

const initialState: State = {
  fromCurrency: 'USD',
  toCurrency: 'EUR',
  fromAmount: '',
  rates: null,
  currencies: [],
  history: [],
  isLoading: false,
  isOffline: false,
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_FROM_CURRENCY':
      return {...state, fromCurrency: action.payload, rates: null};
    case 'SET_TO_CURRENCY':
      return {...state, toCurrency: action.payload};
    case 'SET_FROM_AMOUNT':
      return {...state, fromAmount: action.payload};
    case 'SET_RATES':
      return {...state, rates: action.payload};
    case 'SET_CURRENCIES':
      return {...state, currencies: action.payload};
    case 'SET_LOADING':
      return {...state, isLoading: action.payload};
    case 'SET_OFFLINE':
      return {...state, isOffline: action.payload};
    case 'SET_ERROR':
      return {...state, error: action.payload};
    case 'ADD_HISTORY':
      return {
        ...state,
        history: [action.payload, ...state.history].slice(0, 100),
      };
    case 'CLEAR_HISTORY':
      return {...state, history: []};
    default:
      return state;
  }
}

interface CurrencyContextValue extends State {
  toAmount: string;
  currentRate: number | null;
  setFromCurrency: (code: string) => void;
  setToCurrency: (code: string) => void;
  setFromAmount: (amount: string) => void;
  swapCurrencies: () => void;
  refreshRates: () => void;
  addToHistory: (record: Omit<ConversionRecord, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  clearCache: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(
  undefined,
);

export function CurrencyProvider({children}: {children: React.ReactNode}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadRates = useCallback(async (base: string) => {
    dispatch({type: 'SET_LOADING', payload: true});
    dispatch({type: 'SET_ERROR', payload: null});
    try {
      const rates = await fetchRates(base);
      dispatch({type: 'SET_RATES', payload: rates});
      dispatch({type: 'SET_OFFLINE', payload: false});
    } catch (e: any) {
      dispatch({type: 'SET_ERROR', payload: e.message});
      dispatch({type: 'SET_OFFLINE', payload: true});
    } finally {
      dispatch({type: 'SET_LOADING', payload: false});
    }
  }, []);

  useEffect(() => {
    fetchCurrencies()
      .then(c => dispatch({type: 'SET_CURRENCIES', payload: c}))
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadRates(state.fromCurrency);
  }, [state.fromCurrency, loadRates]);

  const currentRate = useMemo(() => {
    if (!state.rates) return null;
    return state.rates.rates[state.toCurrency] ?? null;
  }, [state.rates, state.toCurrency]);

  const toAmount = useMemo(() => {
    if (!currentRate || !state.fromAmount) return '';
    return convert(state.fromAmount, currentRate);
  }, [state.fromAmount, currentRate]);

  const setFromCurrency = useCallback((code: string) => {
    dispatch({type: 'SET_FROM_CURRENCY', payload: code});
  }, []);

  const setToCurrency = useCallback((code: string) => {
    dispatch({type: 'SET_TO_CURRENCY', payload: code});
  }, []);

  const setFromAmount = useCallback((amount: string) => {
    dispatch({type: 'SET_FROM_AMOUNT', payload: amount});
  }, []);

  const swapCurrencies = useCallback(() => {
    dispatch({type: 'SET_FROM_CURRENCY', payload: state.toCurrency});
    dispatch({type: 'SET_TO_CURRENCY', payload: state.fromCurrency});
    dispatch({type: 'SET_FROM_AMOUNT', payload: ''});
  }, [state.fromCurrency, state.toCurrency]);

  const refreshRates = useCallback(() => {
    loadRates(state.fromCurrency);
  }, [state.fromCurrency, loadRates]);

  const addToHistory = useCallback(
    (record: Omit<ConversionRecord, 'id' | 'timestamp'>) => {
      const full: ConversionRecord = {
        ...record,
        id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
        timestamp: Date.now(),
      };
      dispatch({type: 'ADD_HISTORY', payload: full});
    },
    [],
  );

  const clearHistory = useCallback(() => {
    dispatch({type: 'CLEAR_HISTORY'});
  }, []);

  const clearCache = useCallback(async () => {
    await clearRatesCache();
    loadRates(state.fromCurrency);
  }, [state.fromCurrency, loadRates]);

  const value: CurrencyContextValue = useMemo(
    () => ({
      ...state,
      toAmount,
      currentRate,
      setFromCurrency,
      setToCurrency,
      setFromAmount,
      swapCurrencies,
      refreshRates,
      addToHistory,
      clearHistory,
      clearCache,
    }),
    [
      state,
      toAmount,
      currentRate,
      setFromCurrency,
      setToCurrency,
      setFromAmount,
      swapCurrencies,
      refreshRates,
      addToHistory,
      clearHistory,
      clearCache,
    ],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return ctx;
}
