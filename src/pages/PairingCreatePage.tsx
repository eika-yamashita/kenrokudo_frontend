import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPairing } from '../api/PairingService';
import { getSpeciesList } from '../api/SpeciesService';
import { getIndividualList } from '../api/IndividualService';
import type { Pairing } from '../api/models/Pairing';
import type { Species } from '../api/models/Species';
import type { Individual } from '../api/models/Individual';
import { isFemaleCategory, isMaleCategory } from '../utils/genderFilter';
import { normalizeIdInput } from '../utils/idNormalizer';

const toDateInput = (value: string | undefined) => value ?? '';

const buildIndividualLabel = (individual: Individual) => {
  if (individual.morph) {
    return `${individual.id} (${individual.morph})`;
  }
  return individual.id;
};

export const PairingCreatePage = () => {
  const navigate = useNavigate();
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [individuals, setIndividuals] = useState<Individual[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pairing, setPairing] = useState<Pairing>({
    species_id: '',
    pairing_id: '',
    male_parent_id: '',
    female_parent_id: '',
    pairing_date: new Date().toISOString().slice(0, 10),
    note: '',
  });

  useEffect(() => {
    let cancelled = false;

    const loadInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [species, individualList] = await Promise.all([getSpeciesList(), getIndividualList()]);
        if (cancelled) return;
        setSpeciesList(species);
        setIndividuals(individualList);
        setPairing((prev) => ({
          ...prev,
          species_id: prev.species_id || species[0]?.species_id || '',
        }));
      } catch (e: any) {
        if (!cancelled) setError(e.message ?? '初期データの取得に失敗しました');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadInitialData();

    return () => {
      cancelled = true;
    };
  }, []);

  const maleCandidates = useMemo(
    () =>
      individuals.filter(
        (individual) => individual.species_id === pairing.species_id && isMaleCategory(individual.gender_category)
      ),
    [individuals, pairing.species_id]
  );

  const femaleCandidates = useMemo(
    () =>
      individuals.filter(
        (individual) => individual.species_id === pairing.species_id && isFemaleCategory(individual.gender_category)
      ),
    [individuals, pairing.species_id]
  );

  const updateField = <K extends keyof Pairing>(key: K, value: Pairing[K]) => {
    setPairing((prev) => ({ ...prev, [key]: value }));
  };

  const handleSpeciesChange = (speciesId: string) => {
    setPairing((prev) => ({
      ...prev,
      species_id: speciesId,
      male_parent_id: '',
      female_parent_id: '',
    }));
  };

  const handleSubmit = async () => {
    if (!pairing.species_id) {
      setError('種IDを選択してください');
      return;
    }
    if (!pairing.male_parent_id || !pairing.female_parent_id || !pairing.pairing_date) {
      setError('オス親ID、メス親ID、ペアリング日は必須です');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await createPairing(pairing);
      navigate('/admin/pairings');
    } catch (e: any) {
      setError(e.message ?? 'ペアリング情報の登録に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="status-message">読み込み中...</div>;
  }

  return (
    <div className="admin-page">
      <div className="page-heading">
        <button className="ghost-button" onClick={() => navigate('/admin/pairings')}>
          一覧へ戻る
        </button>
        <h1>ペアリング新規登録</h1>
      </div>

      <div className="admin-form">
        <label>
          種ID
          <select value={pairing.species_id} onChange={(e) => handleSpeciesChange(e.target.value)}>
            {speciesList.map((species) => (
              <option key={species.species_id} value={species.species_id}>
                {species.common_name || species.japanese_name} ({species.species_id})
              </option>
            ))}
          </select>
        </label>

        <label>
          ペアリングID（未入力なら自動採番）
          <input
            value={pairing.pairing_id ?? ''}
            onChange={(e) => updateField('pairing_id', e.target.value)}
            onBlur={(e) => updateField('pairing_id', normalizeIdInput(e.target.value))}
            placeholder="例: A / B / AA"
          />
        </label>

        <label>
          オス親ID
          <input
            list="male-parent-candidates"
            value={pairing.male_parent_id}
            onChange={(e) => updateField('male_parent_id', e.target.value)}
            onBlur={(e) => updateField('male_parent_id', normalizeIdInput(e.target.value))}
            placeholder="候補選択 or 直接入力"
          />
          <datalist id="male-parent-candidates">
            {maleCandidates.map((individual) => (
              <option key={`${individual.species_id}-${individual.id}`} value={individual.id} label={buildIndividualLabel(individual)} />
            ))}
          </datalist>
        </label>

        <label>
          メス親ID
          <input
            list="female-parent-candidates"
            value={pairing.female_parent_id}
            onChange={(e) => updateField('female_parent_id', e.target.value)}
            onBlur={(e) => updateField('female_parent_id', normalizeIdInput(e.target.value))}
            placeholder="候補選択 or 直接入力"
          />
          <datalist id="female-parent-candidates">
            {femaleCandidates.map((individual) => (
              <option key={`${individual.species_id}-${individual.id}`} value={individual.id} label={buildIndividualLabel(individual)} />
            ))}
          </datalist>
        </label>

        <label>
          ペアリング日
          <input
            type="date"
            value={toDateInput(pairing.pairing_date)}
            onChange={(e) => updateField('pairing_date', e.target.value)}
          />
        </label>

        <label>
          備考
          <textarea value={pairing.note ?? ''} onChange={(e) => updateField('note', e.target.value)} />
        </label>
      </div>

      <div className="form-actions">
        <button className="primary-button" onClick={handleSubmit} disabled={saving}>
          {saving ? '登録中...' : '登録する'}
        </button>
      </div>

      {error && <div className="status-message error-message">{error}</div>}
    </div>
  );
};
