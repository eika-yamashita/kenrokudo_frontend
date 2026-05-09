import type { Individual } from '../../../api/models/Individual';
import { individualToFormValues } from './individualFormMapper';

describe('individualFormMapper', () => {
  it('normalizes date fields for edit form inputs', () => {
    const individual: Individual = {
      species_id: 'leo',
      fiscal_year: 2026,
      id: 'A1',
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
  });
});
