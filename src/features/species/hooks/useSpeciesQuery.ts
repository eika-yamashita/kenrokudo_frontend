import { useQuery } from '@tanstack/react-query';
import { fetchSpeciesList } from '../api/speciesApi';

export const speciesQueryKey = ['species'] as const;

export const useSpeciesQuery = () =>
  useQuery({
    queryKey: speciesQueryKey,
    queryFn: ({ signal }) => fetchSpeciesList(signal),
  });
