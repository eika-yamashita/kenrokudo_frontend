import type { Species } from '../../../api/models/Species';
import { apiClient } from '../../../shared/api/apiClient';

const normalizeSpecies = (item: any): Species => ({
  species_id: item.species_id ?? item.speciesId ?? '',
  japanese_name: item.japanese_name ?? item.japaneseName ?? '',
  common_name: item.common_name ?? item.commonName,
  english_name: item.english_name ?? item.englishName,
  total_length: item.total_length ?? item.totalLength,
  body_weight: item.body_weight ?? item.bodyWeight,
  lifespan: item.lifespan,
});

export async function fetchSpeciesList(signal?: AbortSignal): Promise<Species[]> {
  const data = await apiClient.get<any[]>('/species', '種マスタの取得に失敗しました', signal);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.map(normalizeSpecies);
}

export async function fetchSpecies(speciesId: string, signal?: AbortSignal): Promise<Species> {
  const data = await apiClient.get<any>(`/species/${speciesId}`, '種マスタ詳細の取得に失敗しました', signal);
  return normalizeSpecies(data);
}

export const createSpecies = (species: Species) =>
  apiClient.post<Species>('/species', { ...species }, '種マスタの登録に失敗しました');

export const updateSpecies = (speciesId: string, species: Species) =>
  apiClient.put<Species>(`/species/${speciesId}`, { ...species }, '種マスタの更新に失敗しました');

export const deleteSpecies = (speciesId: string) =>
  apiClient.delete<void>(`/species/${speciesId}`, '種マスタの削除に失敗しました');
