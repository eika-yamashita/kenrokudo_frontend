import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deletePairing, getPairing, updatePairing } from '../api/PairingService';
import { getSpeciesList } from '../api/SpeciesService';
import { getIndividualList } from '../api/IndividualService';
import type { Pairing } from '../api/models/Pairing';
import type { Species } from '../api/models/Species';
import type { Individual } from '../api/models/Individual';
import { isFemaleCategory, isMaleCategory } from '../utils/genderFilter';

const toDateInput = (value: string | undefined) => value ?? '';

const buildIndividualLabel = (individual: Individual) => {
  if (individual.morph) {
    return `${individual.id} (${individual.morph})`;
  }
  return individual.id;
};

export const PairingEditorPage = () => {
  const { species_id: speciesIdParam, fiscal_year: fiscalYearParam, pairing_id: pairingIdParam } = useParams<{
    species_id: string;
    fiscal_year: string;
    pairing_id: string;
  }>();
  const navigate = useNavigate();

  const fiscalYear = Number(fiscalYearParam);
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [individuals, setIndividuals] = useState<Individual[]>([]);
  const [pairing, setPairing] = useState<Pairing | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadInitialData = async () => {
      if (!speciesIdParam || !pairingIdParam || Number.isNaN(fiscalYear)) {
        setError('URLパラメータが不正です');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const [species, individualList, pairingData] = await Promise.all([
          getSpeciesList(),
          getIndividualList(),
          getPairing(speciesIdParam, fiscalYear, pairingIdParam),
        ]);
        if (cancelled) return;
        setSpeciesList(species);
        setIndividuals(individualList);
        setPairing(pairingData);
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
  }, [speciesIdParam, fiscalYear, pairingIdParam]);

  const maleCandidates = useMemo(() => {
    if (!pairing) return [];
    return individuals.filter(
      (individual) => individual.species_id === pairing.species_id && isMaleCategory(individual.gender_category)
    );
  }, [individuals, pairing]);

  const femaleCandidates = useMemo(() => {
    if (!pairing) return [];
    return individuals.filter(
      (individual) => individual.species_id === pairing.species_id && isFemaleCategory(individual.gender_category)
    );
  }, [individuals, pairing]);

  const updateField = <K extends keyof Pairing>(key: K, value: Pairing[K]) => {
    setPairing((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSpeciesChange = (speciesId: string) => {
    setPairing((prev) =>
      prev
        ? {
            ...prev,
            species_id: speciesId,
            male_parent_id: '',
            female_parent_id: '',
          }
        : prev
    );
  };

  const handleSave = async () => {
    if (!pairing || !speciesIdParam || !pairingIdParam || Number.isNaN(fiscalYear)) return;
    if (!pairing.species_id || !pairing.male_parent_id || !pairing.female_parent_id || !pairing.pairing_date) {
      setError('種ID、オス親ID、メス親ID、ペアリング日は必須です');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const updated = await updatePairing(speciesIdParam, fiscalYear, pairingIdParam, pairing);
      navigate(`/admin/pairings/edit/${updated.species_id}/${updated.fiscal_year}/${updated.pairing_id}`, { replace: true });
      setPairing(updated);
    } catch (e: any) {
      setError(e.message ?? 'ペアリング情報の更新に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!speciesIdParam || !pairingIdParam || Number.isNaN(fiscalYear)) return;
    if (!window.confirm('このペアリング情報を削除しますか？')) return;

    setSaving(true);
    setError(null);
    try {
      await deletePairing(speciesIdParam, fiscalYear, pairingIdParam);
      navigate('/admin/pairings');
    } catch (e: any) {
      setError(e.message ?? 'ペアリング情報の削除に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="status-message">読み込み中...</div>;
  }

  if (!pairing) {
    return <div className="status-message error-message">データが見つかりません</div>;
  }

  return (
    <div className="admin-page">
      <div className="page-heading">
        <button className="ghost-button" onClick={() => navigate('/admin/pairings')}>
          一覧へ戻る
        </button>
        <h1>ペアリング編集</h1>
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
          年度
          <input value={pairing.fiscal_year ?? ''} disabled />
        </label>

        <label>
          ペアリングID
          <input value={pairing.pairing_id ?? ''} disabled />
        </label>

        <label>
          オス親ID
          <input
            list="male-parent-candidates-edit"
            value={pairing.male_parent_id}
            onChange={(e) => updateField('male_parent_id', e.target.value)}
            placeholder="候補選択 or 直接入力"
          />
          <datalist id="male-parent-candidates-edit">
            {maleCandidates.map((individual) => (
              <option
                key={`${individual.species_id}-${individual.id}`}
                value={individual.id}
                label={buildIndividualLabel(individual)}
              />
            ))}
          </datalist>
        </label>

        <label>
          メス親ID
          <input
            list="female-parent-candidates-edit"
            value={pairing.female_parent_id}
            onChange={(e) => updateField('female_parent_id', e.target.value)}
            placeholder="候補選択 or 直接入力"
          />
          <datalist id="female-parent-candidates-edit">
            {femaleCandidates.map((individual) => (
              <option
                key={`${individual.species_id}-${individual.id}`}
                value={individual.id}
                label={buildIndividualLabel(individual)}
              />
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
        <button className="primary-button" onClick={handleSave} disabled={saving}>
          {saving ? '保存中...' : '保存する'}
        </button>
        <button className="ghost-button" onClick={handleDelete} disabled={saving}>
          削除する
        </button>
      </div>

      {error && <div className="status-message error-message">{error}</div>}
    </div>
  );
};
