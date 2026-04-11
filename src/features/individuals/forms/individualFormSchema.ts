import { z } from 'zod';

export const individualFormSchema = z
  .object({
    species_id: z.string().trim().min(1, '種を選択してください'),
    id: z.string().trim().min(1, '個体IDを入力してください'),
    pairing_fiscal_year: z.string().trim(),
    pairing_id: z.string().trim(),
    male_parent_id: z.string().trim(),
    female_parent_id: z.string().trim(),
    morph: z.string().trim(),
    bloodline: z.string().trim(),
    gender_category: z.string().trim().min(1, '雌雄区分を選択してください'),
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
    if (!values.hatch_date) {
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
  });

export type IndividualFormValues = z.infer<typeof individualFormSchema>;
