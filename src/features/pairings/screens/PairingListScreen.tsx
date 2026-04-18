import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import type { Pairing } from '../../../api/models/Pairing';
import { AdminPageLayout, DataTable, PageHeader, StatusBanner, adminStyles } from '../../../shared/ui/admin';
import {
  createSearchString,
  parseBooleanFlagParam,
  parsePositiveIntegerParam,
} from '../../../shared/utils/searchParams';
import { useSpeciesQuery } from '../../species/hooks/useSpeciesQuery';
import { usePairingSearchQuery } from '../hooks/usePairingQueries';

const DEFAULT_SPECIES_ID = '0001';
const DEFAULT_FISCAL_YEAR = new Date().getFullYear();

const createYearOptions = (startYear: number, endYear: number) => {
  const from = Math.min(startYear, endYear);
  const to = Math.max(startYear, endYear);
  return Array.from({ length: to - from + 1 }, (_, index) => to - index);
};

const createListSearch = ({
  speciesId,
  fiscalYear,
  detailOpen,
}: {
  speciesId: string;
  fiscalYear: number;
  detailOpen?: boolean;
}) =>
  createSearchString({
    speciesId,
    fiscalYear,
    detail: detailOpen ? true : undefined,
  });

export const PairingListScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const speciesQuery = useSpeciesQuery();
  const requestedSpeciesId = searchParams.get('speciesId')?.trim() ?? '';
  const requestedFiscalYear = parsePositiveIntegerParam(searchParams.get('fiscalYear'), DEFAULT_FISCAL_YEAR);
  const isDetailSearchOpen = parseBooleanFlagParam(searchParams.get('detail'));

  const speciesList = speciesQuery.data ?? [];
  const defaultSpeciesId =
    speciesList.find((species) => species.species_id === DEFAULT_SPECIES_ID)?.species_id ?? speciesList[0]?.species_id;
  const matchedSpeciesId = speciesList.find((species) => species.species_id === requestedSpeciesId)?.species_id;
  const effectiveSpeciesId = matchedSpeciesId || requestedSpeciesId || defaultSpeciesId || DEFAULT_SPECIES_ID;

  const pairingsQuery = usePairingSearchQuery({
    speciesId: effectiveSpeciesId,
    fiscalYear: requestedFiscalYear,
  });

  const yearOptions = useMemo(() => createYearOptions(2022, DEFAULT_FISCAL_YEAR), []);
  const currentSearch = createListSearch({
    speciesId: effectiveSpeciesId,
    fiscalYear: requestedFiscalYear,
    detailOpen: isDetailSearchOpen,
  });

  useEffect(() => {
    if (!speciesQuery.data || currentSearch === location.search) {
      return;
    }

    setSearchParams(currentSearch, { replace: true });
  }, [currentSearch, location.search, setSearchParams, speciesQuery.data]);

  const handleSearchClear = () => {
    setSearchParams(
      createListSearch({
        speciesId: effectiveSpeciesId,
        fiscalYear: requestedFiscalYear,
      })
    );
  };

  if (pairingsQuery.isLoading || speciesQuery.isLoading) {
    return <StatusBanner>読み込み中...</StatusBanner>;
  }

  if (pairingsQuery.error) {
    return <StatusBanner tone="error">{pairingsQuery.error.message}</StatusBanner>;
  }

  if (speciesQuery.error) {
    return <StatusBanner tone="error">{speciesQuery.error.message}</StatusBanner>;
  }

  return (
    <AdminPageLayout>
      <PageHeader
        title="ペアリング一覧"
        actions={
          <div className={adminStyles.inlineActions}>
            <button className={adminStyles.button} onClick={() => navigate(`/admin/pairings/new${currentSearch}`)}>
              新規登録
            </button>
          </div>
        }
      />

      <div className={adminStyles.searchToolbar}>
        <div className={adminStyles.searchField}>
          <select
            aria-label="種名"
            value={effectiveSpeciesId}
            onChange={(event) => {
              setSearchParams(
                createListSearch({
                  speciesId: event.target.value,
                  fiscalYear: requestedFiscalYear,
                  detailOpen: isDetailSearchOpen,
                })
              );
            }}
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
            aria-label="年度"
            value={String(requestedFiscalYear)}
            onChange={(event) => {
              setSearchParams(
                createListSearch({
                  speciesId: effectiveSpeciesId,
                  fiscalYear: Number(event.target.value),
                  detailOpen: isDetailSearchOpen,
                })
              );
            }}
          >
            {yearOptions.map((year) => (
              <option key={year} value={String(year)}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className={adminStyles.searchToolbarActions}>
          <button
            className={adminStyles.searchIconButton}
            type="button"
            aria-label={isDetailSearchOpen ? '詳細検索を閉じる' : '詳細検索を開く'}
            title={isDetailSearchOpen ? '詳細検索を閉じる' : '詳細検索を開く'}
            onClick={() => {
              setSearchParams(
                createListSearch({
                  speciesId: effectiveSpeciesId,
                  fiscalYear: requestedFiscalYear,
                  detailOpen: !isDetailSearchOpen,
                })
              );
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M4 6h16l-6 7v5l-4 2v-7L4 6Z"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
            </svg>
          </button>
        </div>
      </div>

      {isDetailSearchOpen ? (
        <div className={adminStyles.searchDetailPanel}>
          <p className={adminStyles.searchDetailText}>現在利用できる詳細検索条件はありません。</p>
          <div className={adminStyles.searchActions}>
            <button className={adminStyles.buttonGhost} type="button" onClick={handleSearchClear}>
              クリア
            </button>
          </div>
        </div>
      ) : null}

      <DataTable<Pairing>
        columns={[
          { key: 'pairing_id', header: 'ペアリングID', renderCell: (pairing) => pairing.pairing_id ?? '-' },
          { key: 'male_parent_id', header: 'オス親ID', renderCell: (pairing) => pairing.male_parent_id },
          { key: 'female_parent_id', header: 'メス親ID', renderCell: (pairing) => pairing.female_parent_id },
          { key: 'pairing_date', header: 'ペアリング日', renderCell: (pairing) => pairing.pairing_date },
          { key: 'note', header: 'メモ', renderCell: (pairing) => pairing.note || '-' },
        ]}
        rows={pairingsQuery.data ?? []}
        emptyMessage="ペアリング情報はまだありません"
        getRowKey={(pairing) => `${pairing.species_id}-${pairing.fiscal_year}-${pairing.pairing_id}`}
        noWrap
        onRowClick={(pairing) => {
          if (!pairing.fiscal_year || !pairing.pairing_id) return;
          navigate(`/admin/pairings/edit/${pairing.species_id}/${pairing.fiscal_year}/${pairing.pairing_id}${currentSearch}`);
        }}
      />
    </AdminPageLayout>
  );
};
