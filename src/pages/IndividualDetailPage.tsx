import { useParams } from 'react-router-dom';
import { IndividualDetailScreen } from '../features/individuals/screens/IndividualDetailScreen';
import { StatusBanner } from '../shared/ui/admin';

export const IndividualDetailPage = () => {
  const { species_id: speciesId, id } = useParams<{ species_id: string; id: string }>();

  if (!speciesId || !id) {
    return <StatusBanner tone="error">URLパラメータが不正です</StatusBanner>;
  }

  return <IndividualDetailScreen speciesId={speciesId} id={id} />;
};
