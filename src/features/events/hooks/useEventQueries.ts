import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ExhibitionEvent } from '../../../api/models/ExhibitionEvent';
import { createEvent, deleteEvent, fetchEvent, fetchEvents, fetchUpcomingEvents, updateEvent } from '../api/eventApi';

export const eventsQueryKey = ['events'] as const;

export const useEventsQuery = () =>
  useQuery({
    queryKey: eventsQueryKey,
    queryFn: ({ signal }) => fetchEvents(signal),
  });

export const useUpcomingEventsQuery = (limit = 3) =>
  useQuery({
    queryKey: [...eventsQueryKey, 'upcoming', limit],
    queryFn: ({ signal }) => fetchUpcomingEvents(limit, signal),
  });

export const useEventQuery = (eventId?: number) =>
  useQuery({
    queryKey: [...eventsQueryKey, eventId ?? ''],
    queryFn: ({ signal }) => fetchEvent(eventId!, signal),
    enabled: eventId !== undefined,
  });

export const useCreateEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (event: ExhibitionEvent) => createEvent(event),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: eventsQueryKey });
    },
  });
};

export const useUpdateEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, event }: { eventId: number; event: ExhibitionEvent }) => updateEvent(eventId, event),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: eventsQueryKey });
      void queryClient.invalidateQueries({ queryKey: [...eventsQueryKey, variables.eventId] });
    },
  });
};

export const useDeleteEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: number) => deleteEvent(eventId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: eventsQueryKey });
    },
  });
};
