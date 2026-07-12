import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { BloodlineMaster } from '../../../api/models/BloodlineMaster';
import {
  createBloodline,
  deleteBloodline,
  fetchBloodline,
  fetchBloodlines,
  searchBloodlines,
  type BloodlineSearchParams,
  updateBloodline,
} from '../api/bloodlineApi';

export const bloodlinesQueryKey = ['bloodlines'] as const;

export const useBloodlinesQuery = () =>
  useQuery({
    queryKey: bloodlinesQueryKey,
    queryFn: ({ signal }) => fetchBloodlines(signal),
  });

export const useBloodlineSearchQuery = (params: BloodlineSearchParams) =>
  useQuery({
    queryKey: [...bloodlinesQueryKey, 'search', params.speciesId ?? '', params.morphId ?? ''],
    queryFn: ({ signal }) => searchBloodlines(params, signal),
  });

export const useBloodlineQuery = (speciesId?: string, morphId?: string, bloodlineId?: string) =>
  useQuery({
    queryKey: [...bloodlinesQueryKey, speciesId ?? '', morphId ?? '', bloodlineId ?? ''],
    queryFn: ({ signal }) => fetchBloodline(speciesId!, morphId!, bloodlineId!, signal),
    enabled: Boolean(speciesId && morphId && bloodlineId),
  });

export const useCreateBloodlineMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bloodline: Omit<BloodlineMaster, 'bloodline_id'> & { bloodline_id?: string }) =>
      createBloodline(bloodline),
    onSuccess: (created) => {
      void queryClient.invalidateQueries({ queryKey: bloodlinesQueryKey });
      void queryClient.invalidateQueries({
        queryKey: [...bloodlinesQueryKey, created.species_id, created.morph_id, created.bloodline_id],
      });
    },
  });
};

export const useUpdateBloodlineMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      speciesId,
      morphId,
      bloodlineId,
      bloodline,
    }: {
      speciesId: string;
      morphId: string;
      bloodlineId: string;
      bloodline: BloodlineMaster;
    }) => updateBloodline(speciesId, morphId, bloodlineId, bloodline),
    onSuccess: (updated, variables) => {
      void queryClient.invalidateQueries({ queryKey: bloodlinesQueryKey });
      void queryClient.invalidateQueries({
        queryKey: [...bloodlinesQueryKey, variables.speciesId, variables.morphId, variables.bloodlineId],
      });
      void queryClient.invalidateQueries({
        queryKey: [...bloodlinesQueryKey, updated.species_id, updated.morph_id, updated.bloodline_id],
      });
    },
  });
};

export const useDeleteBloodlineMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      speciesId,
      morphId,
      bloodlineId,
    }: {
      speciesId: string;
      morphId: string;
      bloodlineId: string;
    }) => deleteBloodline(speciesId, morphId, bloodlineId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: bloodlinesQueryKey });
    },
  });
};
