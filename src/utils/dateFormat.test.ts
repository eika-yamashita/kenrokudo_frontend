import {
  formatDateTimeYmdHm,
  formatDateYmd,
  toDateInputValue,
  toDateTimeLocalInputValue,
} from './dateFormat';

describe('dateFormat', () => {
  it('formats date-only values', () => {
    expect(formatDateYmd('2026-04-08T10:15:00')).toBe('2026-04-08');
    expect(toDateInputValue('2026-04-08T10:15:00')).toBe('2026-04-08');
  });

  it('formats date-time values', () => {
    expect(formatDateTimeYmdHm('2026-04-08T10:15:00')).toBe('2026-04-08 10:15');
    expect(toDateTimeLocalInputValue('2026-04-08 10:15:00')).toBe('2026-04-08T10:15');
  });

  it('falls back safely on empty values', () => {
    expect(formatDateYmd(undefined)).toBe('-');
    expect(formatDateTimeYmdHm(null)).toBe('-');
    expect(toDateInputValue('')).toBe('');
  });
});
