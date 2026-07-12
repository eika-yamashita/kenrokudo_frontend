import { useParams } from 'react-router-dom';
import { SpeciesDetailScreen } from '../features/species/screens/SpeciesDetailScreen';

export const SpeciesDetailPage = () => {
  const { species_id: speciesId } = useParams<{ species_id: string }>();

  if (!speciesId) {
    return null;
  }

  return <SpeciesDetailScreen speciesId={speciesId} />;
};
