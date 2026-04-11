import type { Species } from '../../../api/models/Species';

export const getSpeciesLabel = (speciesId: string, speciesList: Species[]) => {
  const species = speciesList.find((item) => item.species_id === speciesId);
  return species?.common_name || species?.japanese_name || speciesId;
};

export const createSpeciesLabelMap = (speciesList: Species[]) =>
  Object.fromEntries(
    speciesList.map((item) => [item.species_id, item.common_name || item.japanese_name || item.species_id])
  );
