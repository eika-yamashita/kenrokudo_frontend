import { API_BASE } from './apiBase';
import { IndividualImage } from './models/IndividualImage';

export async function getIndividualImages(
  speciesCd: string,
  id: string
): Promise<IndividualImage[]> {
  const res = await fetch(`${API_BASE}/individuals/${speciesCd}/${id}/images`);
  if (!res.ok) throw new Error('画像一覧の取得に失敗しました');
  return await res.json();
}

export async function uploadIndividualImage(
  speciesCd: string,
  id: string,
  file: File,
  isPrimary?: boolean
): Promise<IndividualImage> {
  const formData = new FormData();
  formData.append('file', file);
  if (isPrimary !== undefined) {
    formData.append('isPrimary', String(isPrimary));
  }

  const res = await fetch(`${API_BASE}/individuals/${speciesCd}/${id}/images`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('画像のアップロードに失敗しました');
  return await res.json();
}

export async function replaceIndividualImage(
  speciesCd: string,
  id: string,
  imageId: number,
  file: File,
  isPrimary?: boolean
): Promise<IndividualImage> {
  const formData = new FormData();
  formData.append('file', file);
  if (isPrimary !== undefined) {
    formData.append('isPrimary', String(isPrimary));
  }

  const res = await fetch(`${API_BASE}/individuals/${speciesCd}/${id}/images/${imageId}`, {
    method: 'PUT',
    body: formData,
  });
  if (!res.ok) throw new Error('画像の差し替えに失敗しました');
  return await res.json();
}

export async function deleteIndividualImage(
  speciesCd: string,
  id: string,
  imageId: number
): Promise<void> {
  const res = await fetch(`${API_BASE}/individuals/${speciesCd}/${id}/images/${imageId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('画像の削除に失敗しました');
}

export async function setPrimaryIndividualImage(
  speciesCd: string,
  id: string,
  imageId: number
): Promise<void> {
  const res = await fetch(`${API_BASE}/individuals/${speciesCd}/${id}/images/${imageId}/primary`, {
    method: 'PUT',
  });
  if (!res.ok) throw new Error('メイン画像の設定に失敗しました');
}
