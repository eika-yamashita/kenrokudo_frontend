import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { BloodlineMaster } from '../../../api/models/BloodlineMaster';
import { AdminPageLayout, DataTable, PageHeader, StatusBanner, adminStyles } from '../../../shared/ui/admin';
import { useMorphSearchQuery } from '../../morphs/hooks/useMorphQueries';
import { useSpeciesQuery } from '../../species/hooks/useSpeciesQuery';
import { useBloodlineSearchQuery } from '../hooks/useBloodlineQueries';

export const BloodlineListScreen = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const speciesQuery = useSpeciesQuery();
  const speciesList = speciesQuery.data ?? [];
  const speciesId = searchParams.get('speciesId') ?? speciesList[0]?.species_id ?? '';
  const morphId = searchParams.get('morphId') ?? '';
  const morphsQuery = useMorphSearchQuery({ speciesId });
  const bloodlinesQuery = useBloodlineSearchQuery({ speciesId, morphId: morphId || undefined });

  const speciesLabelMap = useMemo(
    () => new Map(speciesList.map((species) => [species.species_id, species.common_name || species.japanese_name])),
    [speciesList]
  );
  const morphLabelMap = useMemo(
    () => new Map((morphsQuery.data ?? []).map((morph) => [morph.morph_id, morph.morph_name])),
    [morphsQuery.data]
  );

  if (speciesQuery.isLoading || morphsQuery.isLoading || bloodlinesQuery.isLoading) {
    return <StatusBanner>読み込み中...</StatusBanner>;
  }

  if (speciesQuery.error) {
    return <StatusBanner tone="error">{speciesQuery.error.message}</StatusBanner>;
  }

  if (morphsQuery.error) {
    return <StatusBanner tone="error">{morphsQuery.error.message}</StatusBanner>;
  }

  if (bloodlinesQuery.error) {
    return <StatusBanner tone="error">{bloodlinesQuery.error.message}</StatusBanner>;
  }

  return (
    <AdminPageLayout>
      <PageHeader
        title="血統マスタ一覧"
        actions={
          <div className={adminStyles.inlineActions}>
            <button className={adminStyles.buttonGhost} onClick={() => navigate('/admin/masters')}>
              戻る
            </button>
            <button
              className={adminStyles.button}
              onClick={() =>
                navigate(
                  `/admin/masters/bloodlines/new${speciesId ? `?speciesId=${speciesId}${morphId ? `&morphId=${morphId}` : ''}` : ''}`
                )
              }
            >
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

        <div className={adminStyles.searchField}>
          <select
            aria-label="モルフ"
            value={morphId}
            onChange={(event) =>
              setSearchParams(
                event.target.value
                  ? { speciesId, morphId: event.target.value }
                  : speciesId
                    ? { speciesId }
                    : {}
              )
            }
          >
            <option value="">すべて</option>
            {(morphsQuery.data ?? []).map((morph) => (
              <option key={`${morph.species_id}-${morph.morph_id}`} value={morph.morph_id}>
              {morph.morph_name}
              {` (${morph.morph_type === 'COMBO' ? 'コンボ' : 'シングル'})`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataTable<BloodlineMaster>
        columns={[
          {
            key: 'species_id',
            header: '種',
            renderCell: (bloodline) => speciesLabelMap.get(bloodline.species_id) || bloodline.species_id,
          },
          {
            key: 'morph_id',
            header: 'モルフ',
            renderCell: (bloodline) => morphLabelMap.get(bloodline.morph_id) || bloodline.morph_id,
          },
          { key: 'bloodline_id', header: '血統ID', renderCell: (bloodline) => bloodline.bloodline_id },
          { key: 'bloodline_name', header: '血統名', renderCell: (bloodline) => bloodline.bloodline_name },
        ]}
        rows={bloodlinesQuery.data ?? []}
        emptyMessage="血統マスタはまだありません"
        getRowKey={(bloodline) => `${bloodline.species_id}-${bloodline.morph_id}-${bloodline.bloodline_id}`}
        onRowClick={(bloodline) =>
          navigate(
            `/admin/masters/bloodlines/detail/${bloodline.species_id}/${bloodline.morph_id}/${bloodline.bloodline_id}?speciesId=${speciesId}${morphId ? `&morphId=${morphId}` : ''}`
          )
        }
      />
    </AdminPageLayout>
  );
};
