import Decimal from 'decimal.js';

export function convert(amount: string, rate: number): string {
  if (!amount || rate === 0) return '';
  try {
    return new Decimal(amount).times(new Decimal(rate)).toFixed(4);
  } catch {
    return '';
  }
}

export function reverseConvert(amount: string, rate: number): string {
  if (!amount || rate === 0) return '';
  try {
    return new Decimal(amount).dividedBy(new Decimal(rate)).toFixed(4);
  } catch {
    return '';
  }
}

export function trimTrailingZeros(value: string): string {
  if (!value.includes('.')) return value;
  return value.replace(/\.?0+$/, '');
}
