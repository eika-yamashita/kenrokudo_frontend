import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Pairing } from '../../../api/models/Pairing';
import {
  createPairing,
  deletePairing,
  fetchPairing,
  fetchPairingList,
  searchPairings,
  type PairingSearchParams,
  updatePairing,
} from '../api/pairingApi';

export const pairingsQueryKey = ['pairings'] as const;

export const usePairingsQuery = () =>
  useQuery({
    queryKey: pairingsQueryKey,
    queryFn: ({ signal }) => fetchPairingList(signal),
  });

export const usePairingSearchQuery = (params: PairingSearchParams) =>
  useQuery({
    queryKey: [...pairingsQueryKey, 'search', params.speciesId ?? '', params.fiscalYear ?? ''],
    queryFn: ({ signal }) => searchPairings(params, signal),
  });

export const usePairingQuery = (speciesId?: string, fiscalYear?: number, pairingId?: string) =>
  useQuery({
    queryKey: ['pairings', speciesId, fiscalYear, pairingId],
    queryFn: ({ signal }) => fetchPairing(speciesId!, fiscalYear!, pairingId!, signal),
    enabled: Boolean(speciesId && pairingId && fiscalYear !== undefined && !Number.isNaN(fiscalYear)),
  });

export const useCreatePairingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pairing: Pairing) => createPairing(pairing),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: pairingsQueryKey });
    },
  });
};

export const useUpdatePairingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      speciesId,
      fiscalYear,
      pairingId,
      pairing,
    }: {
      speciesId: string;
      fiscalYear: number;
      pairingId: string;
      pairing: Pairing;
    }) => updatePairing(speciesId, fiscalYear, pairingId, pairing),
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: pairingsQueryKey });
      void queryClient.invalidateQueries({
        queryKey: ['pairings', updated.species_id, updated.fiscal_year, updated.pairing_id],
      });
    },
  });
};

export const useDeletePairingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ speciesId, fiscalYear, pairingId }: { speciesId: string; fiscalYear: number; pairingId: string }) =>
      deletePairing(speciesId, fiscalYear, pairingId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: pairingsQueryKey });
    },
  });
};
