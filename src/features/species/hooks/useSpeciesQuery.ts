import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Species } from '../../../api/models/Species';
import { createSpecies, deleteSpecies, fetchSpecies, fetchSpeciesList, updateSpecies } from '../api/speciesApi';

export const speciesQueryKey = ['species'] as const;

export const useSpeciesQuery = () =>
  useQuery({
    queryKey: speciesQueryKey,
    queryFn: ({ signal }) => fetchSpeciesList(signal),
  });

export const useSpeciesDetailQuery = (speciesId?: string) =>
  useQuery({
    queryKey: [...speciesQueryKey, speciesId ?? ''],
    queryFn: ({ signal }) => fetchSpecies(speciesId!, signal),
    enabled: Boolean(speciesId),
  });

export const useCreateSpeciesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (species: Species) => createSpecies(species),
    onSuccess: (created) => {
      void queryClient.invalidateQueries({ queryKey: speciesQueryKey });
      void queryClient.invalidateQueries({ queryKey: [...speciesQueryKey, created.species_id] });
    },
  });
};

export const useUpdateSpeciesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ speciesId, species }: { speciesId: string; species: Species }) =>
      updateSpecies(speciesId, species),
    onSuccess: (updated, variables) => {
      void queryClient.invalidateQueries({ queryKey: speciesQueryKey });
      void queryClient.invalidateQueries({ queryKey: [...speciesQueryKey, variables.speciesId] });
      void queryClient.invalidateQueries({ queryKey: [...speciesQueryKey, updated.species_id] });
    },
  });
};

export const useDeleteSpeciesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (speciesId: string) => deleteSpecies(speciesId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: speciesQueryKey });
    },
  });
};
