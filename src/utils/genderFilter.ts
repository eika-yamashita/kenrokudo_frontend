export const isMaleCategory = (value: string | null | undefined): boolean => {
  if (!value) return false;
  const normalized = value.trim();
  return normalized === '1' || normalized.toUpperCase() === 'M' || normalized === '♂';
};

export const isFemaleCategory = (value: string | null | undefined): boolean => {
  if (!value) return false;
  const normalized = value.trim();
  return normalized === '2' || normalized.toUpperCase() === 'F' || normalized === '♀';
};
