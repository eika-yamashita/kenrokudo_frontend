import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Individual } from '../../../api/models/Individual';
import {
  AdminPageLayout,
  DataTable,
  PageHeader,
  StatusBanner,
  adminStyles,
} from '../../../shared/ui/admin';
import { formatGenderCategory } from '../../../utils/genderCategory';
import { useSpeciesQuery } from '../../species/hooks/useSpeciesQuery';
import { createSpeciesLabelMap } from '../../species/utils/getSpeciesLabel';
import { IndividualThumbnailCell } from '../components/IndividualThumbnailCell';
import { useIndividualsQuery } from '../hooks/useIndividualQueries';

export const IndividualListScreen = () => {
  const navigate = useNavigate();
  const individualsQuery = useIndividualsQuery();
  const speciesQuery = useSpeciesQuery();
  const speciesLabelMap = useMemo(() => createSpeciesLabelMap(speciesQuery.data ?? []), [speciesQuery.data]);

  if (individualsQuery.isLoading || speciesQuery.isLoading) {
    return <StatusBanner>読み込み中...</StatusBanner>;
  }

  if (individualsQuery.error) {
    return <StatusBanner tone="error">{individualsQuery.error.message}</StatusBanner>;
  }

  if (speciesQuery.error) {
    return <StatusBanner tone="error">{speciesQuery.error.message}</StatusBanner>;
  }

  return (
    <AdminPageLayout>
      <PageHeader
        title="個体一覧"
        actions={
          <div className={adminStyles.inlineActions}>
            <button className={adminStyles.buttonGhost} onClick={() => navigate('/admin')}>
              管理メニューへ戻る
            </button>
            <button className={adminStyles.button} onClick={() => navigate('/admin/individuals/new')}>
              新規登録
            </button>
          </div>
        }
      />

      <DataTable<Individual>
        columns={[
          {
            key: 'image',
            header: '画像',
            renderCell: (individual) => (
              <IndividualThumbnailCell speciesId={individual.species_id} id={individual.id} density="compact" />
            ),
          },
          {
            key: 'species',
            header: '種名',
            renderCell: (individual) => speciesLabelMap[individual.species_id] ?? individual.species_id,
          },
          { key: 'id', header: '個体ID', renderCell: (individual) => individual.id },
          { key: 'morph', header: 'モルフ', renderCell: (individual) => individual.morph ?? '-' },
          {
            key: 'gender',
            header: '雌雄区分',
            renderCell: (individual) => formatGenderCategory(individual.gender_category),
          },
        ]}
        rows={individualsQuery.data ?? []}
        emptyMessage="個体情報はまだありません"
        getRowKey={(individual) => `${individual.species_id}-${individual.id}`}
        onRowClick={(individual) => navigate(`/admin/individuals/detail/${individual.species_id}/${individual.id}`)}
        density="compact"
      />
    </AdminPageLayout>
  );
};
