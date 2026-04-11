import { createEmptyPairingFormValues } from './pairingFormMapper';
import { pairingFormSchema } from './pairingFormSchema';

describe('pairingFormSchema', () => {
  it('requires species and parent ids', () => {
    const result = pairingFormSchema.safeParse(createEmptyPairingFormValues());
    expect(result.success).toBe(false);
  });

  it('accepts a valid pairing form payload', () => {
    const result = pairingFormSchema.safeParse({
      species_id: 'leo',
      pairing_id: 'A',
      fiscal_year: '2026',
      male_parent_id: 'M1',
      female_parent_id: 'F1',
      pairing_date: '2026-04-08',
      note: '',
    });

    expect(result.success).toBe(true);
  });
});
