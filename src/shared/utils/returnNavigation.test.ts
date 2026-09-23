import { createReturnNavigationState, getReturnTo } from './returnNavigation';

describe('returnNavigation', () => {
  it('accepts internal admin return destinations', () => {
    const returnTo = '/admin/pairings/detail/leo/2026/P1?speciesId=leo&fiscalYear=2026';
    expect(getReturnTo({ returnTo })).toBe(returnTo);
    expect(createReturnNavigationState(returnTo)).toEqual({ returnTo });
  });

  it('rejects external or invalid return destinations', () => {
    expect(getReturnTo({ returnTo: 'https://example.com' })).toBeUndefined();
    expect(getReturnTo(null)).toBeUndefined();
  });
});
