import { z } from 'zod';

export const pairingFormSchema = z.object({
  species_id: z.string().trim().min(1, '種IDを選択してください'),
  pairing_id: z.string().trim(),
  fiscal_year: z.string().trim().optional(),
  male_parent_id: z.string().trim().min(1, 'オス親IDを入力してください'),
  female_parent_id: z.string().trim().min(1, 'メス親IDを入力してください'),
  pairing_date: z.string().trim().min(1, 'ペアリング日を入力してください'),
  note: z.string().trim(),
});

export type PairingFormValues = z.infer<typeof pairingFormSchema>;
