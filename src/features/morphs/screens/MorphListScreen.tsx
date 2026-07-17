import { useNavigate, useSearchParams } from 'react-router-dom';
import type { MorphMaster } from '../../../api/models/MorphMaster';
import { AdminPageLayout, DataTable, PageHeader, StatusBanner, adminStyles } from '../../../shared/ui/admin';
import { useSpeciesQuery } from '../../species/hooks/useSpeciesQuery';
import { useMorphSearchQuery } from '../hooks/useMorphQueries';

export const MorphListScreen = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const speciesQuery = useSpeciesQuery();
  const speciesList = speciesQuery.data ?? [];
  const speciesId = searchParams.get('speciesId') ?? speciesList[0]?.species_id ?? '';
  const morphsQuery = useMorphSearchQuery({ speciesId });

  if (speciesQuery.isLoading || morphsQuery.isLoading) {
    return <StatusBanner>読み込み中...</StatusBanner>;
  }

  if (speciesQuery.error) {
    return <StatusBanner tone="error">{speciesQuery.error.message}</StatusBanner>;
  }

  if (morphsQuery.error) {
    return <StatusBanner tone="error">{morphsQuery.error.message}</StatusBanner>;
  }

  return (
    <AdminPageLayout>
      <PageHeader
        title="モルフマスタ一覧"
        actions={
          <div className={adminStyles.inlineActions}>
            <button className={adminStyles.buttonGhost} onClick={() => navigate('/admin/masters')}>
              戻る
            </button>
            <button className={adminStyles.button} onClick={() => navigate(`/admin/masters/morphs/new?speciesId=${speciesId}`)}>
              新規登録
            </button>
          </div>
        }
      />

      <div className={adminStyles.searchToolbar}>
        <div className={adminStyles.searchField}>
          <select
            aria-label="種名"
            value={speciesId}
            onChange={(event) => setSearchParams(event.target.value ? { speciesId: event.target.value } : {})}
          >
            {speciesList.map((species) => (
              <option key={species.species_id} value={species.species_id}>
                {species.common_name || species.japanese_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataTable<MorphMaster>
        columns={[
          { key: 'morph_id', header: 'モルフID', renderCell: (morph) => morph.morph_id },
          { key: 'morph_name', header: 'モルフ名', renderCell: (morph) => morph.morph_name },
          { key: 'morph_type', header: '種別', renderCell: (morph) => morph.morph_type === 'COMBO' ? 'コンボ' : 'シングル' },
        ]}
        rows={morphsQuery.data ?? []}
        emptyMessage="モルフマスタはまだありません"
        getRowKey={(morph) => `${morph.species_id}-${morph.morph_id}`}
        onRowClick={(morph) => navigate(`/admin/masters/morphs/detail/${morph.species_id}/${morph.morph_id}?speciesId=${speciesId}`)}
      />
    </AdminPageLayout>
  );
};
