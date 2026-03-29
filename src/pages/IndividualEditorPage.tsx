import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  deleteIndividualImage,
  getIndividualImages,
  replaceIndividualImage,
  setPrimaryIndividualImage,
  uploadIndividualImage,
} from '../api/IndividualImageService';
import type { IndividualImage } from '../api/models/IndividualImage';
import { useIndividualEditor } from '../hooks/useIndividualEditor';

export const IndividualEditorPage = () => {
  const { species_cd: speciesCd, id } = useParams<{
    species_cd: string;
    id: string;
  }>();
  const navigate = useNavigate();

  const { individual, updateField, save, loading, saving, error } = useIndividualEditor({
    species: speciesCd!,
    individualId: id!,
  });

  const [images, setImages] = useState<IndividualImage[]>([]);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState<string | null>(null);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [savingAll, setSavingAll] = useState(false);

  const loadImages = async () => {
    if (!speciesCd || !id) return;
    setImageLoading(true);
    setImageError(null);
    try {
      const list = await getIndividualImages(speciesCd, id);
      setImages(list);
    } catch (e: any) {
      setImageError(e.message ?? '画像の取得に失敗しました');
    } finally {
      setImageLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, [speciesCd, id]);

  if (loading) return <div className="status-message">読み込み中...</div>;
  if (!individual) return <div className="status-message">データが見つかりません</div>;

  const handleSaveAll = async () => {
    setSavingAll(true);
    setImageError(null);
    try {
      await save();

      if (newFiles.length > 0) {
        for (let i = 0; i < newFiles.length; i += 1) {
          await uploadIndividualImage(individual.species_cd, individual.id, newFiles[i]);
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
          onClick={() => navigate(`/admin/detail/${individual.species_cd}/${individual.id}`)}
        >
          詳細へ戻る
        </button>
        <h1>個体情報の編集</h1>
        <p>
          種コード: <strong>{individual.species_cd}</strong> / 個体ID: <strong>{individual.id}</strong>
        </p>
      </div>

      <div className="image-upload-panel">
        <h2>画像管理</h2>

        <label>
          画像追加（複数選択可）
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
                  <div>{img.file_name ?? String(img.image_id)}</div>
                  <div>{img.is_primary ? 'メイン画像' : 'サブ画像'}</div>
                </div>
                <div className="image-actions">
                  {!img.is_primary && (
                    <button
                      className="ghost-button"
                      onClick={async () => {
                        try {
                          await setPrimaryIndividualImage(individual.species_cd, individual.id, img.image_id);
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
                    差し替え
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          await replaceIndividualImage(individual.species_cd, individual.id, img.image_id, file);
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
                        await deleteIndividualImage(individual.species_cd, individual.id, img.image_id);
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
            種コード
            <input value={individual.species_cd} disabled />
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
            更新者
            <input
              value={individual.update_user ?? ''}
              onChange={(e) => updateField('update_user', e.target.value)}
            />
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
