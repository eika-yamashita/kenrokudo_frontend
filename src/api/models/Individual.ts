export interface Individual {
  species_cd: string;
  id: string;
  male_parent_id?: string;
  female_parent_id?: string;
  morph?: string;
  bloodline?: string;
  gender_category?: string;
  breeding_category?: string;
  breeder?: string;
  clutch_date?: string;
  hatch_date?: string;
  purchase_from?: string;
  purchase_price?: number;
  purchase_date?: string;
  sales_category?: string;
  sales_to?: string;
  sales_price_tax_ex?: number;
  sales_price_tax?: number;
  sales_price_tax_in?: number;
  sales_date?: string;
  death_date?: string;
  note?: string;
  create_user: string;
  create_at: string;
  update_user?: string;
  update_at?: string;
}