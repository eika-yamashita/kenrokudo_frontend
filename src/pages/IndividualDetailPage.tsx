import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getIndividualImages } from '../api/IndividualImageService';
import type { IndividualImage } from '../api/models/IndividualImage';
import { useIndividualEditor } from '../hooks/useIndividualEditor';

const fieldRows: Array<{ label: string; valueKey: keyof NonNullable<ReturnType<typeof useIndividualEditor>['individual']> }> = [
  { label: '種コード', valueKey: 'species_cd' },
  { label: '個体ID', valueKey: 'id' },
  { label: 'オス親ID', valueKey: 'male_parent_id' },
  { label: 'メス親ID', valueKey: 'female_parent_id' },
  { label: 'モルフ', valueKey: 'morph' },
  { label: '血統', valueKey: 'bloodline' },
  { label: '性別区分', valueKey: 'gender_category' },
  { label: '繁殖区分', valueKey: 'breeding_category' },
  { label: 'ブリーダー名', valueKey: 'breeder' },
  { label: 'クラッチ日', valueKey: 'clutch_date' },
  { label: 'ハッチ日', valueKey: 'hatch_date' },
  { label: '購入元', valueKey: 'purchase_from' },
  { label: '購入価格', valueKey: 'purchase_price' },
  { label: '購入日', valueKey: 'purchase_date' },
  { label: '販売区分', valueKey: 'sales_category' },
  { label: '販売先', valueKey: 'sales_to' },
  { label: '販売価格(税抜)', valueKey: 'sales_price_tax_ex' },
  { label: '消費税額', valueKey: 'sales_price_tax' },
  { label: '販売価格(税込)', valueKey: 'sales_price_tax_in' },
  { label: '販売日', valueKey: 'sales_date' },
  { label: '死亡日', valueKey: 'death_date' },
  { label: 'メモ', valueKey: 'note' },
  { label: '作成者', valueKey: 'create_user' },
  { label: '作成日時', valueKey: 'create_at' },
  { label: '更新者', valueKey: 'update_user' },
  { label: '更新日時', valueKey: 'update_at' },
];

export const IndividualDetailPage = () => {
  const { species_cd: speciesCd, id } = useParams<{ species_cd: string; id: string }>();
  const navigate = useNavigate();

  const { individual, loading, error } = useIndividualEditor({
    species: speciesCd!,
    individualId: id!,
  });

  const [images, setImages] = useState<IndividualImage[]>([]);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
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

    loadImages();
  }, [speciesCd, id]);

  if (loading) return <div className="status-message">読み込み中...</div>;
  if (!individual) return <div className="status-message">データが見つかりません</div>;

  return (
    <div className="admin-page">
      <div className="page-heading">
        <button className="ghost-button" onClick={() => navigate('/admin')}>
          一覧へ戻る
        </button>
        <h1>個体詳細</h1>
        <p>
          種コード: <strong>{individual.species_cd}</strong> / 個体ID: <strong>{individual.id}</strong>
        </p>
      </div>

      <div className="form-actions">
        <button
          className="primary-button"
          onClick={() => navigate(`/admin/edit/${individual.species_cd}/${individual.id}`)}
        >
          編集する
        </button>
      </div>

      <div className="image-upload-panel">
        <h2>画像</h2>
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
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="detail-info-panel">
        <h2>個体情報</h2>
        <div className="detail-grid">
          {fieldRows.map(({ label, valueKey }) => (
            <div key={String(valueKey)} className="detail-item">
              <dt>{label}</dt>
              <dd>{String(individual[valueKey] ?? '-')}</dd>
            </div>
          ))}
        </div>
      </div>

      {error && <div className="status-message error-message">{error}</div>}
      {imageError && <div className="status-message error-message">{imageError}</div>}
    </div>
  );
};
