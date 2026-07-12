import { useNavigate } from 'react-router-dom';
import type { Species } from '../../../api/models/Species';
import { AdminPageLayout, DataTable, PageHeader, StatusBanner, adminStyles } from '../../../shared/ui/admin';
import { useSpeciesQuery } from '../hooks/useSpeciesQuery';

export const SpeciesListScreen = () => {
  const navigate = useNavigate();
  const speciesQuery = useSpeciesQuery();

  if (speciesQuery.isLoading) {
    return <StatusBanner>読み込み中...</StatusBanner>;
  }

  if (speciesQuery.error) {
    return <StatusBanner tone="error">{speciesQuery.error.message}</StatusBanner>;
  }

  return (
    <AdminPageLayout>
      <PageHeader
        title="種マスタ一覧"
        actions={
          <div className={adminStyles.inlineActions}>
            <button className={adminStyles.buttonGhost} onClick={() => navigate('/admin/masters')}>
              戻る
            </button>
            <button className={adminStyles.button} onClick={() => navigate('/admin/masters/species/new')}>
              新規登録
            </button>
          </div>
        }
      />

      <DataTable<Species>
        columns={[
          { key: 'species_id', header: '種コード', renderCell: (species) => species.species_id },
          { key: 'common_name', header: '通称', renderCell: (species) => species.common_name || '-' },
          { key: 'japanese_name', header: '和名', renderCell: (species) => species.japanese_name },
          { key: 'english_name', header: '英名', renderCell: (species) => species.english_name || '-' },
        ]}
        rows={speciesQuery.data ?? []}
        emptyMessage="種マスタはまだありません"
        getRowKey={(species) => species.species_id}
        onRowClick={(species) => navigate(`/admin/masters/species/detail/${species.species_id}`)}
      />
    </AdminPageLayout>
  );
};
