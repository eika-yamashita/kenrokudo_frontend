import { useCallback, useState } from 'react';
import { createIndividual } from '../api/IndividualService';
import type { Individual } from '../api/models/Individual';

const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const initialIndividual: Individual = {
  species_id: '',
  id: '',
  gender_category: '0',
  breeding_category: '0',
  breeder: '絢禄堂',
  hatch_date: getTodayDateString(),
  create_user: 'system',
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
      return await createIndividual(individual);
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setSaving(false);
    }
  };

  return { individual, updateField, save, saving, error, reset };
};
