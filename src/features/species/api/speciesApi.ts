import type { Species } from '../../../api/models/Species';
import { apiClient } from '../../../shared/api/apiClient';

export async function fetchSpeciesList(signal?: AbortSignal): Promise<Species[]> {
  const data = await apiClient.get<any[]>('/species', '種マスタの取得に失敗しました', signal);

  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((item) => ({
    species_id: item.species_id ?? item.speciesId ?? '',
    japanese_name: item.japanese_name ?? item.japaneseName ?? '',
    common_name: item.common_name ?? item.commonName,
    english_name: item.english_name ?? item.englishName,
    total_length: item.total_length ?? item.totalLength,
    body_weight: item.body_weight ?? item.bodyWeight,
    lifespan: item.lifespan,
  }));
}
