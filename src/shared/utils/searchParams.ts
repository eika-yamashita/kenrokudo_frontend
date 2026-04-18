type SearchParamValue = string | number | boolean | null | undefined;

export const createSearchString = (values: Record<string, SearchParamValue>) => {
  const params = new URLSearchParams();

  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '' || value === false) {
      return;
    }

    params.set(key, value === true ? '1' : String(value));
  });

  const query = params.toString();
  return query ? `?${query}` : '';
};

export const parsePositiveIntegerParam = (value: string | null, fallback: number) => {
  if (value === null) {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
};

export const parseBooleanFlagParam = (value: string | null) => value === '1';
