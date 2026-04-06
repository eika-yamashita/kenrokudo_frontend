export const genderCategoryOptions = [
  { value: '0', label: '不明' },
  { value: '1', label: '♂' },
  { value: '2', label: '♀' },
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
