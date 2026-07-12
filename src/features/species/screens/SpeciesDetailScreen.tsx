import { useNavigate } from 'react-router-dom';
import { AdminPageLayout, PageHeader, StatusBanner, adminStyles } from '../../../shared/ui/admin';
import { useSpeciesDetailQuery } from '../hooks/useSpeciesQuery';

type Props = {
  speciesId: string;
};

export const SpeciesDetailScreen = ({ speciesId }: Props) => {
  const navigate = useNavigate();
  const speciesQuery = useSpeciesDetailQuery(speciesId);

  if (speciesQuery.isLoading) {
    return <StatusBanner>読み込み中...</StatusBanner>;
  }

  if (speciesQuery.error) {
    return <StatusBanner tone="error">{speciesQuery.error.message}</StatusBanner>;
  }

  if (!speciesQuery.data) {
    return <StatusBanner tone="error">種マスタが見つかりません</StatusBanner>;
  }

  const species = speciesQuery.data;

  return (
    <AdminPageLayout>
      <PageHeader
        title={`種マスタ / ${species.species_id}`}
        actions={
          <div className={adminStyles.inlineActions}>
            <button className={adminStyles.buttonGhost} onClick={() => navigate('/admin/masters/species')}>
              戻る
            </button>
            <button
              className={adminStyles.button}
              onClick={() => navigate(`/admin/masters/species/edit/${species.species_id}`)}
            >
              編集
            </button>
          </div>
        }
      />

      <div className={adminStyles.sectionPlain}>
        <dl className={adminStyles.detailGrid}>
          <div className={adminStyles.detailItem}>
            <dt>種コード</dt>
            <dd>{species.species_id}</dd>
          </div>
          <div className={adminStyles.detailItem}>
            <dt>和名</dt>
            <dd>{species.japanese_name}</dd>
          </div>
          <div className={adminStyles.detailItem}>
            <dt>通称</dt>
            <dd>{species.common_name || '-'}</dd>
          </div>
          <div className={adminStyles.detailItem}>
            <dt>英名</dt>
            <dd>{species.english_name || '-'}</dd>
          </div>
          <div className={adminStyles.detailItem}>
            <dt>全長</dt>
            <dd>{species.total_length || '-'}</dd>
          </div>
          <div className={adminStyles.detailItem}>
            <dt>体重</dt>
            <dd>{species.body_weight || '-'}</dd>
          </div>
          <div className={adminStyles.detailItem}>
            <dt>寿命</dt>
            <dd>{species.lifespan || '-'}</dd>
          </div>
        </dl>
      </div>
    </AdminPageLayout>
  );
};
