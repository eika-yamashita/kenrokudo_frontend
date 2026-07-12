import { createEmptyIndividualFormValues } from './individualFormMapper';
import { individualFormSchema } from './individualFormSchema';

describe('individualFormSchema', () => {
  it('requires hatch date', () => {
    const values = {
      ...createEmptyIndividualFormValues(),
      species_id: 'leo',
      id: 'A1',
      hatch_date: '',
      visual_morph_id: '001',
    };
    const result = individualFormSchema.safeParse(values);

    expect(result.success).toBe(false);
  });

  it('allows empty hatch date for purchase individuals', () => {
    const values = {
      ...createEmptyIndividualFormValues(),
      species_id: 'leo',
      id: 'A1',
      breeding_category: '1',
      breeder: '',
      hatch_date: '',
      visual_morph_id: '001',
    };

    expect(individualFormSchema.safeParse(values).success).toBe(true);
  });

  it('requires fiscal year', () => {
    const values = {
      ...createEmptyIndividualFormValues(),
      species_id: 'leo',
      fiscal_year: '',
      hatch_date: '2026-04-08',
      visual_morph_id: '001',
    };

    expect(individualFormSchema.safeParse(values).success).toBe(false);
  });

  it('requires pairing fiscal year when a pairing id is selected', () => {
    const values = {
      ...createEmptyIndividualFormValues(),
      species_id: 'leo',
      id: 'A1',
      pairing_id: 'P-1',
      pairing_fiscal_year: '',
      visual_morph_id: '001',
    };

    const result = individualFormSchema.safeParse(values);
    expect(result.success).toBe(false);
  });

  it('requires pairing id for self-breeding individuals', () => {
    const values = {
      ...createEmptyIndividualFormValues(),
      species_id: 'leo',
      pairing_id: '',
      hatch_date: '2026-04-08',
      visual_morph_id: '001',
    };

    expect(individualFormSchema.safeParse(values).success).toBe(false);
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
      visual_morph_id: '001',
    };

    expect(individualFormSchema.safeParse(values).success).toBe(true);
  });

  it('accepts empty id for server-side auto numbering', () => {
    const values = {
      ...createEmptyIndividualFormValues(),
      species_id: 'leo',
      id: '',
      pairing_fiscal_year: '2026',
      pairing_id: 'A',
      hatch_date: '2026-04-08',
      visual_morph_id: '001',
    };

    expect(individualFormSchema.safeParse(values).success).toBe(true);
  });

  it('rejects the same morph across het and possible het', () => {
    const values = {
      ...createEmptyIndividualFormValues(),
      species_id: 'leo',
      id: '',
      pairing_fiscal_year: '2026',
      pairing_id: 'A',
      hatch_date: '2026-04-08',
      visual_morph_id: '001',
      het_entries: [{ morph_id: '002' }],
      possible_het_entries: [{ morph_id: '002', possible_het_percentage: '66' }],
    };

    expect(individualFormSchema.safeParse(values).success).toBe(false);
  });
});
