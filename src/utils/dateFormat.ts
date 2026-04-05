const pad2 = (value: number) => String(value).padStart(2, '0');

const parseDate = (value: string): Date | null => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDateYmd = (raw: string | null | undefined): string => {
  if (!raw) return '-';

  const trimmed = raw.trim();
  const dateMatch = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
  if (dateMatch) {
    return dateMatch[1];
  }

  const parsed = parseDate(trimmed);
  if (!parsed) return raw;

  return `${parsed.getFullYear()}-${pad2(parsed.getMonth() + 1)}-${pad2(parsed.getDate())}`;
};

export const formatDateTimeYmdHm = (raw: string | null | undefined): string => {
  if (!raw) return '-';

  const trimmed = raw.trim();
  const dateTimeMatch = trimmed.match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})/);
  if (dateTimeMatch) {
    return `${dateTimeMatch[1]} ${dateTimeMatch[2]}:${dateTimeMatch[3]}`;
  }

  const parsed = parseDate(trimmed);
  if (!parsed) return raw;

  return `${parsed.getFullYear()}-${pad2(parsed.getMonth() + 1)}-${pad2(parsed.getDate())} ${pad2(parsed.getHours())}:${pad2(parsed.getMinutes())}`;
};

export const toDateInputValue = (raw: string | null | undefined): string => {
  if (!raw) return '';
  const formatted = formatDateYmd(raw);
  return formatted === '-' ? '' : formatted;
};

export const toDateTimeLocalInputValue = (raw: string | null | undefined): string => {
  if (!raw) return '';

  const trimmed = raw.trim();
  const dateTimeMatch = trimmed.match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})/);
  if (dateTimeMatch) {
    return `${dateTimeMatch[1]}T${dateTimeMatch[2]}:${dateTimeMatch[3]}`;
  }

  const parsed = parseDate(trimmed);
  if (!parsed) return '';

  return `${parsed.getFullYear()}-${pad2(parsed.getMonth() + 1)}-${pad2(parsed.getDate())}T${pad2(parsed.getHours())}:${pad2(parsed.getMinutes())}`;
};
