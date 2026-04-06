import { API_BASE } from './apiBase';
import { Individual } from './models/Individual';

const toNullableString = (value: string | undefined | null) =>
  value === undefined || value === null || value === '' ? null : value;

const toNullableNumber = (value: number | undefined | null | string) =>
  value === undefined || value === null || value === '' ? null : Number(value);

const normalizeIndividualForApi = (individual: Individual) => ({
  ...individual,
  pairing_fiscal_year: toNullableNumber(individual.pairing_fiscal_year as number | undefined),
  pairing_id: toNullableString(individual.pairing_id),
  male_parent_id: toNullableString(individual.male_parent_id),
  female_parent_id: toNullableString(individual.female_parent_id),
  morph: toNullableString(individual.morph),
  bloodline: toNullableString(individual.bloodline),
  gender_category: toNullableString(individual.gender_category),
  breeding_category: toNullableString(individual.breeding_category),
  breeder: toNullableString(individual.breeder),
  clutch_date: toNullableString(individual.clutch_date),
  hatch_date: toNullableString(individual.hatch_date),
  purchase_from: toNullableString(individual.purchase_from),
  purchase_price: toNullableNumber(individual.purchase_price as number | undefined),
  purchase_date: toNullableString(individual.purchase_date),
  sales_category: toNullableString(individual.sales_category),
  sales_to: toNullableString(individual.sales_to),
  sales_price_tax_ex: toNullableNumber(individual.sales_price_tax_ex as number | undefined),
  sales_price_tax: toNullableNumber(individual.sales_price_tax as number | undefined),
  sales_price_tax_in: toNullableNumber(individual.sales_price_tax_in as number | undefined),
  sales_date: toNullableString(individual.sales_date),
  death_date: toNullableString(individual.death_date),
  note: toNullableString(individual.note),
  update_user: toNullableString(individual.update_user),
  update_at: toNullableString(individual.update_at),
});

export async function getIndividualList(): Promise<Individual[]> {
  const res = await fetch(`${API_BASE}/individuals`);
  if (!res.ok) throw new Error('個体一覧の取得に失敗しました');
  return await res.json();
}

export async function getIndividual(speciesId: string, id: string): Promise<Individual> {
  const res = await fetch(`${API_BASE}/individuals/${speciesId}/${id}`);
  if (!res.ok) throw new Error('個体情報の取得に失敗しました');
  return await res.json();
}

export async function updateIndividual(speciesId: string, id: string, individual: Individual): Promise<void> {
  const payload = normalizeIndividualForApi(individual);
  const res = await fetch(`${API_BASE}/individuals/${speciesId}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('個体情報の更新に失敗しました');
}

export async function createIndividual(individual: Individual): Promise<Individual> {
  const payload = normalizeIndividualForApi(individual);
  const res = await fetch(`${API_BASE}/individuals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    if (res.status === 409) {
      throw new Error('同じ種コード・個体IDのデータが既に存在します');
    }
    throw new Error('個体情報の登録に失敗しました');
  }

  return await res.json();
}

export async function deleteIndividual(speciesId: string, id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/individuals/${speciesId}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('個体情報の削除に失敗しました');
}
