const japanDateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export const toJapanDateInputValue = (date = new Date()): string => {
  const parts = japanDateFormatter.formatToParts(date);
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  if (!year || !month || !day) {
    throw new Error('日本時間の日付を生成できませんでした');
  }

  return `${year}-${month}-${day}`;
};

export const getJapanYear = (date = new Date()): number => Number(toJapanDateInputValue(date).slice(0, 4));
