import type { Individual } from '../../../api/models/Individual';
import type { IndividualMorph } from '../../../api/models/IndividualMorph';
import * as Encoding from 'encoding-japanese';
import { formatGenderCategory } from '../../../utils/genderCategory';

const EXPRESSION_VISUAL = '0';
const EXPRESSION_HET = '1';
const EXPRESSION_POSSIBLE_HET = '2';
const CSV_FORMULA_PREFIX = /^[\t\r ]*[=+\-@]/;

const bySortOrder = (a: IndividualMorph, b: IndividualMorph) => (a.sort_order ?? 0) - (b.sort_order ?? 0);

const escapeCsvCell = (raw: string) => {
  const safe = CSV_FORMULA_PREFIX.test(raw) ? `'${raw}` : raw;
  return /[",\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

const formatHatchDate = (raw: string | undefined) => {
  if (!raw) return '';
  const match = raw.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[1]}/${match[2]}/${match[3]}` : raw;
};

const formatAmount = (amount: number | undefined) =>
  amount === undefined || amount === null ? '' : `￥${amount.toLocaleString('ja-JP')}`;

export const getVisualMorphForCsv = (individual: Pick<Individual, 'morph_entries'>) => {
  const visual = individual.morph_entries?.find((entry) => entry.expression_category === EXPRESSION_VISUAL);
  return visual?.bloodline_name || visual?.morph_name || '';
};

export const getHeteroForCsv = (individual: Pick<Individual, 'morph_entries'>) => {
  const entries = individual.morph_entries ?? [];
  const heteros = entries
    .filter((entry) => entry.expression_category === EXPRESSION_HET && entry.morph_name)
    .sort(bySortOrder)
    .map((entry) => `het ${entry.morph_name}`);
  const possibleHeteros = entries
    .filter((entry) => entry.expression_category === EXPRESSION_POSSIBLE_HET && entry.morph_name)
    .sort(bySortOrder)
    .map((entry) => {
      const percentage = entry.possible_het_percentage;
      return `poss het ${entry.morph_name}${percentage === undefined ? '' : ` ${percentage}%`}`;
    });

  return [...heteros, ...possibleHeteros].join(' / ');
};

export const createIndividualCsv = (individuals: Individual[]) => {
  const rows = individuals.map((individual) => [
    getVisualMorphForCsv(individual),
    getHeteroForCsv(individual),
    individual.id,
    formatHatchDate(individual.hatch_date),
    formatGenderCategory(individual.gender_category) === '-' ? '' : formatGenderCategory(individual.gender_category),
    formatAmount(individual.sales_price_tax_in),
  ]);

  return `${[
    ['モルフ', 'ヘテロ', '個体ID', 'ハッチ日', '雌雄', '金額'],
    ...rows,
  ]
    .map((row) => row.map(escapeCsvCell).join(','))
    .join('\r\n')}\r\n`;
};

export const encodeIndividualCsv = (individuals: Individual[]) => {
  const unicode = Encoding.stringToCode(createIndividualCsv(individuals));
  const shiftJis = Encoding.convert(unicode, {
    to: 'SJIS',
    from: 'UNICODE',
    type: 'array',
    fallback: 'error',
  });
  return new Uint8Array(shiftJis);
};

export const createIndividualCsvFilename = (date = new Date()) => {
  const pad2 = (value: number) => String(value).padStart(2, '0');
  return `個体一覧_${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}_${pad2(date.getHours())}${pad2(date.getMinutes())}${pad2(date.getSeconds())}.csv`;
};

export const downloadIndividualCsv = (individuals: Individual[]) => {
  const blob = new Blob([encodeIndividualCsv(individuals)], { type: 'text/csv;charset=shift_jis' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = createIndividualCsvFilename();
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};
