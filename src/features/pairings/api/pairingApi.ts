import type { Pairing } from '../../../api/models/Pairing';
import { apiClient } from '../../../shared/api/apiClient';

const toNullableString = (value: string | undefined | null) =>
  value === undefined || value === null || value === '' ? null : value;

const normalizePairingForApi = (pairing: Pairing) => ({
  ...pairing,
  pairing_id: toNullableString(pairing.pairing_id),
  note: toNullableString(pairing.note),
});

export const fetchPairingList = (signal?: AbortSignal) =>
  apiClient.get<Pairing[]>('/pairings', 'ペアリング一覧の取得に失敗しました', signal);

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
