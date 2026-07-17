export interface MorphMaster {
  species_id: string;
  morph_id: string;
  morph_name: string;
  morph_type: 'SINGLE' | 'COMBO';
  inheritance_category?: string;
  display_priority?: number;
  components?: MorphComponent[];
}

export interface MorphComponent {
  species_id?: string;
  combo_morph_id?: string;
  component_morph_id: string;
  component_morph_name?: string;
  required_expression: string;
  sort_order: number;
}
