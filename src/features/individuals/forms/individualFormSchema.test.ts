import { createEmptyIndividualFormValues } from './individualFormMapper';
import { individualFormSchema } from './individualFormSchema';

describe('individualFormSchema', () => {
  it('requires hatch date', () => {
    const values = { ...createEmptyIndividualFormValues(), species_id: 'leo', id: 'A1', hatch_date: '' };
    const result = individualFormSchema.safeParse(values);

    expect(result.success).toBe(false);
  });

  it('requires pairing fiscal year when a pairing id is selected', () => {
    const values = {
      ...createEmptyIndividualFormValues(),
      species_id: 'leo',
      id: 'A1',
      pairing_id: 'P-1',
      pairing_fiscal_year: '',
    };

    const result = individualFormSchema.safeParse(values);
    expect(result.success).toBe(false);
  });

  it('accepts a valid purchase individual payload', () => {
    const values = {
      ...createEmptyIndividualFormValues(),
      species_id: 'leo',
      id: 'A1',
      breeding_category: '1',
      breeder: '',
      purchase_from: 'Shop',
      purchase_price: '12000',
      hatch_date: '2026-04-08',
    };

    expect(individualFormSchema.safeParse(values).success).toBe(true);
  });

  it('accepts empty id for server-side auto numbering', () => {
    const values = {
      ...createEmptyIndividualFormValues(),
      species_id: 'leo',
      id: '',
      hatch_date: '2026-04-08',
    };

    expect(individualFormSchema.safeParse(values).success).toBe(true);
  });
});
