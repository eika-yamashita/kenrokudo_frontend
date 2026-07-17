import { useNavigate, useSearchParams } from 'react-router-dom';
import { AdminPageLayout, PageHeader, StatusBanner, adminStyles } from '../../../shared/ui/admin';
import { useSpeciesQuery } from '../../species/hooks/useSpeciesQuery';
import { useMorphQuery } from '../hooks/useMorphQueries';

type Props = {
  speciesId: string;
  morphId: string;
};

const inheritanceCategoryLabels: Record<string, string> = {
  '0': '多因性遺伝',
  '1': '劣性遺伝',
  '2': '優勢遺伝',
  '3': '共優勢遺伝',
};

export const MorphDetailScreen = ({ speciesId, morphId }: Props) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentSpeciesId = searchParams.get('speciesId') ?? speciesId;
  const morphQuery = useMorphQuery(speciesId, morphId);
  const speciesQuery = useSpeciesQuery();

  if (morphQuery.isLoading || speciesQuery.isLoading) {
    return <StatusBanner>読み込み中...</StatusBanner>;
  }

  if (morphQuery.error) {
    return <StatusBanner tone="error">{morphQuery.error.message}</StatusBanner>;
  }

  if (speciesQuery.error) {
    return <StatusBanner tone="error">{speciesQuery.error.message}</StatusBanner>;
  }

  if (!morphQuery.data) {
    return <StatusBanner tone="error">モルフマスタが見つかりません</StatusBanner>;
  }

  const speciesLabel =
    speciesQuery.data?.find((species) => species.species_id === morphQuery.data?.species_id)?.common_name ||
    speciesQuery.data?.find((species) => species.species_id === morphQuery.data?.species_id)?.japanese_name ||
    morphQuery.data.species_id;

  return (
    <AdminPageLayout>
      <PageHeader
        title={`モルフマスタ / ${morphQuery.data.morph_name}`}
        actions={
          <div className={adminStyles.inlineActions}>
            <button
              className={adminStyles.buttonGhost}
              onClick={() => navigate(`/admin/masters/morphs?speciesId=${currentSpeciesId}`)}
            >
              戻る
            </button>
            <button
              className={adminStyles.button}
              onClick={() => navigate(`/admin/masters/morphs/edit/${speciesId}/${morphId}?speciesId=${currentSpeciesId}`)}
            >
              編集
            </button>
          </div>
        }
      />

      <div className={adminStyles.sectionPlain}>
        <dl className={adminStyles.detailGrid}>
          <div className={adminStyles.detailItem}>
            <dt>種</dt>
            <dd>{speciesLabel}</dd>
          </div>
          <div className={adminStyles.detailItem}>
            <dt>モルフID</dt>
            <dd>{morphQuery.data.morph_id}</dd>
          </div>
          <div className={adminStyles.detailItem}>
            <dt>モルフ名</dt>
            <dd>{morphQuery.data.morph_name}</dd>
          </div>
          <div className={adminStyles.detailItem}>
            <dt>モルフ種別</dt>
            <dd>{morphQuery.data.morph_type === 'COMBO' ? 'コンボ' : 'シングル'}</dd>
          </div>
          {morphQuery.data.morph_type === 'SINGLE' ? (
            <div className={adminStyles.detailItem}>
              <dt>遺伝性区分</dt>
              <dd>{inheritanceCategoryLabels[morphQuery.data.inheritance_category ?? ''] ?? '-'}</dd>
            </div>
          ) : (
            <>
              <div className={adminStyles.detailItem}>
                <dt>表示優先度</dt>
                <dd>{morphQuery.data.display_priority ?? 0}</dd>
              </div>
              <div className={adminStyles.detailItem}>
                <dt>構成モルフ</dt>
                <dd>{(morphQuery.data.components ?? []).map((component) => component.component_morph_name || component.component_morph_id).join(' + ') || '-'}</dd>
              </div>
            </>
          )}
        </dl>
      </div>
    </AdminPageLayout>
  );
};
