import {convert, reverseConvert, trimTrailingZeros} from '../../src/utils/conversion';

describe('convert', () => {
  it('multiplies amount by rate accurately', () => {
    expect(convert('100', 1.2)).toBe('120.0000');
  });

  it('avoids floating-point rounding errors', () => {
    // Raw JS: 0.1 * 3 === 0.30000000000000004
    expect(convert('0.1', 3)).toBe('0.3000');
  });

  it('handles large numbers', () => {
    expect(convert('1000000', 85.5)).toBe('85500000.0000');
  });

  it('returns empty string for empty amount', () => {
    expect(convert('', 1.5)).toBe('');
  });

  it('returns empty string for zero rate', () => {
    expect(convert('100', 0)).toBe('');
  });

  it('returns empty string for non-numeric amount', () => {
    expect(convert('abc', 1.5)).toBe('');
  });
});

describe('reverseConvert', () => {
  it('divides amount by rate accurately', () => {
    expect(reverseConvert('120', 1.2)).toBe('100.0000');
  });

  it('handles repeating decimals (1 / 3)', () => {
    expect(reverseConvert('1', 3)).toBe('0.3333');
  });

  it('returns empty string for empty amount', () => {
    expect(reverseConvert('', 1.2)).toBe('');
  });

  it('returns empty string for zero rate', () => {
    expect(reverseConvert('100', 0)).toBe('');
  });

  it('returns empty string for non-numeric amount', () => {
    expect(reverseConvert('abc', 1.2)).toBe('');
  });
});

describe('trimTrailingZeros', () => {
  it('removes all trailing zeros and the decimal point', () => {
    expect(trimTrailingZeros('100.0000')).toBe('100');
  });

  it('removes only trailing zeros, preserving significant digits', () => {
    expect(trimTrailingZeros('1.2300')).toBe('1.23');
  });

  it('leaves an integer string unchanged', () => {
    expect(trimTrailingZeros('42')).toBe('42');
  });

  it('keeps a single significant decimal digit', () => {
    expect(trimTrailingZeros('1.5000')).toBe('1.5');
  });
});
