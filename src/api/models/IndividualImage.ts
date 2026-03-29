export interface IndividualImage {
  image_id: number;
  species_cd: string;
  individual_id: string;
  storage_path: string;
  public_url: string;
  file_name?: string;
  content_type: string;
  file_size: number;
  sort_order: number;
  is_primary: boolean;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
}
