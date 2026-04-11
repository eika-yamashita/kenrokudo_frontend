import type { Pairing } from '../../../api/models/Pairing';
import { apiClient } from '../../../shared/api/apiClient';

export type PairingSearchParams = {
  speciesId?: string;
  fiscalYear?: number;
};

const toNullableString = (value: string | undefined | null) =>
  value === undefined || value === null || value === '' ? null : value;

const normalizePairingForApi = (pairing: Pairing) => ({
  ...pairing,
  pairing_id: toNullableString(pairing.pairing_id),
  note: toNullableString(pairing.note),
});

const toSearchQueryString = ({ speciesId, fiscalYear }: PairingSearchParams) => {
  const params = new URLSearchParams();
  if (speciesId) params.set('species_id', speciesId);
  if (fiscalYear !== undefined) params.set('fiscal_year', String(fiscalYear));
  const query = params.toString();
  return query ? `?${query}` : '';
};

export const fetchPairingList = (signal?: AbortSignal) =>
  apiClient.get<Pairing[]>('/pairings', 'ペアリング一覧の取得に失敗しました', signal);

export const searchPairings = (params: PairingSearchParams, signal?: AbortSignal) =>
  apiClient.get<Pairing[]>(
    `/pairings/search${toSearchQueryString(params)}`,
    'Failed to search pairings',
    signal
  );

export const fetchPairing = (speciesId: string, fiscalYear: number, pairingId: string, signal?: AbortSignal) =>
  apiClient.get<Pairing>(
    `/pairings/${speciesId}/${fiscalYear}/${pairingId}`,
    'ペアリング情報の取得に失敗しました',
    signal
  );

export const createPairing = (pairing: Pairing) =>
  apiClient.post<Pairing>('/pairings', normalizePairingForApi(pairing), 'ペアリングの登録に失敗しました');

export const updatePairing = (speciesId: string, fiscalYear: number, pairingId: string, pairing: Pairing) =>
  apiClient.put<Pairing>(
    `/pairings/${speciesId}/${fiscalYear}/${pairingId}`,
    normalizePairingForApi(pairing),
    'ペアリング情報の更新に失敗しました'
  );

export const deletePairing = (speciesId: string, fiscalYear: number, pairingId: string) =>
  apiClient.delete<void>(
    `/pairings/${speciesId}/${fiscalYear}/${pairingId}`,
    'ペアリング情報の削除に失敗しました'
  );
