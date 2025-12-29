import { useEffect, useState, useCallback } from 'react';
import {
  getIndividual,
  updateIndividual,
} from '../api/IndividualService';
import type { Individual } from '../api/models/Individual';

type UseIndividualEditorArgs = {
  species: string;
  individualId: string;
};

export const useIndividualEditor = ({
  species,
  individualId,
}: UseIndividualEditorArgs) => {
  const [individual, setIndividual] = useState<Individual | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* -------------------------
   * 初期取得
   * ------------------------- */
  useEffect(() => {
    setLoading(true);
    getIndividual(species, individualId)
      .then(setIndividual)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [species, individualId]);

  /* -------------------------
   * フィールド更新
   * ------------------------- */
  const updateField = useCallback(
    <K extends keyof Individual>(key: K, value: Individual[K]) => {
      setIndividual((prev) =>
        prev ? { ...prev, [key]: value } : prev
      );
    },
    []
  );

  /* -------------------------
   * 保存
   * ------------------------- */
  const save = async () => {
    if (!individual) return;

    setSaving(true);
    setError(null);

    try {
      await updateIndividual(
        species,
        individualId,
        individual
      );
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setSaving(false);
    }
  };

  return {
    individual,
    updateField,
    save,
    loading,
    saving,
    error,
  };
};
