import type { ExhibitionEvent } from '../../../api/models/ExhibitionEvent';
import { apiClient } from '../../../shared/api/apiClient';

const normalizeEvent = (item: any): ExhibitionEvent => ({
  event_id: item.event_id ?? item.eventId,
  event_name: item.event_name ?? item.eventName ?? '',
  event_date: item.event_date ?? item.eventDate ?? '',
  area: item.area ?? undefined,
  start_time: item.start_time ?? item.startTime ?? undefined,
  end_time: item.end_time ?? item.endTime ?? undefined,
  venue: item.venue ?? undefined,
  event_url: item.event_url ?? item.eventUrl ?? undefined,
  note: item.note ?? undefined,
  display_order: item.display_order ?? item.displayOrder ?? 0,
  is_published: item.is_published ?? item.isPublished ?? true,
});

export const fetchEvents = async (signal?: AbortSignal): Promise<ExhibitionEvent[]> => {
  const data = await apiClient.get<any[]>('/events', 'イベント情報の取得に失敗しました', signal);
  return Array.isArray(data) ? data.map(normalizeEvent) : [];
};

export const fetchUpcomingEvents = async (limit = 3, signal?: AbortSignal): Promise<ExhibitionEvent[]> => {
  const data = await apiClient.get<any[]>(
    `/public/events/upcoming?limit=${limit}`,
    '出店イベント情報の取得に失敗しました',
    signal
  );
  return Array.isArray(data) ? data.map(normalizeEvent) : [];
};

export const fetchEvent = async (eventId: number, signal?: AbortSignal): Promise<ExhibitionEvent> => {
  const data = await apiClient.get<any>(`/events/${eventId}`, 'イベント情報詳細の取得に失敗しました', signal);
  return normalizeEvent(data);
};

export const createEvent = (event: ExhibitionEvent) =>
  apiClient.post<ExhibitionEvent>('/events', { ...event }, 'イベント情報の登録に失敗しました');

export const updateEvent = (eventId: number, event: ExhibitionEvent) =>
  apiClient.put<ExhibitionEvent>(`/events/${eventId}`, { ...event }, 'イベント情報の更新に失敗しました');

export const deleteEvent = (eventId: number) =>
  apiClient.delete<void>(`/events/${eventId}`, 'イベント情報の削除に失敗しました');
