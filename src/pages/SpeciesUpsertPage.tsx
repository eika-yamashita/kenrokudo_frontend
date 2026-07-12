import { useParams } from 'react-router-dom';
import { SpeciesUpsertScreen } from '../features/species/screens/SpeciesUpsertScreen';

type Props = {
  mode: 'create' | 'edit';
};

export const SpeciesUpsertPage = ({ mode }: Props) => {
  const { species_id: speciesId } = useParams<{ species_id: string }>();

  if (mode === 'edit') {
    if (!speciesId) {
      return null;
    }
    return <SpeciesUpsertScreen mode="edit" speciesId={speciesId} />;
  }

  return <SpeciesUpsertScreen mode="create" />;
};
