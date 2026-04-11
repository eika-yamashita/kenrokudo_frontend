import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AdminPageLayout,
  PageHeader,
  StatusBanner,
  adminStyles,
} from '../../../shared/ui/admin';
import { formatDateTimeYmdHm, formatDateYmd } from '../../../utils/dateFormat';
import { formatGenderCategory } from '../../../utils/genderCategory';
import { useSpeciesQuery } from '../../species/hooks/useSpeciesQuery';
import { getSpeciesLabel } from '../../species/utils/getSpeciesLabel';
import { useIndividualImagesQuery, useIndividualQuery } from '../hooks/useIndividualQueries';

type Props = {
  speciesId: string;
  id: string;
};

const fieldRows = [
  ['種', 'species_id'],
  ['個体ID', 'id'],
  ['オス親ID', 'male_parent_id'],
  ['メス親ID', 'female_parent_id'],
  ['モルフ', 'morph'],
  ['血統', 'bloodline'],
  ['雌雄区分', 'gender_category'],
  ['繁殖区分', 'breeding_category'],
  ['ブリーダー名', 'breeder'],
  ['ハッチ日', 'hatch_date'],
  ['クラッチ日', 'clutch_date'],
  ['購入元', 'purchase_from'],
  ['購入価格', 'purchase_price'],
  ['購入日', 'purchase_date'],
  ['販売区分', 'sales_category'],
  ['販売先', 'sales_to'],
  ['販売価格(税抜)', 'sales_price_tax_ex'],
  ['消費税額', 'sales_price_tax'],
  ['販売価格(税込)', 'sales_price_tax_in'],
  ['販売日', 'sales_date'],
  ['死亡日', 'death_date'],
  ['メモ', 'note'],
  ['作成日時', 'create_at'],
  ['更新日時', 'update_at'],
] as const;

export const IndividualDetailScreen = ({ speciesId, id }: Props) => {
  const navigate = useNavigate();
  const individualQuery = useIndividualQuery(speciesId, id);
  const imagesQuery = useIndividualImagesQuery(speciesId, id);
  const speciesQuery = useSpeciesQuery();
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const images = imagesQuery.data ?? [];
  const defaultImage = images.find((image) => image.is_primary) ?? images[0] ?? null;

  useEffect(() => {
    if (images.length === 0) {
      if (selectedImageId !== null) {
        setSelectedImageId(null);
      }
      return;
    }

    if (selectedImageId !== null && images.some((image) => image.image_id === selectedImageId)) {
      return;
    }

    setSelectedImageId(defaultImage?.image_id ?? images[0].image_id);
  }, [defaultImage?.image_id, images, selectedImageId]);

  if (individualQuery.isLoading || imagesQuery.isLoading || speciesQuery.isLoading) {
    return <StatusBanner>読み込み中...</StatusBanner>;
  }

  if (individualQuery.error) {
    return <StatusBanner tone="error">{individualQuery.error.message}</StatusBanner>;
  }

  if (imagesQuery.error) {
    return <StatusBanner tone="error">{imagesQuery.error.message}</StatusBanner>;
  }

  if (speciesQuery.error) {
    return <StatusBanner tone="error">{speciesQuery.error.message}</StatusBanner>;
  }

  if (!individualQuery.data || !speciesQuery.data) {
    return <StatusBanner tone="error">データが見つかりません</StatusBanner>;
  }

  const individual = individualQuery.data;
  const speciesLabel = getSpeciesLabel(speciesId, speciesQuery.data);
  const selectedImage = images.find((image) => image.image_id === selectedImageId) ?? defaultImage;
  const selectedImageIndex = selectedImage ? images.findIndex((image) => image.image_id === selectedImage.image_id) : -1;

  const formatValue = (key: string, raw: unknown) => {
    if (raw === null || raw === undefined || raw === '') {
      return '-';
    }

    const value = String(raw);
    if (key === 'species_id') return speciesLabel;
    if (key === 'gender_category') return formatGenderCategory(value);
    if (key === 'breeding_category') return value === '1' ? '購入個体' : '自家繁殖';
    if (['hatch_date', 'clutch_date', 'purchase_date', 'sales_date', 'death_date'].includes(key)) {
      return formatDateYmd(value);
    }
    if (['create_at', 'update_at'].includes(key)) {
      return formatDateTimeYmdHm(value);
    }

    return value;
  };

  return (
    <AdminPageLayout>
      <PageHeader
        title={`${speciesLabel} / ${individual.id}`}
        stickyActions
        actions={
          <div className={adminStyles.inlineActions}>
            <button className={adminStyles.button} type="button" onClick={() => navigate(`/admin/individuals/edit/${speciesId}/${id}`)}>
              編集する
            </button>
            <button className={adminStyles.buttonGhost} type="button" onClick={() => navigate('/admin/individuals')}>
              一覧へ戻る
            </button>
          </div>
        }
      />

      <div className={adminStyles.stack}>
        <div>
          {images.length === 0 ? (
            <div className={adminStyles.imageShowcase}>
              <div className={`${adminStyles.imageMain} ${adminStyles.imageMainPlaceholder}`}>
                <div className={adminStyles.imageEmptyState} role="img" aria-label="画像未登録 (No Image)">
                  NO IMAGE
                </div>
              </div>
            </div>
          ) : (
            <div className={adminStyles.imageShowcase}>
              <div className={adminStyles.imageMain}>
                {selectedImage ? (
                  <img src={selectedImage.public_url} alt={selectedImage.file_name ?? String(selectedImage.image_id)} />
                ) : null}
                {selectedImageIndex >= 0 ? (
                  <span className={adminStyles.imageCountBadge}>
                    {selectedImageIndex + 1} / {images.length}
                  </span>
                ) : null}
              </div>
              {images.length > 1 ? (
                <div className={adminStyles.imageThumbRail} aria-label="画像サムネイル一覧">
                  {images.map((image, index) => {
                    const isActive = selectedImage?.image_id === image.image_id;
                    return (
                      <button
                        key={image.image_id}
                        type="button"
                        className={`${adminStyles.imageThumbButton} ${isActive ? adminStyles.imageThumbActive : ''}`}
                        onClick={() => setSelectedImageId(image.image_id)}
                        aria-label={`画像 ${index + 1} を表示`}
                        aria-pressed={isActive}
                      >
                        <img src={image.public_url} alt={image.file_name ?? `thumbnail-${index + 1}`} />
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div className={adminStyles.panel}>
          <dl className={adminStyles.detailGrid}>
            {fieldRows.map(([label, key]) => (
              <div key={key} className={adminStyles.detailItem}>
                <dt>{label}</dt>
                <dd>{formatValue(key, individual[key])}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </AdminPageLayout>
  );
};
