import { useParams } from 'react-router-dom';
import { BloodlineDetailScreen } from '../features/bloodlines/screens/BloodlineDetailScreen';

export const BloodlineDetailPage = () => {
  const {
    species_id: speciesId,
    morph_id: morphId,
    bloodline_id: bloodlineId,
  } = useParams<{ species_id: string; morph_id: string; bloodline_id: string }>();

  if (!speciesId || !morphId || !bloodlineId) {
    return null;
  }

  return <BloodlineDetailScreen speciesId={speciesId} morphId={morphId} bloodlineId={bloodlineId} />;
};
