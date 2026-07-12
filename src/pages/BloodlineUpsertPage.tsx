import { useParams } from 'react-router-dom';
import { BloodlineUpsertScreen } from '../features/bloodlines/screens/BloodlineUpsertScreen';

type Props = {
  mode: 'create' | 'edit';
};

export const BloodlineUpsertPage = ({ mode }: Props) => {
  const {
    species_id: speciesId,
    morph_id: morphId,
    bloodline_id: bloodlineId,
  } = useParams<{ species_id: string; morph_id: string; bloodline_id: string }>();

  if (mode === 'edit') {
    if (!speciesId || !morphId || !bloodlineId) {
      return null;
    }
    return <BloodlineUpsertScreen mode="edit" speciesId={speciesId} morphId={morphId} bloodlineId={bloodlineId} />;
  }

  return <BloodlineUpsertScreen mode="create" />;
};
