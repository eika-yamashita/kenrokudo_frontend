import type { BloodlineMaster } from '../../../api/models/BloodlineMaster';
import { apiClient } from '../../../shared/api/apiClient';

export type BloodlineSearchParams = {
  speciesId?: string;
  morphId?: string;
};

const normalizeBloodline = (item: any): BloodlineMaster => ({
  species_id: item.species_id ?? item.speciesId ?? '',
  morph_id: item.morph_id ?? item.morphId ?? '',
  bloodline_id: item.bloodline_id ?? item.bloodlineId ?? '',
  bloodline_name: item.bloodline_name ?? item.bloodlineName ?? '',
});

const toSearchQueryString = ({ speciesId, morphId }: BloodlineSearchParams) => {
  const params = new URLSearchParams();
  if (speciesId) params.set('species_id', speciesId);
  if (morphId) params.set('morph_id', morphId);
  const query = params.toString();
  return query ? `?${query}` : '';
};

export const fetchBloodlines = async (signal?: AbortSignal): Promise<BloodlineMaster[]> => {
  const data = await apiClient.get<any[]>('/bloodlines', '血統マスタの取得に失敗しました', signal);
  return Array.isArray(data) ? data.map(normalizeBloodline) : [];
};

export const searchBloodlines = async (
  params: BloodlineSearchParams,
  signal?: AbortSignal
): Promise<BloodlineMaster[]> => {
  const data = await apiClient.get<any[]>(
    `/bloodlines/search${toSearchQueryString(params)}`,
    '血統マスタの検索に失敗しました',
    signal
  );
  return Array.isArray(data) ? data.map(normalizeBloodline) : [];
};

export const fetchBloodline = async (
  speciesId: string,
  morphId: string,
  bloodlineId: string,
  signal?: AbortSignal
): Promise<BloodlineMaster> => {
  const data = await apiClient.get<any>(
    `/bloodlines/${speciesId}/${morphId}/${bloodlineId}`,
    '血統マスタ詳細の取得に失敗しました',
    signal
  );
  return normalizeBloodline(data);
};

export const createBloodline = (
  bloodline: Omit<BloodlineMaster, 'bloodline_id'> & { bloodline_id?: string }
) => apiClient.post<BloodlineMaster>('/bloodlines', { ...bloodline }, '血統マスタの登録に失敗しました');

export const updateBloodline = (
  speciesId: string,
  morphId: string,
  bloodlineId: string,
  bloodline: BloodlineMaster
) => apiClient.put<BloodlineMaster>(
  `/bloodlines/${speciesId}/${morphId}/${bloodlineId}`,
  { ...bloodline },
  '血統マスタの更新に失敗しました'
);

export const deleteBloodline = (speciesId: string, morphId: string, bloodlineId: string) =>
  apiClient.delete<void>(
    `/bloodlines/${speciesId}/${morphId}/${bloodlineId}`,
    '血統マスタの削除に失敗しました'
  );
