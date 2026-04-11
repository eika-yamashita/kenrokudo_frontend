import { useNavigate } from 'react-router-dom';
import type { Pairing } from '../../../api/models/Pairing';
import {
  AdminPageLayout,
  DataTable,
  PageHeader,
  StatusBanner,
  adminStyles,
} from '../../../shared/ui/admin';
import { useSpeciesQuery } from '../../species/hooks/useSpeciesQuery';
import { createSpeciesLabelMap } from '../../species/utils/getSpeciesLabel';
import { usePairingsQuery } from '../hooks/usePairingQueries';

export const PairingListScreen = () => {
  const navigate = useNavigate();
  const pairingsQuery = usePairingsQuery();
  const speciesQuery = useSpeciesQuery();

  if (pairingsQuery.isLoading || speciesQuery.isLoading) {
    return <StatusBanner>読み込み中...</StatusBanner>;
  }

  if (pairingsQuery.error) {
    return <StatusBanner tone="error">{pairingsQuery.error.message}</StatusBanner>;
  }

  if (speciesQuery.error) {
    return <StatusBanner tone="error">{speciesQuery.error.message}</StatusBanner>;
  }

  const speciesLabelMap = createSpeciesLabelMap(speciesQuery.data ?? []);

  return (
    <AdminPageLayout>
      <PageHeader
        title="ペアリング一覧"
        actions={
          <div className={adminStyles.inlineActions}>
            <button className={adminStyles.button} onClick={() => navigate('/admin/pairings/new')}>
              新規登録
            </button>
          </div>
        }
      />

      <DataTable<Pairing>
        columns={[
          {
            key: 'species_name',
            header: '種名',
            renderCell: (pairing) => speciesLabelMap[pairing.species_id] ?? pairing.species_id,
          },
          { key: 'species_id', header: '種ID', renderCell: (pairing) => pairing.species_id },
          { key: 'fiscal_year', header: '年度', renderCell: (pairing) => pairing.fiscal_year ?? '-' },
          { key: 'pairing_id', header: 'ペアリングID', renderCell: (pairing) => pairing.pairing_id ?? '-' },
          { key: 'male_parent_id', header: 'オス親ID', renderCell: (pairing) => pairing.male_parent_id },
          { key: 'female_parent_id', header: 'メス親ID', renderCell: (pairing) => pairing.female_parent_id },
          { key: 'pairing_date', header: 'ペアリング日', renderCell: (pairing) => pairing.pairing_date },
          { key: 'note', header: 'メモ', renderCell: (pairing) => pairing.note || '-' },
        ]}
        rows={pairingsQuery.data ?? []}
        emptyMessage="ペアリング情報はまだありません"
        getRowKey={(pairing) => `${pairing.species_id}-${pairing.fiscal_year}-${pairing.pairing_id}`}
        onRowClick={(pairing) => {
          if (!pairing.fiscal_year || !pairing.pairing_id) return;
          navigate(`/admin/pairings/edit/${pairing.species_id}/${pairing.fiscal_year}/${pairing.pairing_id}`);
        }}
      />
    </AdminPageLayout>
  );
};
