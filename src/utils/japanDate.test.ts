import { getJapanYear, toJapanDateInputValue } from './japanDate';

describe('toJapanDateInputValue', () => {
  it('uses the Japanese calendar date around the UTC date boundary', () => {
    expect(toJapanDateInputValue(new Date('2026-09-23T00:30:00+09:00'))).toBe('2026-09-23');
    expect(toJapanDateInputValue(new Date('2026-09-23T23:30:00+09:00'))).toBe('2026-09-23');
  });

  it('uses the Japanese year around New Year', () => {
    expect(getJapanYear(new Date('2027-01-01T00:30:00+09:00'))).toBe(2027);
  });
});
