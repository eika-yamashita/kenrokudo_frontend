import type { Individual } from '../../../api/models/Individual';
import type { IndividualMorph } from '../../../api/models/IndividualMorph';
import { toDateInputValue } from '../../../utils/dateFormat';
import type { IndividualFormValues } from './individualFormSchema';

const today = () => new Date().toISOString().slice(0, 10);
const now = () => new Date().toISOString().slice(0, 16);
const currentYear = () => String(new Date().getFullYear());

const toStringValue = (value?: string | number | null) =>
  value === undefined || value === null ? '' : String(value);

const toOptionalNumber = (value: string) => (value.trim() === '' ? undefined : Number(value));

const emptyHetEntry = () => ({ morph_id: '' });
const emptyPossibleHetEntry = () => ({ morph_id: '', possible_het_percentage: '' });

const toMorphEntries = (individual: Individual): IndividualMorph[] => {
  if (individual.morph_entries && individual.morph_entries.length > 0) {
    return individual.morph_entries;
  }

  return [];
};

export const createEmptyIndividualFormValues = (): IndividualFormValues => ({
  species_id: '',
  fiscal_year: currentYear(),
  id: '',
  pairing_fiscal_year: currentYear(),
  pairing_id: '',
  male_parent_id: '',
  female_parent_id: '',
  visual_morph_id: '',
  het_entries: [emptyHetEntry()],
  possible_het_entries: [emptyPossibleHetEntry()],
  bloodline_id: '',
  gender_category: '0',
  breeding_category: '0',
  breeder: '自家繁殖',
  clutch_date: '',
  hatch_date: today(),
  purchase_from: '',
  purchase_price: '',
  purchase_date: '',
  sales_category: '0',
  sales_to: '',
  sales_price_tax_ex: '',
  sales_price_tax: '',
  sales_price_tax_in: '',
  sales_date: '',
  death_date: '',
  note: '',
});

export const individualToFormValues = (individual: Individual): IndividualFormValues => {
  const morphEntries = toMorphEntries(individual);
  const visualMorph = morphEntries.find((entry) => entry.expression_category === '0');
  const hetEntries = morphEntries
    .filter((entry) => entry.expression_category === '1')
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((entry) => ({ morph_id: entry.morph_id }));
  const possibleHetEntries = morphEntries
    .filter((entry) => entry.expression_category === '2')
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((entry) => ({
      morph_id: entry.morph_id,
      possible_het_percentage: toStringValue(entry.possible_het_percentage),
    }));

  return {
    species_id: individual.species_id,
    fiscal_year: toStringValue(individual.fiscal_year),
    id: individual.id,
    pairing_fiscal_year: toStringValue(individual.pairing_fiscal_year),
    pairing_id: toStringValue(individual.pairing_id),
    male_parent_id: toStringValue(individual.male_parent_id),
    female_parent_id: toStringValue(individual.female_parent_id),
    visual_morph_id: toStringValue(visualMorph?.morph_id),
    het_entries: hetEntries.length > 0 ? [...hetEntries, emptyHetEntry()] : [emptyHetEntry()],
    possible_het_entries:
      possibleHetEntries.length > 0 ? [...possibleHetEntries, emptyPossibleHetEntry()] : [emptyPossibleHetEntry()],
    bloodline_id: toStringValue(visualMorph?.bloodline_id),
    gender_category: toStringValue(individual.gender_category),
    breeding_category: toStringValue(individual.breeding_category),
    breeder: toStringValue(individual.breeder),
    clutch_date: toDateInputValue(individual.clutch_date),
    hatch_date: toDateInputValue(individual.hatch_date),
    purchase_from: toStringValue(individual.purchase_from),
    purchase_price: toStringValue(individual.purchase_price),
    purchase_date: toDateInputValue(individual.purchase_date),
    sales_category: toStringValue(individual.sales_category),
    sales_to: toStringValue(individual.sales_to),
    sales_price_tax_ex: toStringValue(individual.sales_price_tax_ex),
    sales_price_tax: toStringValue(individual.sales_price_tax),
    sales_price_tax_in: toStringValue(individual.sales_price_tax_in),
    sales_date: toDateInputValue(individual.sales_date),
    death_date: toDateInputValue(individual.death_date),
    note: toStringValue(individual.note),
  };
};

export const formValuesToIndividual = (
  values: IndividualFormValues,
  base?: Individual
): Individual => {
  const morphEntries: IndividualMorph[] = [
    {
      morph_id: values.visual_morph_id,
      expression_category: '0',
      bloodline_id: values.bloodline_id || undefined,
      sort_order: 0,
    },
    ...values.het_entries
      .map((entry, index) => ({ ...entry, index }))
      .filter((entry) => entry.morph_id.trim() !== '')
      .map((entry) => ({
        morph_id: entry.morph_id,
        expression_category: '1',
        sort_order: entry.index,
      })),
    ...values.possible_het_entries
      .map((entry, index) => ({ ...entry, index }))
      .filter((entry) => entry.morph_id.trim() !== '')
      .map((entry) => ({
        morph_id: entry.morph_id,
        expression_category: '2',
        possible_het_percentage: Number(entry.possible_het_percentage),
        sort_order: entry.index,
      })),
  ];

  return {
    species_id: values.species_id,
    fiscal_year: Number(values.fiscal_year),
    id: values.id,
    pairing_fiscal_year: toOptionalNumber(values.pairing_fiscal_year),
    pairing_id: values.pairing_id || undefined,
    male_parent_id: values.male_parent_id || undefined,
    female_parent_id: values.female_parent_id || undefined,
    morph_entries: morphEntries,
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
  };
};
