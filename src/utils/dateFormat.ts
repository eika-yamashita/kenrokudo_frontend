const pad2 = (value: number) => String(value).padStart(2, '0');

const japanDateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

const formatJapanDateTime = (date: Date): string => {
  const values = Object.fromEntries(
    japanDateTimeFormatter
      .formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value])
  );
  return `${values.year}-${values.month}-${values.day} ${values.hour}:${values.minute}`;
};

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
  if (/(?:Z|[+-]\d{2}:?\d{2})$/i.test(trimmed)) {
    const parsed = parseDate(trimmed);
    return parsed ? formatJapanDateTime(parsed) : raw;
  }

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
