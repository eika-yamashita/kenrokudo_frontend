import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Individual } from '../../../api/models/Individual';
import {
  createIndividual,
  deleteIndividual,
  deleteIndividualImage,
  fetchIndividual,
  fetchIndividualImages,
  fetchIndividuals,
  replaceIndividualImage,
  setPrimaryIndividualImage,
  updateIndividual,
  uploadIndividualImage,
} from '../api/individualApi';

export const individualsQueryKey = ['individuals'] as const;

export const useIndividualsQuery = () =>
  useQuery({
    queryKey: individualsQueryKey,
    queryFn: ({ signal }) => fetchIndividuals(signal),
  });

export const useIndividualQuery = (speciesId?: string, id?: string) =>
  useQuery({
    queryKey: ['individuals', speciesId, id],
    queryFn: ({ signal }) => fetchIndividual(speciesId!, id!, signal),
    enabled: Boolean(speciesId && id),
  });

export const useIndividualImagesQuery = (speciesId?: string, id?: string) =>
  useQuery({
    queryKey: ['individual-images', speciesId, id],
    queryFn: ({ signal }) => fetchIndividualImages(speciesId!, id!, signal),
    enabled: Boolean(speciesId && id),
  });

export const useCreateIndividualMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (individual: Individual) => createIndividual(individual),
    onSuccess: (created) => {
      void queryClient.invalidateQueries({ queryKey: individualsQueryKey });
      void queryClient.invalidateQueries({ queryKey: ['individuals', created.species_id, created.id] });
    },
  });
};

export const useUpdateIndividualMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ speciesId, id, individual }: { speciesId: string; id: string; individual: Individual }) =>
      updateIndividual(speciesId, id, individual),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: individualsQueryKey });
      void queryClient.invalidateQueries({ queryKey: ['individuals', variables.speciesId, variables.id] });
    },
  });
};

export const useDeleteIndividualMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ speciesId, id }: { speciesId: string; id: string }) => deleteIndividual(speciesId, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: individualsQueryKey });
    },
  });
};

export const useUploadIndividualImageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      speciesId,
      id,
      file,
      isPrimary,
    }: {
      speciesId: string;
      id: string;
      file: File;
      isPrimary?: boolean;
    }) => uploadIndividualImage(speciesId, id, file, isPrimary),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['individual-images', variables.speciesId, variables.id] });
    },
  });
};

export const useReplaceIndividualImageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      speciesId,
      id,
      imageId,
      file,
      isPrimary,
    }: {
      speciesId: string;
      id: string;
      imageId: number;
      file: File;
      isPrimary?: boolean;
    }) => replaceIndividualImage(speciesId, id, imageId, file, isPrimary),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['individual-images', variables.speciesId, variables.id] });
    },
  });
};

export const useDeleteIndividualImageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ speciesId, id, imageId }: { speciesId: string; id: string; imageId: number }) =>
      deleteIndividualImage(speciesId, id, imageId),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['individual-images', variables.speciesId, variables.id] });
    },
  });
};

export const useSetPrimaryIndividualImageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ speciesId, id, imageId }: { speciesId: string; id: string; imageId: number }) =>
      setPrimaryIndividualImage(speciesId, id, imageId),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['individual-images', variables.speciesId, variables.id] });
    },
  });
};
