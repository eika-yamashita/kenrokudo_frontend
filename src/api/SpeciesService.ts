import { API_BASE } from './apiBase';
import { Species } from './models/Species';

export async function getSpeciesList(): Promise<Species[]> {
  const res = await fetch(`${API_BASE}/species`);
  if (!res.ok) throw new Error('種マスタの取得に失敗しました');
  const data = await res.json();
  if (!Array.isArray(data)) return [];

  return data.map((item: any) => ({
    species_id: item.species_id ?? item.speciesId ?? '',
    japanese_name: item.japanese_name ?? item.japaneseName ?? '',
    common_name: item.common_name ?? item.commonName,
    english_name: item.english_name ?? item.englishName,
    total_length: item.total_length ?? item.totalLength,
    body_weight: item.body_weight ?? item.bodyWeight,
    lifespan: item.lifespan,
  }));
}
