import { useNavigate, useSearchParams } from 'react-router-dom';
import { AdminPageLayout, PageHeader, StatusBanner, adminStyles } from '../../../shared/ui/admin';
import { useMorphSearchQuery } from '../../morphs/hooks/useMorphQueries';
import { useSpeciesQuery } from '../../species/hooks/useSpeciesQuery';
import { useBloodlineQuery } from '../hooks/useBloodlineQueries';

type Props = {
  speciesId: string;
  morphId: string;
  bloodlineId: string;
};

export const BloodlineDetailScreen = ({ speciesId, morphId, bloodlineId }: Props) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentSpeciesId = searchParams.get('speciesId') ?? speciesId;
  const currentMorphId = searchParams.get('morphId') ?? morphId;
  const bloodlineQuery = useBloodlineQuery(speciesId, morphId, bloodlineId);
  const speciesQuery = useSpeciesQuery();
  const morphsQuery = useMorphSearchQuery({ speciesId });

  if (bloodlineQuery.isLoading || speciesQuery.isLoading || morphsQuery.isLoading) {
    return <StatusBanner>読み込み中...</StatusBanner>;
  }

  if (bloodlineQuery.error) {
    return <StatusBanner tone="error">{bloodlineQuery.error.message}</StatusBanner>;
  }

  if (speciesQuery.error) {
    return <StatusBanner tone="error">{speciesQuery.error.message}</StatusBanner>;
  }

  if (morphsQuery.error) {
    return <StatusBanner tone="error">{morphsQuery.error.message}</StatusBanner>;
  }

  if (!bloodlineQuery.data) {
    return <StatusBanner tone="error">血統マスタが見つかりません</StatusBanner>;
  }

  const speciesLabel =
    speciesQuery.data?.find((species) => species.species_id === speciesId)?.common_name ||
    speciesQuery.data?.find((species) => species.species_id === speciesId)?.japanese_name ||
    speciesId;
  const morphLabel = morphsQuery.data?.find((morph) => morph.morph_id === morphId)?.morph_name || morphId;

  return (
    <AdminPageLayout>
      <PageHeader
        title={`血統マスタ / ${bloodlineQuery.data.bloodline_id}`}
        actions={
          <div className={adminStyles.inlineActions}>
            <button
              className={adminStyles.buttonGhost}
              onClick={() =>
                navigate(`/admin/masters/bloodlines?speciesId=${currentSpeciesId}${currentMorphId ? `&morphId=${currentMorphId}` : ''}`)
              }
            >
              戻る
            </button>
            <button
              className={adminStyles.button}
              onClick={() =>
                navigate(
                  `/admin/masters/bloodlines/edit/${speciesId}/${morphId}/${bloodlineId}?speciesId=${currentSpeciesId}${currentMorphId ? `&morphId=${currentMorphId}` : ''}`
                )
              }
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
            <dt>モルフ</dt>
            <dd>{morphLabel}</dd>
          </div>
          <div className={adminStyles.detailItem}>
            <dt>血統ID</dt>
            <dd>{bloodlineQuery.data.bloodline_id}</dd>
          </div>
          <div className={adminStyles.detailItem}>
            <dt>血統名</dt>
            <dd>{bloodlineQuery.data.bloodline_name}</dd>
          </div>
        </dl>
      </div>
    </AdminPageLayout>
  );
};
