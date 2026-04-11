import { normalizeIdInput } from './idNormalizer';

describe('normalizeIdInput', () => {
  it('trims and uppercases ASCII characters', () => {
    expect(normalizeIdInput('  ab-12  ')).toBe('AB-12');
  });

  it('normalizes full-width alphanumeric input', () => {
    expect(normalizeIdInput(' ａｂ１２ ')).toBe('AB12');
  });
});
