import type { Individual } from '../../../api/models/Individual';
import type { IndividualFormValues } from './individualFormSchema';

const today = () => new Date().toISOString().slice(0, 10);
const now = () => new Date().toISOString().slice(0, 16);

const toStringValue = (value?: string | number | null) => (value === undefined || value === null ? '' : String(value));

const toOptionalNumber = (value: string) => (value.trim() === '' ? undefined : Number(value));

export const createEmptyIndividualFormValues = (): IndividualFormValues => ({
  species_id: '',
  id: '',
  pairing_fiscal_year: '',
  pairing_id: '',
  male_parent_id: '',
  female_parent_id: '',
  morph: '',
  bloodline: '',
  gender_category: '0',
  breeding_category: '0',
  breeder: '絢禄堂',
  clutch_date: '',
  hatch_date: today(),
  purchase_from: '',
  purchase_price: '',
  purchase_date: '',
  sales_category: '',
  sales_to: '',
  sales_price_tax_ex: '',
  sales_price_tax: '',
  sales_price_tax_in: '',
  sales_date: '',
  death_date: '',
  note: '',
});

export const individualToFormValues = (individual: Individual): IndividualFormValues => ({
  species_id: individual.species_id,
  id: individual.id,
  pairing_fiscal_year: toStringValue(individual.pairing_fiscal_year),
  pairing_id: toStringValue(individual.pairing_id),
  male_parent_id: toStringValue(individual.male_parent_id),
  female_parent_id: toStringValue(individual.female_parent_id),
  morph: toStringValue(individual.morph),
  bloodline: toStringValue(individual.bloodline),
  gender_category: toStringValue(individual.gender_category),
  breeding_category: toStringValue(individual.breeding_category),
  breeder: toStringValue(individual.breeder),
  clutch_date: toStringValue(individual.clutch_date),
  hatch_date: toStringValue(individual.hatch_date),
  purchase_from: toStringValue(individual.purchase_from),
  purchase_price: toStringValue(individual.purchase_price),
  purchase_date: toStringValue(individual.purchase_date),
  sales_category: toStringValue(individual.sales_category),
  sales_to: toStringValue(individual.sales_to),
  sales_price_tax_ex: toStringValue(individual.sales_price_tax_ex),
  sales_price_tax: toStringValue(individual.sales_price_tax),
  sales_price_tax_in: toStringValue(individual.sales_price_tax_in),
  sales_date: toStringValue(individual.sales_date),
  death_date: toStringValue(individual.death_date),
  note: toStringValue(individual.note),
});

export const formValuesToIndividual = (
  values: IndividualFormValues,
  base?: Individual
): Individual => ({
  species_id: values.species_id,
  id: values.id,
  pairing_fiscal_year: toOptionalNumber(values.pairing_fiscal_year),
  pairing_id: values.pairing_id || undefined,
  male_parent_id: values.male_parent_id || undefined,
  female_parent_id: values.female_parent_id || undefined,
  morph: values.morph || undefined,
  bloodline: values.bloodline || undefined,
  gender_category: values.gender_category || undefined,
  breeding_category: values.breeding_category || undefined,
  breeder: values.breeder || undefined,
  clutch_date: values.clutch_date || undefined,
  hatch_date: values.hatch_date || undefined,
  purchase_from: values.purchase_from || undefined,
  purchase_price: toOptionalNumber(values.purchase_price),
  purchase_date: values.purchase_date || undefined,
  sales_category: values.sales_category || undefined,
  sales_to: values.sales_to || undefined,
  sales_price_tax_ex: toOptionalNumber(values.sales_price_tax_ex),
  sales_price_tax: toOptionalNumber(values.sales_price_tax),
  sales_price_tax_in: toOptionalNumber(values.sales_price_tax_in),
  sales_date: values.sales_date || undefined,
  death_date: values.death_date || undefined,
  note: values.note || undefined,
  create_user: base?.create_user ?? 'system',
  create_at: base?.create_at ?? now(),
  update_user: 'system',
  update_at: now(),
});
