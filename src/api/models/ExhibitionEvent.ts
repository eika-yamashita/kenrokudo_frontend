export interface ExhibitionEvent {
  event_id?: number;
  event_name: string;
  event_date: string;
  area?: string;
  start_time?: string;
  end_time?: string;
  venue?: string;
  event_url?: string;
  note?: string;
  display_order?: number;
  is_published?: boolean;
}
