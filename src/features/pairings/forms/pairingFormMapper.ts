import type { Pairing } from '../../../api/models/Pairing';
import type { PairingFormValues } from './pairingFormSchema';

const today = () => new Date().toISOString().slice(0, 10);

export const createEmptyPairingFormValues = (): PairingFormValues => ({
  species_id: '',
  pairing_id: '',
  fiscal_year: '',
  male_parent_id: '',
  female_parent_id: '',
  pairing_date: today(),
  note: '',
});

export const pairingToFormValues = (pairing: Pairing): PairingFormValues => ({
  species_id: pairing.species_id,
  pairing_id: pairing.pairing_id ?? '',
  fiscal_year: pairing.fiscal_year === undefined ? '' : String(pairing.fiscal_year),
  male_parent_id: pairing.male_parent_id,
  female_parent_id: pairing.female_parent_id,
  pairing_date: pairing.pairing_date,
  note: pairing.note ?? '',
});

export const formValuesToPairing = (values: PairingFormValues): Pairing => ({
  species_id: values.species_id,
  fiscal_year: values.fiscal_year ? Number(values.fiscal_year) : undefined,
  pairing_id: values.pairing_id || undefined,
  male_parent_id: values.male_parent_id,
  female_parent_id: values.female_parent_id,
  pairing_date: values.pairing_date,
  note: values.note || undefined,
});
