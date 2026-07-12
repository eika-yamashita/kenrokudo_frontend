import { z } from 'zod';

const hetEntrySchema = z.object({
  morph_id: z.string().trim(),
});

const possibleHetEntrySchema = z.object({
  morph_id: z.string().trim(),
  possible_het_percentage: z.string().trim(),
});

export const individualFormSchema = z
  .object({
    species_id: z.string().trim().min(1, '種を選択してください'),
    fiscal_year: z.string().trim().min(1, '登録年度を選択してください'),
    id: z.string().trim(),
    pairing_fiscal_year: z.string().trim(),
    pairing_id: z.string().trim(),
    male_parent_id: z.string().trim(),
    female_parent_id: z.string().trim(),
    visual_morph_id: z.string().trim().min(1, 'モルフを選択してください'),
    het_entries: z.array(hetEntrySchema),
    possible_het_entries: z.array(possibleHetEntrySchema),
    bloodline_id: z.string().trim(),
    gender_category: z.string().trim().min(1, '性別区分を選択してください'),
    breeding_category: z.string().trim().min(1, '繁殖区分を選択してください'),
    breeder: z.string().trim(),
    clutch_date: z.string().trim(),
    hatch_date: z.string().trim(),
    purchase_from: z.string().trim(),
    purchase_price: z.string().trim(),
    purchase_date: z.string().trim(),
    sales_category: z.string().trim(),
    sales_to: z.string().trim(),
    sales_price_tax_ex: z.string().trim(),
    sales_price_tax: z.string().trim(),
    sales_price_tax_in: z.string().trim(),
    sales_date: z.string().trim(),
    death_date: z.string().trim(),
    note: z.string().trim(),
  })
  .superRefine((values, context) => {
    if (values.breeding_category !== '1' && !values.hatch_date) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['hatch_date'],
        message: 'ハッチ日を入力してください',
      });
    }

    if (values.pairing_id && !values.pairing_fiscal_year) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['pairing_fiscal_year'],
        message: 'ペアリング年度を選択してください',
      });
    }

    if (values.breeding_category === '0' && !values.pairing_fiscal_year) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['pairing_fiscal_year'],
        message: '自家繁殖のときはペアリング年度を選択してください',
      });
    }

    if (values.breeding_category === '0' && !values.pairing_id) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['pairing_id'],
        message: '自家繁殖のときはペアリングIDを選択してください',
      });
    }

    const hetIds = values.het_entries
      .map((entry) => entry.morph_id.trim())
      .filter(Boolean);
    const possibleHetIds = values.possible_het_entries
      .map((entry) => entry.morph_id.trim())
      .filter(Boolean);

    const duplicatedHetIds = hetIds.filter((id, index) => hetIds.indexOf(id) !== index);
    if (duplicatedHetIds.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['het_entries'],
        message: 'ヘテロに同じモルフは登録できません',
      });
    }

    const duplicatedPossibleHetIds = possibleHetIds.filter((id, index) => possibleHetIds.indexOf(id) !== index);
    if (duplicatedPossibleHetIds.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['possible_het_entries'],
        message: 'Possヘテロに同じモルフは登録できません',
      });
    }

    const overlappingIds = hetIds.filter((id) => possibleHetIds.includes(id));
    if (overlappingIds.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['possible_het_entries'],
        message: '同じモルフをヘテロとPossヘテロの両方に登録できません',
      });
    }

    values.possible_het_entries.forEach((entry, index) => {
      const morphId = entry.morph_id.trim();
      const percentage = entry.possible_het_percentage.trim();

      if (!morphId && !percentage) {
        return;
      }

      if (!morphId) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['possible_het_entries', index, 'morph_id'],
          message: 'Possヘテロのモルフを選択してください',
        });
      }

      if (!percentage) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['possible_het_entries', index, 'possible_het_percentage'],
          message: 'Possヘテロ率を入力してください',
        });
        return;
      }

      if (!/^\d+$/.test(percentage)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['possible_het_entries', index, 'possible_het_percentage'],
          message: 'Possヘテロ率は0から100の整数で入力してください',
        });
        return;
      }

      const numericPercentage = Number(percentage);
      if (numericPercentage < 0 || numericPercentage > 100) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['possible_het_entries', index, 'possible_het_percentage'],
          message: 'Possヘテロ率は0から100で入力してください',
        });
      }
    });
  });

export type IndividualFormValues = z.infer<typeof individualFormSchema>;
