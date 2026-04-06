import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadIndividualImage } from '../api/IndividualImageService';
import { getPairingList } from '../api/PairingService';
import { getSpeciesList } from '../api/SpeciesService';
import type { Pairing } from '../api/models/Pairing';
import type { Species } from '../api/models/Species';
import { useIndividualCreator } from '../hooks/useIndividualCreator';
import { toDateInputValue } from '../utils/dateFormat';
import { genderCategoryOptions } from '../utils/genderCategory';
import { normalizeIdInput } from '../utils/idNormalizer';

export const IndividualCreatePage = () => {
  const navigate = useNavigate();
  const { individual, updateField, save, saving, error } = useIndividualCreator();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [pairingList, setPairingList] = useState<Pairing[]>([]);
  const [speciesLoading, setSpeciesLoading] = useState(true);
  const [pairingLoading, setPairingLoading] = useState(true);
  const breedingCategoryOptions = [
    { value: '0', label: '0: 自家繁殖' },
    { value: '1', label: '1: 購入個体' },
  ];

  const filteredPairings = useMemo(
    () =>
      pairingList
        .filter((pairing) => pairing.species_id === individual.species_id)
        .sort((a, b) => {
          const yearDiff = (b.fiscal_year ?? 0) - (a.fiscal_year ?? 0);
          if (yearDiff !== 0) return yearDiff;
          return (a.pairing_id ?? '').localeCompare(b.pairing_id ?? '');
        }),
    [pairingList, individual.species_id]
  );

  const selectedPairingKey =
    individual.pairing_fiscal_year !== undefined && individual.pairing_id
      ? `${individual.pairing_fiscal_year}|${individual.pairing_id}`
      : '';
  const pairingSelected = Boolean(selectedPairingKey);

  useEffect(() => {
    let cancelled = false;

    const loadMasterData = async () => {
      try {
        const [species, pairings] = await Promise.all([getSpeciesList(), getPairingList()]);
        if (!cancelled) {
          setSpeciesList(species);
          setPairingList(pairings);
          if (!individual.species_id && species.length > 0) {
            updateField('species_id', species[0].species_id);
          }
        }
      } catch {
        if (!cancelled) {
          setSpeciesList([]);
          setPairingList([]);
        }
      } finally {
        if (!cancelled) {
          setSpeciesLoading(false);
          setPairingLoading(false);
        }
      }
    };

    loadMasterData();

    return () => {
      cancelled = true;
    };
  }, [updateField]);

  useEffect(() => {
    const previewUrls = imageFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(previewUrls);

    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageFiles]);

  const handleSpeciesChange = (speciesId: string) => {
    updateField('species_id', speciesId);
    updateField('pairing_fiscal_year', undefined);
    updateField('pairing_id', undefined);
    updateField('male_parent_id', '');
    updateField('female_parent_id', '');
  };

  const handlePairingChange = (value: string) => {
    if (!value) {
      updateField('pairing_fiscal_year', undefined);
      updateField('pairing_id', undefined);
      updateField('male_parent_id', '');
      updateField('female_parent_id', '');
      return;
    }

    const [fiscalYearStr, pairingId] = value.split('|');
    const fiscalYear = Number(fiscalYearStr);
    const selected = filteredPairings.find(
      (pairing) => pairing.fiscal_year === fiscalYear && pairing.pairing_id === pairingId
    );

    if (Number.isNaN(fiscalYear) || !selected) {
      updateField('pairing_fiscal_year', undefined);
      updateField('pairing_id', undefined);
      return;
    }

    updateField('pairing_fiscal_year', fiscalYear);
    updateField('pairing_id', pairingId);
    updateField('male_parent_id', selected.male_parent_id);
    updateField('female_parent_id', selected.female_parent_id);
  };

  const handleSubmit = async () => {
    if (!individual.species_id) {
      setUploadError('種を選択してください');
      return;
    }
    if (!individual.breeding_category) {
      setUploadError('繁殖区分を選択してください');
      return;
    }
    if (individual.breeding_category && !individual.hatch_date) {
      setUploadError('繁殖区分を選択した場合はハッチ日を入力してください');
      return;
    }

    try {
      setUploadError(null);
      const created = await save();
      if (created && imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i += 1) {
          await uploadIndividualImage(created.species_id, created.id, imageFiles[i], i === primaryImageIndex);
        }
      }
      navigate('/admin/individuals');
    } catch (e: any) {
      setUploadError(e.message ?? '画像のアップロードに失敗しました');
    }
  };

  return (
    <div className="admin-page">
      <div className="page-heading">
        <button className="ghost-button" onClick={() => navigate('/admin/individuals')}>
          一覧へ戻る
        </button>
        <h1>新規登録</h1>
      </div>

      <div className="image-upload-panel">
        <label>
          画像ファイル
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              setImageFiles(files);
              setPrimaryImageIndex(0);
            }}
          />
        </label>

        {imageFiles.length > 0 && (
          <div className="selected-images">
            {imageFiles.map((file, index) => {
              const previewUrl = imagePreviews[index];
              return (
                <label key={`${file.name}-${index}`} className="image-row">
                  <input
                    type="radio"
                    name="primaryImage"
                    checked={primaryImageIndex === index}
                    onChange={() => setPrimaryImageIndex(index)}
                  />
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt={file.name}
                      style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, marginRight: 8 }}
                    />
                  )}
                  <span>{file.name}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      <div className="admin-form">
        <label>
          種名
          <select
            value={individual.species_id}
            onChange={(e) => handleSpeciesChange(e.target.value)}
            disabled={speciesLoading || speciesList.length === 0}
          >
            {speciesList.length === 0 && <option value="">種マスタ未登録</option>}
            {speciesList.map((species) => (
              <option key={species.species_id} value={species.species_id}>
                {species.common_name || species.japanese_name}
              </option>
            ))}
          </select>
        </label>
        <label>
          繁殖区分
          <select
            value={individual.breeding_category ?? ''}
            onChange={(e) => updateField('breeding_category', e.target.value)}
            required
          >
            <option value="">選択してください</option>
            {breedingCategoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          ペアリングID
          <select
            value={selectedPairingKey}
            onChange={(e) => handlePairingChange(e.target.value)}
            disabled={pairingLoading || !individual.species_id}
          >
            <option value="">選択なし（親IDを手入力）</option>
            {filteredPairings.map((pairing) => {
              const optionKey = `${pairing.fiscal_year}|${pairing.pairing_id}`;
              return (
                <option key={optionKey} value={optionKey}>
                  {`${pairing.fiscal_year} / ${pairing.pairing_id} (M:${pairing.male_parent_id} F:${pairing.female_parent_id})`}
                </option>
              );
            })}
          </select>
        </label>
        <label>
          個体ID
          <input
            value={individual.id}
            onChange={(e) => updateField('id', e.target.value)}
            onBlur={(e) => updateField('id', normalizeIdInput(e.target.value))}
          />
        </label>
        <label>
          オス親ID
          <input
            value={individual.male_parent_id ?? ''}
            onChange={(e) => updateField('male_parent_id', e.target.value)}
            onBlur={(e) => updateField('male_parent_id', normalizeIdInput(e.target.value))}
            disabled={pairingSelected}
          />
        </label>
        <label>
          メス親ID
          <input
            value={individual.female_parent_id ?? ''}
            onChange={(e) => updateField('female_parent_id', e.target.value)}
            onBlur={(e) => updateField('female_parent_id', normalizeIdInput(e.target.value))}
            disabled={pairingSelected}
          />
        </label>
        <label>
          モルフ
          <input value={individual.morph ?? ''} onChange={(e) => updateField('morph', e.target.value)} />
        </label>
        <label>
          血統
          <input
            value={individual.bloodline ?? ''}
            onChange={(e) => updateField('bloodline', e.target.value)}
          />
        </label>
        <label>
          雌雄区分
          <select
            value={individual.gender_category ?? ''}
            onChange={(e) => updateField('gender_category', e.target.value)}
          >
            <option value="">選択してください</option>
            {genderCategoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          ブリーダー名
          <input value={individual.breeder ?? ''} onChange={(e) => updateField('breeder', e.target.value)} />
        </label>
        <label>
          ハッチ日
          <input
            type="date"
            value={toDateInputValue(individual.hatch_date)}
            onChange={(e) => updateField('hatch_date', e.target.value)}
            required={Boolean(individual.breeding_category)}
          />
        </label>
        <label>
          クラッチ日
          <input
            type="date"
            value={toDateInputValue(individual.clutch_date)}
            onChange={(e) => updateField('clutch_date', e.target.value)}
          />
        </label>
        <label>
          購入元
          <input
            value={individual.purchase_from ?? ''}
            onChange={(e) => updateField('purchase_from', e.target.value)}
          />
        </label>
        <label>
          購入価格
          <input
            type="number"
            step="0.01"
            value={individual.purchase_price ?? ''}
            onChange={(e) =>
              updateField('purchase_price', e.target.value === '' ? undefined : Number(e.target.value))
            }
          />
        </label>
        <label>
          購入日
          <input
            type="date"
            value={toDateInputValue(individual.purchase_date)}
            onChange={(e) => updateField('purchase_date', e.target.value)}
          />
        </label>
        <label>
          販売区分
          <input
            value={individual.sales_category ?? ''}
            onChange={(e) => updateField('sales_category', e.target.value)}
          />
        </label>
        <label>
          販売先
          <input value={individual.sales_to ?? ''} onChange={(e) => updateField('sales_to', e.target.value)} />
        </label>
        <label>
          販売価格(税抜)
          <input
            type="number"
            step="0.01"
            value={individual.sales_price_tax_ex ?? ''}
            onChange={(e) =>
              updateField('sales_price_tax_ex', e.target.value === '' ? undefined : Number(e.target.value))
            }
          />
        </label>
        <label>
          消費税額
          <input
            type="number"
            step="0.01"
            value={individual.sales_price_tax ?? ''}
            onChange={(e) =>
              updateField('sales_price_tax', e.target.value === '' ? undefined : Number(e.target.value))
            }
          />
        </label>
        <label>
          販売価格(税込)
          <input
            type="number"
            step="0.01"
            value={individual.sales_price_tax_in ?? ''}
            onChange={(e) =>
              updateField('sales_price_tax_in', e.target.value === '' ? undefined : Number(e.target.value))
            }
          />
        </label>
        <label>
          販売日
          <input
            type="date"
            value={toDateInputValue(individual.sales_date)}
            onChange={(e) => updateField('sales_date', e.target.value)}
          />
        </label>
        <label>
          死亡日
          <input
            type="date"
            value={toDateInputValue(individual.death_date)}
            onChange={(e) => updateField('death_date', e.target.value)}
          />
        </label>
        <label>
          メモ
          <textarea value={individual.note ?? ''} onChange={(e) => updateField('note', e.target.value)} />
        </label>
      </div>

      <div className="form-actions">
        <button className="primary-button" onClick={handleSubmit} disabled={saving || speciesLoading}>
          {saving ? '登録中...' : '登録する'}
        </button>
      </div>

      {error && <div className="status-message error-message">{error}</div>}
      {uploadError && <div className="status-message error-message">{uploadError}</div>}
    </div>
  );
};
