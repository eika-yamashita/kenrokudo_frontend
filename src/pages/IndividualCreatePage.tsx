import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadIndividualImage } from '../api/IndividualImageService';
import { getSpeciesList } from '../api/SpeciesService';
import type { Species } from '../api/models/Species';
import { useIndividualCreator } from '../hooks/useIndividualCreator';

export const IndividualCreatePage = () => {
  const navigate = useNavigate();
  const { individual, updateField, save, saving, error } = useIndividualCreator();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [speciesLoading, setSpeciesLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadSpecies = async () => {
      try {
        const list = await getSpeciesList();
        if (!cancelled) {
          setSpeciesList(list);
          if (!individual.species_cd && list.length > 0) {
            updateField('species_cd', list[0].species_id);
          }
        }
      } catch {
        if (!cancelled) setSpeciesList([]);
      } finally {
        if (!cancelled) setSpeciesLoading(false);
      }
    };

    loadSpecies();

    return () => {
      cancelled = true;
    };
  }, [individual.species_cd, updateField]);

  const handleSubmit = async () => {
    if (!individual.species_cd) {
      setUploadError('種を選択してください');
      return;
    }

    try {
      setUploadError(null);
      const created = await save();
      if (created && imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i += 1) {
          await uploadIndividualImage(created.species_cd, created.id, imageFiles[i], i === primaryImageIndex);
        }
      }
      navigate('/admin');
    } catch (e: any) {
      setUploadError(e.message ?? '画像のアップロードに失敗しました');
    }
  };

  return (
    <div className="admin-page">
      <div className="page-heading">
        <button className="ghost-button" onClick={() => navigate('/admin')}>
          一覧へ戻る
        </button>
        <h1>個体の新規登録</h1>
        <p>管理画面から新しい個体情報を登録します。</p>
      </div>

      <div className="admin-form">
        <label>
          種名
          <select
            value={individual.species_cd}
            onChange={(e) => updateField('species_cd', e.target.value)}
            disabled={speciesLoading || speciesList.length === 0}
          >
            {speciesList.length === 0 && <option value="">種マスタ未登録</option>}
            {speciesList.map((species) => (
              <option key={species.species_id} value={species.species_id}>
                {species.common_name || species.japanese_name} ({species.species_id})
              </option>
            ))}
          </select>
        </label>
        <label>
          個体ID
          <input value={individual.id} onChange={(e) => updateField('id', e.target.value)} />
        </label>
        <label>
          オス親ID
          <input
            value={individual.male_parent_id ?? ''}
            onChange={(e) => updateField('male_parent_id', e.target.value)}
          />
        </label>
        <label>
          メス親ID
          <input
            value={individual.female_parent_id ?? ''}
            onChange={(e) => updateField('female_parent_id', e.target.value)}
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
          性別区分 (M/F/U)
          <input
            value={individual.gender_category ?? ''}
            onChange={(e) => updateField('gender_category', e.target.value)}
          />
        </label>
        <label>
          繁殖区分 (A/B)
          <input
            value={individual.breeding_category ?? ''}
            onChange={(e) => updateField('breeding_category', e.target.value)}
          />
        </label>
        <label>
          ブリーダー名
          <input value={individual.breeder ?? ''} onChange={(e) => updateField('breeder', e.target.value)} />
        </label>
        <label>
          クラッチ日
          <input
            type="date"
            value={individual.clutch_date ?? ''}
            onChange={(e) => updateField('clutch_date', e.target.value)}
          />
        </label>
        <label>
          ハッチ日
          <input
            type="date"
            value={individual.hatch_date ?? ''}
            onChange={(e) => updateField('hatch_date', e.target.value)}
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
            value={individual.purchase_date ?? ''}
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
            value={individual.sales_date ?? ''}
            onChange={(e) => updateField('sales_date', e.target.value)}
          />
        </label>
        <label>
          死亡日
          <input
            type="date"
            value={individual.death_date ?? ''}
            onChange={(e) => updateField('death_date', e.target.value)}
          />
        </label>
        <label>
          メモ
          <textarea value={individual.note ?? ''} onChange={(e) => updateField('note', e.target.value)} />
        </label>
        <label>
          作成者
          <input value={individual.create_user} onChange={(e) => updateField('create_user', e.target.value)} />
        </label>
        <label>
          作成日時
          <input
            type="datetime-local"
            value={individual.create_at}
            onChange={(e) => updateField('create_at', e.target.value)}
          />
        </label>
      </div>

      <div className="image-upload-panel">
        <h2>画像</h2>
        <label>
          画像ファイル（複数選択可）
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
            {imageFiles.map((file, index) => (
              <label key={`${file.name}-${index}`} className="image-row">
                <input
                  type="radio"
                  name="primaryImage"
                  checked={primaryImageIndex === index}
                  onChange={() => setPrimaryImageIndex(index)}
                />
                <span>{file.name}</span>
              </label>
            ))}
          </div>
        )}
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
