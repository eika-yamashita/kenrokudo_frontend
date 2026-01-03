import { useCallback, useState } from 'react';
import { createIndividual } from '../api/IndividualService';
import type { Individual } from '../api/models/Individual';

const initialIndividual: Individual = {
  species_cd: '',
  id: '',
  create_user: '',
  create_at: new Date().toISOString().slice(0, 16),
};

export const useIndividualCreator = () => {
  const [individual, setIndividual] = useState<Individual>(initialIndividual);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = useCallback(
    <K extends keyof Individual>(key: K, value: Individual[K]) => {
      setIndividual((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const reset = () => setIndividual(initialIndividual);

  const save = async () => {
    setSaving(true);
    setError(null);

    try {
      await createIndividual(individual);
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setSaving(false);
    }
  };

  return { individual, updateField, save, saving, error, reset };
};
