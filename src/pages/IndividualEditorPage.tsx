import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  deleteIndividualImage,
  getIndividualImages,
  replaceIndividualImage,
  setPrimaryIndividualImage,
  uploadIndividualImage,
} from '../api/IndividualImageService';
import { getSpeciesList } from '../api/SpeciesService';
import type { IndividualImage } from '../api/models/IndividualImage';
import { useIndividualEditor } from '../hooks/useIndividualEditor';
import { toDateInputValue } from '../utils/dateFormat';
import { genderCategoryOptions } from '../utils/genderCategory';

export const IndividualEditorPage = () => {
  const { species_id: speciesId, id } = useParams<{
    species_id: string;
    id: string;
  }>();
  const navigate = useNavigate();

  const { individual, updateField, save, loading, saving, error } = useIndividualEditor({
    species: speciesId!,
    individualId: id!,
  });

  const [images, setImages] = useState<IndividualImage[]>([]);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState<string | null>(null);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [savingAll, setSavingAll] = useState(false);
  const [speciesDisplayName, setSpeciesDisplayName] = useState<string>('');

  const breedingCategoryOptions = [
    { value: '0', label: '0: 自家繁殖' },
    { value: '1', label: '1: 購入個体' },
  ];

  const loadImages = async () => {
    if (!speciesId || !id) return;
    setImageLoading(true);
    setImageError(null);
    try {
      const list = await getIndividualImages(speciesId, id);
      setImages(list);
    } catch (e: any) {
      setImageError(e.message ?? '画像の取得に失敗しました');
    } finally {
      setImageLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, [speciesId, id]);

  useEffect(() => {
    const loadSpecies = async () => {
      if (!speciesId) return;
      try {
        const species = await getSpeciesList();
        const selected = species.find((item) => item.species_id === speciesId);
        setSpeciesDisplayName(selected?.common_name || selected?.japanese_name || speciesId);
      } catch {
        setSpeciesDisplayName(speciesId);
      }
    };

    loadSpecies();
  }, [speciesId]);

  if (loading) return <div className="status-message">読み込み中...</div>;
  if (!individual) return <div className="status-message">データが見つかりません</div>;

  const handleSaveAll = async () => {
    if (!individual.breeding_category) {
      setImageError('繁殖区分を選択してください');
      return;
    }
    if (individual.breeding_category && !individual.hatch_date) {
      setImageError('繁殖区分を選択した場合はハッチ日を入力してください');
      return;
    }

    setSavingAll(true);
    setImageError(null);
    try {
      await save();

      if (newFiles.length > 0) {
        for (let i = 0; i < newFiles.length; i += 1) {
          await uploadIndividualImage(individual.species_id, individual.id, newFiles[i]);
        }
        setNewFiles([]);
        await loadImages();
      }
    } catch (e: any) {
      setImageError(e.message ?? '保存処理に失敗しました');
    } finally {
      setSavingAll(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-heading">
        <button
          className="ghost-button"
          onClick={() => navigate(`/admin/individuals/detail/${individual.species_id}/${individual.id}`)}
        >
          詳細へ戻る
        </button>
        <h1>個体情報の編集</h1>
        <p>
          種ID: <strong>{speciesDisplayName || individual.species_id}</strong> / 個体ID: <strong>{individual.id}</strong>
        </p>
      </div>

      <div className="image-upload-panel">
        <h2>画像</h2>

        <label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => setNewFiles(Array.from(e.target.files ?? []))}
          />
        </label>

        {newFiles.length > 0 && (
          <div className="status-message">
            画像が {newFiles.length} 件選択されています。保存ボタン押下時に個体情報と一緒に登録されます。
          </div>
        )}

        {imageLoading && <div className="status-message">画像を読み込み中...</div>}

        {!imageLoading && (
          <div className="image-grid">
            {images.length === 0 && <div className="status-message">画像は未登録です</div>}
            {images.map((img) => (
              <div key={img.image_id} className="image-card">
                <img src={img.public_url} alt={img.file_name ?? String(img.image_id)} />
                <div className="image-meta">
                  <div>{img.is_primary ? 'メイン画像' : 'サブ画像'}</div>
                </div>
                <div className="image-actions">
                  {!img.is_primary && (
                    <button
                      className="ghost-button"
                      onClick={async () => {
                        try {
                          await setPrimaryIndividualImage(individual.species_id, individual.id, img.image_id);
                          await loadImages();
                        } catch (e: any) {
                          setImageError(e.message ?? 'メイン画像の設定に失敗しました');
                        }
                      }}
                    >
                      メインにする
                    </button>
                  )}
                  <label className="ghost-button file-button">
                    差替
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          await replaceIndividualImage(individual.species_id, individual.id, img.image_id, file);
                          await loadImages();
                        } catch (err: any) {
                          setImageError(err.message ?? '画像の差し替えに失敗しました');
                        }
                      }}
                    />
                  </label>
                  <button
                    className="ghost-button"
                    onClick={async () => {
                      try {
                        await deleteIndividualImage(individual.species_id, individual.id, img.image_id);
                        await loadImages();
                      } catch (e: any) {
                        setImageError(e.message ?? '画像の削除に失敗しました');
                      }
                    }}
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="detail-info-panel">
        <h2>個体情報</h2>
        <div className="admin-form">
          <label>
            種ID
            <input value={speciesDisplayName || individual.species_id} disabled />
          </label>
          <label>
            個体ID
            <input value={individual.id} disabled />
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
            ブリーダー名
            <input value={individual.breeder ?? ''} onChange={(e) => updateField('breeder', e.target.value)} />
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
            ハッチ日
            <input
              type="date"
              value={toDateInputValue(individual.hatch_date)}
              onChange={(e) => updateField('hatch_date', e.target.value)}
              required={Boolean(individual.breeding_category)}
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
      </div>

      <div className="form-actions">
        <button className="primary-button" onClick={handleSaveAll} disabled={saving || savingAll}>
          {saving || savingAll ? '保存中...' : '保存する'}
        </button>
      </div>

      {error && <div className="status-message error-message">{error}</div>}
      {imageError && <div className="status-message error-message">{imageError}</div>}
    </div>
  );
};
