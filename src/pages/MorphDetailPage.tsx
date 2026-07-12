import { useParams } from 'react-router-dom';
import { MorphDetailScreen } from '../features/morphs/screens/MorphDetailScreen';

export const MorphDetailPage = () => {
  const { species_id: speciesId, morph_id: morphId } = useParams<{ species_id: string; morph_id: string }>();

  if (!speciesId || !morphId) {
    return null;
  }

  return <MorphDetailScreen speciesId={speciesId} morphId={morphId} />;
};
