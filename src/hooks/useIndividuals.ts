// src/hooks/useIndividuals.ts
import { useEffect, useState } from 'react';
import { getIndividualList } from '../api/IndividualService';
import type { Individual } from '../api/models/Individual';

export const useIndividuals = () => {
  const [individuals, setIndividuals] = useState<Individual[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getIndividualList()
      .then((data) => {
        setIndividuals(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message ?? '取得に失敗しました');
        setLoading(false);
      });
  }, []);

  return {
    individuals,
    loading,
    error,
  };
};
