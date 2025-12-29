// src/pages/IndividualListPage.tsx
import { IndividualList } from '../components/IndividualList';
import { useIndividuals } from '../hooks/useIndividuals';

export const IndividualListPage = () => {
  const { individuals, loading, error } = useIndividuals();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return <IndividualList individuals={individuals} />;
};
