import { useParams } from 'react-router-dom';
import { MorphUpsertScreen } from '../features/morphs/screens/MorphUpsertScreen';

type Props = {
  mode: 'create' | 'edit';
};

export const MorphUpsertPage = ({ mode }: Props) => {
  const { species_id: speciesId, morph_id: morphId } = useParams<{ species_id: string; morph_id: string }>();

  if (mode === 'edit') {
    if (!speciesId || !morphId) {
      return null;
    }
    return <MorphUpsertScreen mode="edit" speciesId={speciesId} morphId={morphId} />;
  }

  return <MorphUpsertScreen mode="create" />;
};
