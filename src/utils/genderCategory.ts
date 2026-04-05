export const genderCategoryOptions = [
  { value: '0', label: '0: 不明' },
  { value: '1', label: '1: ♂' },
  { value: '2', label: '2: ♀' },
];

const genderCategoryLabelMap: Record<string, string> = {
  '0': '不明',
  '1': '♂',
  '2': '♀',
  U: '不明',
  M: '♂',
  F: '♀',
};

export const formatGenderCategory = (raw: string | null | undefined): string => {
  if (!raw) return '-';
  const value = raw.trim();
  return genderCategoryLabelMap[value] ?? value;
};
