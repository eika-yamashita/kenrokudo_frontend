import type { Individual } from '../../../api/models/Individual';
import * as Encoding from 'encoding-japanese';
import {
  createIndividualCsv,
  createIndividualCsvFilename,
  encodeIndividualCsv,
  getHeteroForCsv,
  getVisualMorphForCsv,
} from './individualCsv';

const individual: Individual = {
  species_id: 'leo',
  fiscal_year: 2026,
  id: 'A,001',
  hatch_date: '2026-04-08T10:15:00',
  gender_category: '1',
  sales_price_tax_in: 20000,
  morph_entries: [
    {
      morph_id: '001',
      morph_name: 'Raptor',
      bloodline_name: 'Bloodline A',
      expression_category: '0',
    },
    { morph_id: '002', morph_name: 'Eclipse', expression_category: '1', sort_order: 1 },
    {
      morph_id: '003',
      morph_name: 'Albino',
      expression_category: '2',
      possible_het_percentage: 66,
      sort_order: 2,
    },
  ],
  create_user: 'system',
  create_at: '2026-04-08T10:15:00',
};

describe('individualCsv', () => {
  test('separates the visual morph from hetero entries', () => {
    expect(getVisualMorphForCsv(individual)).toBe('Bloodline A');
    expect(getHeteroForCsv(individual)).toBe('het Eclipse / poss het Albino 66%');
  });

  test('creates a CRLF CSV and escapes commas', () => {
    expect(createIndividualCsv([individual])).toBe(
      'モルフ,ヘテロ,個体ID,ハッチ日,雌雄,金額\r\n' +
        'Bloodline A,het Eclipse / poss het Albino 66%,"A,001",2026/04/08,♂,"￥20,000"\r\n'
    );
  });

  test('encodes the CSV as Shift_JIS for P-touch Editor', () => {
    const encoded = encodeIndividualCsv([individual]);
    const unicode = Encoding.convert(encoded, { to: 'UNICODE', from: 'SJIS', type: 'array' });

    expect(Encoding.codeToString(unicode)).toBe(createIndividualCsv([individual]));
    expect(Array.from(encoded.slice(0, 2))).toEqual([0x83, 0x82]);
  });

  test('creates a timestamped filename', () => {
    expect(createIndividualCsvFilename(new Date(2026, 3, 8, 9, 5, 7))).toBe('個体一覧_20260408_090507.csv');
  });
});
