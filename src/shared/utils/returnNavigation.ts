export type ReturnNavigationState = {
  returnTo: string;
};

export const getReturnTo = (state: unknown): string | undefined => {
  if (!state || typeof state !== 'object') {
    return undefined;
  }

  const returnTo = (state as { returnTo?: unknown }).returnTo;
  return typeof returnTo === 'string' && returnTo.startsWith('/admin/') ? returnTo : undefined;
};

export const createReturnNavigationState = (returnTo?: string): ReturnNavigationState | undefined =>
  returnTo ? { returnTo } : undefined;
