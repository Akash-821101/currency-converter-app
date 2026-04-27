import {
  formatAmount,
  formatRate,
  formatDate,
  formatTime,
  formatDateTime,
} from '../../src/utils/formatting';

describe('formatAmount', () => {
  it('formats to 2 decimal places by default', () => {
    expect(formatAmount('1000')).toBe('1,000.00');
  });

  it('formats to a custom number of decimal places', () => {
    expect(formatAmount('1.23456', 4)).toBe('1.2346');
  });

  it('adds thousands separator for large numbers', () => {
    expect(formatAmount('1234567.89')).toBe('1,234,567.89');
  });

  it('returns 0.00 for an empty string', () => {
    expect(formatAmount('')).toBe('0.00');
  });

  it('returns 0.00 for non-numeric input', () => {
    expect(formatAmount('invalid')).toBe('0.00');
  });

  it('handles a zero value', () => {
    expect(formatAmount('0')).toBe('0.00');
  });
});

describe('formatRate', () => {
  it('formats to 4 decimal places', () => {
    expect(formatRate(1.5)).toBe('1.5000');
  });

  it('rounds the 5th decimal digit', () => {
    expect(formatRate(1.23456)).toBe('1.2346');
  });

  it('formats an integer rate', () => {
    expect(formatRate(1)).toBe('1.0000');
  });

  it('formats a rate less than 1', () => {
    expect(formatRate(0.92)).toBe('0.9200');
  });
});

describe('formatDate', () => {
  it('returns a non-empty string', () => {
    expect(formatDate(Date.now()).length).toBeGreaterThan(0);
  });

  it('includes the year', () => {
    const ts = new Date('2024-06-15T00:00:00.000Z').getTime();
    expect(formatDate(ts)).toMatch(/2024/);
  });
});

describe('formatTime', () => {
  it('returns a non-empty string', () => {
    expect(formatTime(Date.now()).length).toBeGreaterThan(0);
  });
});

describe('formatDateTime', () => {
  it('combines date and time separated by a comma', () => {
    const ts = Date.now();
    const result = formatDateTime(ts);
    expect(result).toContain(',');
    expect(result).toBe(`${formatDate(ts)}, ${formatTime(ts)}`);
  });
});
