import { IndividualList } from '../components/IndividualList';
import { useIndividuals } from '../hooks/useIndividuals';

export const IndividualListPage = () => {
  const { individuals, loading, error } = useIndividuals();

  if (loading) {
    return <div className="status-message">Loading...</div>;
  }

  if (error) {
    return <div className="status-message error-message">{error}</div>;
  }

  return <IndividualList individuals={individuals} />;
};
