import { useParams } from 'react-router-dom';
import { IndividualEditScreen } from '../features/individuals/screens/IndividualEditScreen';
import { StatusBanner } from '../shared/ui/admin';

export const IndividualEditorPage = () => {
  const { species_id: speciesId, id } = useParams<{ species_id: string; id: string }>();

  if (!speciesId || !id) {
    return <StatusBanner tone="error">URLパラメータが不正です</StatusBanner>;
  }

  return <IndividualEditScreen speciesId={speciesId} id={id} />;
};
