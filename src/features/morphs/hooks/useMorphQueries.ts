import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { MorphMaster } from '../../../api/models/MorphMaster';
import {
  createMorph,
  deleteMorph,
  fetchMorph,
  fetchMorphs,
  searchMorphs,
  type MorphSearchParams,
  updateMorph,
} from '../api/morphApi';

export const morphsQueryKey = ['morphs'] as const;

export const useMorphsQuery = () =>
  useQuery({
    queryKey: morphsQueryKey,
    queryFn: ({ signal }) => fetchMorphs(signal),
  });

export const useMorphSearchQuery = (params: MorphSearchParams) =>
  useQuery({
    queryKey: [...morphsQueryKey, 'search', params.speciesId ?? ''],
    queryFn: ({ signal }) => searchMorphs(params, signal),
  });

export const useMorphQuery = (speciesId?: string, morphId?: string) =>
  useQuery({
    queryKey: [...morphsQueryKey, speciesId ?? '', morphId ?? ''],
    queryFn: ({ signal }) => fetchMorph(speciesId!, morphId!, signal),
    enabled: Boolean(speciesId && morphId),
  });

export const useCreateMorphMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (morph: Omit<MorphMaster, 'morph_id'> & { morph_id?: string }) => createMorph(morph),
    onSuccess: (created) => {
      void queryClient.invalidateQueries({ queryKey: morphsQueryKey });
      void queryClient.invalidateQueries({ queryKey: [...morphsQueryKey, created.species_id, created.morph_id] });
    },
  });
};

export const useUpdateMorphMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ speciesId, morphId, morph }: { speciesId: string; morphId: string; morph: MorphMaster }) =>
      updateMorph(speciesId, morphId, morph),
    onSuccess: (updated, variables) => {
      void queryClient.invalidateQueries({ queryKey: morphsQueryKey });
      void queryClient.invalidateQueries({ queryKey: [...morphsQueryKey, variables.speciesId, variables.morphId] });
      void queryClient.invalidateQueries({ queryKey: [...morphsQueryKey, updated.species_id, updated.morph_id] });
    },
  });
};

export const useDeleteMorphMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ speciesId, morphId }: { speciesId: string; morphId: string }) => deleteMorph(speciesId, morphId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: morphsQueryKey });
    },
  });
};
