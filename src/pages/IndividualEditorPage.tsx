import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getIndividual } from '../api/IndividualService';
import { IndividualEditor } from '../components/IndividualEditor';
import type { Individual } from '../api/models/Individual';

export const IndividualEditorPage: React.FC = () => {
  const { speciesCd, id } = useParams();
  const navigate = useNavigate();
  const [individual, setIndividual] = useState<Individual | null>(null);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  if (speciesCd && id) {
    getIndividual(speciesCd, id)
      .then(setIndividual)
      .catch(e => setError(e.message));
  }
}, [speciesCd, id]);

  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!individual) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={() => navigate(-1)}>一覧へ戻る</button>
      <IndividualEditor
        individual={individual}
        onUpdated={() => navigate('/')}
        onDeleted={() => navigate('/')}
      />
    </div>
  );
};