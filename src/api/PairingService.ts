import { API_BASE } from './apiBase';
import type { Pairing } from './models/Pairing';

const toNullableString = (value: string | undefined | null) =>
  value === undefined || value === null || value === '' ? null : value;

const normalizePairingForApi = (pairing: Pairing) => ({
  ...pairing,
  pairing_id: toNullableString(pairing.pairing_id),
  note: toNullableString(pairing.note),
});

const buildErrorMessage = async (res: Response, fallback: string) => {
  try {
    const text = await res.text();
    if (!text.trim()) return fallback;

    const contentType = res.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      const json = JSON.parse(text);
      if (typeof json?.message === 'string' && json.message.trim() !== '') {
        return json.message;
      }
    }
    return text.trim() || fallback;
  } catch {
    return fallback;
  }
};

export async function getPairingList(): Promise<Pairing[]> {
  const res = await fetch(`${API_BASE}/pairings`);
  if (!res.ok) throw new Error('ペアリング一覧の取得に失敗しました');
  return await res.json();
}

export async function getPairing(speciesId: string, fiscalYear: number, pairingId: string): Promise<Pairing> {
  const res = await fetch(`${API_BASE}/pairings/${speciesId}/${fiscalYear}/${pairingId}`);
  if (!res.ok) throw new Error('ペアリング情報の取得に失敗しました');
  return await res.json();
}

export async function createPairing(pairing: Pairing): Promise<Pairing> {
  const payload = normalizePairingForApi(pairing);
  const res = await fetch(`${API_BASE}/pairings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await buildErrorMessage(res, 'ペアリング情報の登録に失敗しました'));
  }

  return await res.json();
}

export async function updatePairing(
  speciesId: string,
  fiscalYear: number,
  pairingId: string,
  pairing: Pairing
): Promise<Pairing> {
  const payload = normalizePairingForApi(pairing);
  const res = await fetch(`${API_BASE}/pairings/${speciesId}/${fiscalYear}/${pairingId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await buildErrorMessage(res, 'ペアリング情報の更新に失敗しました'));
  }

  return await res.json();
}

export async function deletePairing(speciesId: string, fiscalYear: number, pairingId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/pairings/${speciesId}/${fiscalYear}/${pairingId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error(await buildErrorMessage(res, 'ペアリング情報の削除に失敗しました'));
  }
}
