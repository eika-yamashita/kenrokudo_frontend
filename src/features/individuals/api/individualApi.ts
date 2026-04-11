import type { Individual } from '../../../api/models/Individual';
import type { IndividualImage } from '../../../api/models/IndividualImage';
import { apiClient, ApiError } from '../../../shared/api/apiClient';

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

export const fetchIndividuals = (signal?: AbortSignal) =>
  apiClient.get<Individual[]>('/individuals', '個体一覧の取得に失敗しました', signal);

export const fetchIndividual = (speciesId: string, id: string, signal?: AbortSignal) =>
  apiClient.get<Individual>(`/individuals/${speciesId}/${id}`, '個体情報の取得に失敗しました', signal);

export const createIndividual = async (individual: Individual) => {
  try {
    return await apiClient.post<Individual>(
      '/individuals',
      normalizeIndividualForApi(individual),
      '個体情報の登録に失敗しました'
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      throw new Error('同じ種コード・個体IDのデータがすでに存在します');
    }

    throw error;
  }
};

export const updateIndividual = (speciesId: string, id: string, individual: Individual) =>
  apiClient.put<void>(
    `/individuals/${speciesId}/${id}`,
    normalizeIndividualForApi(individual),
    '個体情報の更新に失敗しました'
  );

export const deleteIndividual = (speciesId: string, id: string) =>
  apiClient.delete<void>(`/individuals/${speciesId}/${id}`, '個体情報の削除に失敗しました');

export const fetchIndividualImages = (speciesId: string, id: string, signal?: AbortSignal) =>
  apiClient.get<IndividualImage[]>(`/individuals/${speciesId}/${id}/images`, '画像の取得に失敗しました', signal);

export const uploadIndividualImage = (speciesId: string, id: string, file: File, isPrimary?: boolean) => {
  const formData = new FormData();
  formData.append('file', file);
  if (isPrimary !== undefined) {
    formData.append('isPrimary', String(isPrimary));
  }

  return apiClient.post<IndividualImage>(
    `/individuals/${speciesId}/${id}/images`,
    formData,
    '画像のアップロードに失敗しました'
  );
};

export const replaceIndividualImage = (
  speciesId: string,
  id: string,
  imageId: number,
  file: File,
  isPrimary?: boolean
) => {
  const formData = new FormData();
  formData.append('file', file);
  if (isPrimary !== undefined) {
    formData.append('isPrimary', String(isPrimary));
  }

  return apiClient.put<IndividualImage>(
    `/individuals/${speciesId}/${id}/images/${imageId}`,
    formData,
    '画像の差し替えに失敗しました'
  );
};

export const deleteIndividualImage = (speciesId: string, id: string, imageId: number) =>
  apiClient.delete<void>(`/individuals/${speciesId}/${id}/images/${imageId}`, '画像の削除に失敗しました');

export const setPrimaryIndividualImage = (speciesId: string, id: string, imageId: number) =>
  apiClient.put<void>(
    `/individuals/${speciesId}/${id}/images/${imageId}/primary`,
    undefined,
    'メイン画像の設定に失敗しました'
  );
