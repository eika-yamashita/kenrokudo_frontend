import { Individual } from './models/Individual';

const API_BASE = 'http://localhost:8080';

export async function getIndividualList(): Promise<Individual[]> {
  const res = await fetch(`${API_BASE}/individuals`);
  if (!res.ok) throw new Error('バックエンドとの疎通に失敗しました');
  return await res.json();
}

export async function getIndividual(
  speciesCd: string,
  id: string
): Promise<Individual> {
  const res = await fetch(`${API_BASE}/individuals/${speciesCd}/${id}`);
  if (!res.ok) throw new Error('バックエンドとの疎通に失敗しました');
  return await res.json();
}

export async function updateIndividual(
  speciesCd: string,
  id: string,
  individual: Individual
): Promise<void> {
  const res = await fetch(`${API_BASE}/individuals/${speciesCd}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(individual),
  });
  if (!res.ok) throw new Error('バックエンドとの疎通に失敗しました');
}

export async function createIndividual(individual: Individual): Promise<Individual> {
  const res = await fetch(`${API_BASE}/individuals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(individual),
  });

  if (!res.ok) throw new Error('バックエンドとの疎通に失敗しました');

  return await res.json();
}

export async function deleteIndividual(
  speciesCd: string,
  id: string
): Promise<void> {
  const res = await fetch(`${API_BASE}/individuals/${speciesCd}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('バックエンドとの疎通に失敗しました');
}