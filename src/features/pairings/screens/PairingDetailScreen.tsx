import { useLocation, useNavigate } from 'react-router-dom';
import { AdminPageLayout, PageHeader, StatusBanner, adminStyles } from '../../../shared/ui/admin';
import { formatDateYmd } from '../../../utils/dateFormat';
import { useSpeciesQuery } from '../../species/hooks/useSpeciesQuery';
import { getSpeciesLabel } from '../../species/utils/getSpeciesLabel';
import { usePairingQuery } from '../hooks/usePairingQueries';

type Props = {
  speciesId: string;
  fiscalYear: number;
  pairingId: string;
};

export const PairingDetailScreen = ({ speciesId, fiscalYear, pairingId }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pairingQuery = usePairingQuery(speciesId, fiscalYear, pairingId);
  const speciesQuery = useSpeciesQuery();

  if (pairingQuery.isLoading || speciesQuery.isLoading) {
    return <StatusBanner>読み込み中...</StatusBanner>;
  }

  if (pairingQuery.error) {
    return <StatusBanner tone="error">{pairingQuery.error.message}</StatusBanner>;
  }

  if (speciesQuery.error) {
    return <StatusBanner tone="error">{speciesQuery.error.message}</StatusBanner>;
  }

  if (!pairingQuery.data || !speciesQuery.data) {
    return <StatusBanner tone="error">ペアリング情報が見つかりません</StatusBanner>;
  }

  const pairing = pairingQuery.data;
  const listSearch = location.search;

  return (
    <AdminPageLayout>
      <PageHeader
        title={`ペアリング / ${pairing.pairing_id ?? pairingId}`}
        actions={
          <div className={adminStyles.inlineActions}>
            <button className={adminStyles.buttonGhost} onClick={() => navigate(`/admin/pairings${listSearch}`)}>
              戻る
            </button>
            <button
              className={adminStyles.button}
              onClick={() =>
                navigate(`/admin/pairings/edit/${speciesId}/${fiscalYear}/${pairingId}${listSearch}`)
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
            <dd>{getSpeciesLabel(pairing.species_id, speciesQuery.data)}</dd>
          </div>
          <div className={adminStyles.detailItem}>
            <dt>年度</dt>
            <dd>{pairing.fiscal_year ?? fiscalYear}</dd>
          </div>
          <div className={adminStyles.detailItem}>
            <dt>ID</dt>
            <dd>{pairing.pairing_id ?? pairingId}</dd>
          </div>
          <div className={adminStyles.detailItem}>
            <dt>オス親ID</dt>
            <dd>{pairing.male_parent_id}</dd>
          </div>
          <div className={adminStyles.detailItem}>
            <dt>メス親ID</dt>
            <dd>{pairing.female_parent_id}</dd>
          </div>
          <div className={adminStyles.detailItem}>
            <dt>ペアリング日</dt>
            <dd>{formatDateYmd(pairing.pairing_date)}</dd>
          </div>
          <div className={adminStyles.detailItem}>
            <dt>メモ</dt>
            <dd>{pairing.note || '-'}</dd>
          </div>
        </dl>
      </div>
    </AdminPageLayout>
  );
};
