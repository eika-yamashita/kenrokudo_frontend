import type { MorphMaster } from '../../../api/models/MorphMaster';
import { apiClient } from '../../../shared/api/apiClient';

export type MorphSearchParams = {
  speciesId?: string;
};

const normalizeMorph = (item: any): MorphMaster => ({
  species_id: item.species_id ?? item.speciesId ?? '',
  morph_id: item.morph_id ?? item.morphId ?? '',
  morph_name: item.morph_name ?? item.morphName ?? '',
  inheritance_category: item.inheritance_category ?? item.inheritanceCategory ?? '0',
});

const toSearchQueryString = ({ speciesId }: MorphSearchParams) => {
  const params = new URLSearchParams();
  if (speciesId) params.set('species_id', speciesId);
  const query = params.toString();
  return query ? `?${query}` : '';
};

export const fetchMorphs = async (signal?: AbortSignal): Promise<MorphMaster[]> => {
  const data = await apiClient.get<any[]>('/morphs', 'モルフマスタの取得に失敗しました', signal);
  return Array.isArray(data) ? data.map(normalizeMorph) : [];
};

export const searchMorphs = async (params: MorphSearchParams, signal?: AbortSignal): Promise<MorphMaster[]> => {
  const data = await apiClient.get<any[]>(`/morphs/search${toSearchQueryString(params)}`, 'モルフマスタの検索に失敗しました', signal);
  return Array.isArray(data) ? data.map(normalizeMorph) : [];
};

export const fetchMorph = async (speciesId: string, morphId: string, signal?: AbortSignal): Promise<MorphMaster> => {
  const data = await apiClient.get<any>(`/morphs/${speciesId}/${morphId}`, 'モルフマスタ詳細の取得に失敗しました', signal);
  return normalizeMorph(data);
};

export const createMorph = (morph: Omit<MorphMaster, 'morph_id'> & { morph_id?: string }) =>
  apiClient.post<MorphMaster>('/morphs', { ...morph }, 'モルフマスタの登録に失敗しました');

export const updateMorph = (speciesId: string, morphId: string, morph: MorphMaster) =>
  apiClient.put<MorphMaster>(`/morphs/${speciesId}/${morphId}`, { ...morph }, 'モルフマスタの更新に失敗しました');

export const deleteMorph = (speciesId: string, morphId: string) =>
  apiClient.delete<void>(`/morphs/${speciesId}/${morphId}`, 'モルフマスタの削除に失敗しました');
