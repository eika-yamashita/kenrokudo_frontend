import type { Individual } from '../../../api/models/Individual';
import { createEmptyIndividualFormValues, formValuesToIndividual, individualToFormValues } from './individualFormMapper';

describe('individualFormMapper', () => {
  it('normalizes date fields for edit form inputs', () => {
    const individual: Individual = {
      species_id: 'leo',
      fiscal_year: 2026,
      id: 'A1',
      morph_entries: [
        {
          morph_id: '001',
          morph_name: 'Mack Snow',
          bloodline_id: 'BL001',
          bloodline_name: 'US Line',
          expression_category: '0',
          sort_order: 0,
        },
        {
          morph_id: '002',
          morph_name: 'Tremper Albino',
          expression_category: '1',
          sort_order: 0,
        },
        {
          morph_id: '003',
          morph_name: 'Eclipse',
          expression_category: '2',
          possible_het_percentage: 66,
          sort_order: 0,
        },
      ],
      clutch_date: '2026-04-01T00:00:00',
      hatch_date: '2026-04-08 12:34:56',
      purchase_date: '2026-04-10',
      sales_date: '2026-05-01T09:15:00+09:00',
      death_date: null as unknown as string,
      create_user: 'system',
      create_at: '2026-05-09T12:00:00',
    };

    const values = individualToFormValues(individual);

    expect(values.fiscal_year).toBe('2026');
    expect(values.clutch_date).toBe('2026-04-01');
    expect(values.hatch_date).toBe('2026-04-08');
    expect(values.purchase_date).toBe('2026-04-10');
    expect(values.sales_date).toBe('2026-05-01');
    expect(values.death_date).toBe('');
    expect(values.visual_morph_id).toBe('001');
    expect(values.bloodline_id).toBe('BL001');
    expect(values.het_entries[0]?.morph_id).toBe('002');
    expect(values.possible_het_entries[0]?.morph_id).toBe('003');
    expect(values.possible_het_entries[0]?.possible_het_percentage).toBe('66');
  });

  it('does not add audit timestamps to an API payload', () => {
    const payload = formValuesToIndividual({
      ...createEmptyIndividualFormValues(),
      species_id: 'leo',
      fiscal_year: '2026',
      id: 'A1',
      visual_morph_id: '001',
    });

    expect(payload).not.toHaveProperty('create_user');
    expect(payload).not.toHaveProperty('create_at');
    expect(payload).not.toHaveProperty('update_user');
    expect(payload).not.toHaveProperty('update_at');
  });
});
