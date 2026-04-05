import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getIndividualImages } from '../api/IndividualImageService';
import { getSpeciesList } from '../api/SpeciesService';
import type { IndividualImage } from '../api/models/IndividualImage';
import { useIndividualEditor } from '../hooks/useIndividualEditor';
import { formatDateTimeYmdHm, formatDateYmd } from '../utils/dateFormat';
import { formatGenderCategory } from '../utils/genderCategory';

const fieldRows: Array<{ label: string; valueKey: keyof NonNullable<ReturnType<typeof useIndividualEditor>['individual']> }> = [
  { label: '種ID', valueKey: 'species_id' },
  { label: '個体ID', valueKey: 'id' },
  { label: 'オス親ID', valueKey: 'male_parent_id' },
  { label: 'メス親ID', valueKey: 'female_parent_id' },
  { label: 'モルフ', valueKey: 'morph' },
  { label: '血統', valueKey: 'bloodline' },
  { label: '雌雄区分', valueKey: 'gender_category' },
  { label: '繁殖区分', valueKey: 'breeding_category' },
  { label: 'ブリーダー名', valueKey: 'breeder' },
  { label: 'ハッチ日', valueKey: 'hatch_date' },
  { label: 'クラッチ日', valueKey: 'clutch_date' },
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
];

export const IndividualDetailPage = () => {
  const { species_id: speciesId, id } = useParams<{ species_id: string; id: string }>();
  const navigate = useNavigate();

  const { individual, loading, error } = useIndividualEditor({
    species: speciesId!,
    individualId: id!,
  });

  const [images, setImages] = useState<IndividualImage[]>([]);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState<string | null>(null);
  const [speciesDisplayName, setSpeciesDisplayName] = useState<string>('');

  const breedingCategoryLabelMap: Record<string, string> = {
    '0': '自家繁殖',
    '1': '購入個体',
  };

  const dateKeys = new Set([
    'hatch_date',
    'clutch_date',
    'purchase_date',
    'sales_date',
    'death_date',
  ]);

  const formatDetailValue = (key: string, raw: unknown) => {
    if (raw === null || raw === undefined || raw === '') {
      return '-';
    }

    const value = String(raw);

    if (key === 'breeding_category') {
      return breedingCategoryLabelMap[value] ?? value;
    }

    if (key === 'species_id') {
      return speciesDisplayName || value;
    }

    if (key === 'gender_category') {
      return formatGenderCategory(value);
    }

    if (key === 'create_at' || key === 'update_at') {
      return formatDateTimeYmdHm(value);
    }

    if (dateKeys.has(key)) {
      return formatDateYmd(value);
    }

    return value;
  };

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

  useEffect(() => {
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

    loadImages();
  }, [speciesId, id]);

  if (loading) return <div className="status-message">読み込み中...</div>;
  if (!individual) return <div className="status-message">データが見つかりません</div>;

  return (
    <div className="admin-page">
      <div className="page-heading">

        
      </div>

      <div className="form-actions">
        <button
          className="primary-button"
          onClick={() => navigate(`/admin/individuals/edit/${individual.species_id}/${individual.id}`)}>
          編集する
        </button>
        <button className="ghost-button" onClick={() => navigate('/admin/individuals')}>
          一覧へ戻る
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
              <dd>{formatDetailValue(String(valueKey), individual[valueKey])}</dd>
            </div>
          ))}
        </div>
      </div>

      {error && <div className="status-message error-message">{error}</div>}
      {imageError && <div className="status-message error-message">{imageError}</div>}
    </div>
  );
};
