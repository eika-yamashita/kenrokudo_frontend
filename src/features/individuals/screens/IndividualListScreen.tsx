import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useRef } from 'react';
import type { Individual } from '../../../api/models/Individual';
import { AdminPageLayout, DataTable, PageHeader, StatusBanner, adminStyles } from '../../../shared/ui/admin';
import {
  createSearchString,
  parseBooleanFlagParam,
  parsePositiveIntegerParam,
} from '../../../shared/utils/searchParams';
import { formatGenderCategory } from '../../../utils/genderCategory';
import { useSpeciesQuery } from '../../species/hooks/useSpeciesQuery';
import { IndividualThumbnailCell } from '../components/IndividualThumbnailCell';
import { useIndividualSelection } from '../context/IndividualSelectionContext';
import { useIndividualSearchQuery } from '../hooks/useIndividualQueries';
import { getIndividualMorphDisplay } from '../utils/getIndividualMorphDisplay';
import { downloadIndividualCsv } from '../utils/individualCsv';

const DEFAULT_SPECIES_ID = '0001';
const DEFAULT_FISCAL_YEAR = new Date().getFullYear();

const getIndividualKey = (individual: Pick<Individual, 'species_id' | 'id'>) =>
  `${individual.species_id}\u0000${individual.id}`;

const createYearOptions = (startYear: number, endYear: number) => {
  const from = Math.min(startYear, endYear);
  const to = Math.max(startYear, endYear);
  return Array.from({ length: to - from + 1 }, (_, index) => to - index);
};

const createListSearch = ({
  speciesId,
  fiscalYear,
  morph,
  detailOpen,
}: {
  speciesId: string;
  fiscalYear: number;
  morph?: string;
  detailOpen?: boolean;
}) =>
  createSearchString({
    speciesId,
    fiscalYear,
    morph: morph?.trim() || undefined,
    detail: detailOpen ? true : undefined,
  });

const getSuccessMessage = (state: unknown) => {
  if (!state || typeof state !== 'object') {
    return '';
  }

  const candidate = (state as { successMessage?: unknown }).successMessage;
  return typeof candidate === 'string' ? candidate : '';
};

export const IndividualListScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const speciesQuery = useSpeciesQuery();
  const requestedSpeciesId = searchParams.get('speciesId')?.trim() ?? '';
  const requestedFiscalYear = parsePositiveIntegerParam(searchParams.get('fiscalYear'), DEFAULT_FISCAL_YEAR);
  const appliedMorph = searchParams.get('morph')?.trim() ?? '';
  const requestedDetailOpen = parseBooleanFlagParam(searchParams.get('detail'));
  const [draftMorph, setDraftMorph] = useState(appliedMorph);
  const [successMessage] = useState(() => getSuccessMessage(location.state));
  const { selectedKeys, setSelectedKeys, setSelectionScope } = useIndividualSelection();
  const [exportError, setExportError] = useState('');
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  const speciesList = speciesQuery.data ?? [];
  const defaultSpeciesId =
    speciesList.find((species) => species.species_id === DEFAULT_SPECIES_ID)?.species_id ?? speciesList[0]?.species_id;
  const matchedSpeciesId = speciesList.find((species) => species.species_id === requestedSpeciesId)?.species_id;
  const effectiveSpeciesId = matchedSpeciesId || requestedSpeciesId || defaultSpeciesId || DEFAULT_SPECIES_ID;
  const isDetailSearchOpen = requestedDetailOpen || appliedMorph.length > 0;
  const selectionScope = `${effectiveSpeciesId}\u0000${requestedFiscalYear}\u0000${appliedMorph}`;

  const individualsQuery = useIndividualSearchQuery({
    speciesId: effectiveSpeciesId,
    fiscalYear: requestedFiscalYear,
    morph: appliedMorph || undefined,
  });
  const individuals = individualsQuery.data ?? [];
  const selectedIndividuals = individuals.filter((individual) => selectedKeys.has(getIndividualKey(individual)));
  const allSelected = individuals.length > 0 && selectedIndividuals.length === individuals.length;
  const partiallySelected = selectedIndividuals.length > 0 && !allSelected;

  const yearOptions = useMemo(() => createYearOptions(2022, DEFAULT_FISCAL_YEAR), []);
  const currentSearch = createListSearch({
    speciesId: effectiveSpeciesId,
    fiscalYear: requestedFiscalYear,
    morph: appliedMorph,
    detailOpen: isDetailSearchOpen,
  });

  useEffect(() => {
    setDraftMorph(appliedMorph);
  }, [appliedMorph]);

  useEffect(() => {
    setSelectionScope(selectionScope);
    setExportError('');
  }, [selectionScope, setSelectionScope]);

  useEffect(() => {
    if (!individualsQuery.data) {
      return;
    }

    const availableKeys = new Set(individualsQuery.data.map(getIndividualKey));
    setSelectedKeys((current) => {
      const next = new Set([...current].filter((key) => availableKeys.has(key)));
      return next.size === current.size ? current : next;
    });
  }, [individualsQuery.data, setSelectedKeys]);

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = partiallySelected;
    }
  }, [partiallySelected]);

  useEffect(() => {
    if (!speciesQuery.data || currentSearch === location.search) {
      return;
    }

    setSearchParams(currentSearch, { replace: true });
  }, [currentSearch, location.search, setSearchParams, speciesQuery.data]);

  useEffect(() => {
    if (!getSuccessMessage(location.state)) {
      return;
    }

    navigate(`${location.pathname}${location.search}`, { replace: true, state: null });
  }, [location.pathname, location.search, location.state, navigate]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchParams(
      createListSearch({
        speciesId: effectiveSpeciesId,
        fiscalYear: requestedFiscalYear,
        morph: draftMorph,
        detailOpen: true,
      })
    );
  };

  const handleSearchClear = () => {
    setDraftMorph('');
    setSearchParams(
      createListSearch({
        speciesId: effectiveSpeciesId,
        fiscalYear: requestedFiscalYear,
      })
    );
  };

  const handleExport = () => {
    try {
      downloadIndividualCsv(selectedIndividuals);
      setExportError('');
    } catch {
      setExportError('CSVファイルの出力に失敗しました');
    }
  };

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
            <button
              className={adminStyles.buttonGhost}
              type="button"
              disabled={selectedIndividuals.length === 0}
              onClick={handleExport}
            >
              CSV出力（{selectedIndividuals.length}件）
            </button>
            <button className={adminStyles.button} onClick={() => navigate(`/admin/individuals/new${currentSearch}`)}>
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
                  morph: appliedMorph,
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
                  morph: appliedMorph,
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
                  morph: appliedMorph,
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
        <form className={adminStyles.searchDetailPanel} onSubmit={handleSearchSubmit}>
          <label className={adminStyles.field}>
            モルフ
            <input
              aria-label="モルフ"
              value={draftMorph}
              placeholder="モルフ名で検索"
              onChange={(event) => {
                setDraftMorph(event.target.value);
              }}
            />
          </label>

          <div className={adminStyles.searchActions}>
            <button className={adminStyles.button} type="submit">
              検索
            </button>
            <button className={adminStyles.buttonGhost} type="button" onClick={handleSearchClear}>
              クリア
            </button>
          </div>
        </form>
      ) : null}

      {successMessage ? <StatusBanner>{successMessage}</StatusBanner> : null}
      {exportError ? <StatusBanner tone="error">{exportError}</StatusBanner> : null}

      <DataTable<Individual>
        columns={[
          {
            key: 'selection',
            header: (
              <input
                ref={selectAllCheckboxRef}
                type="checkbox"
                aria-label="表示中の個体をすべて選択"
                checked={allSelected}
                disabled={individuals.length === 0}
                onChange={(event) => {
                  setSelectedKeys(event.target.checked ? new Set(individuals.map(getIndividualKey)) : new Set());
                }}
              />
            ),
            className: adminStyles.tableSelectionCell,
            suppressRowClick: true,
            renderCell: (individual) => {
              const key = getIndividualKey(individual);
              return (
                <input
                  type="checkbox"
                  aria-label={`${individual.id}を選択`}
                  checked={selectedKeys.has(key)}
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => event.stopPropagation()}
                  onChange={(event) => {
                    setSelectedKeys((current) => {
                      const next = new Set(current);
                      if (event.target.checked) {
                        next.add(key);
                      } else {
                        next.delete(key);
                      }
                      return next;
                    });
                  }}
                />
              );
            },
          },
          {
            key: 'image',
            header: '',
            className: adminStyles.tableImageCell,
            renderCell: (individual) => (
              <IndividualThumbnailCell speciesId={individual.species_id} id={individual.id} density="compact" />
            ),
          },
          { key: 'id', header: '個体ID', renderCell: (individual) => individual.id },
          { key: 'morph', header: 'モルフ', renderCell: (individual) => getIndividualMorphDisplay(individual) || '-' },
          {
            key: 'gender',
            header: '性別',
            renderCell: (individual) => formatGenderCategory(individual.gender_category),
          },
          {
            key: 'amount',
            header: '金額',
            renderCell: (individual) =>
              individual.sales_price_tax_in === undefined || individual.sales_price_tax_in === null
                ? '-'
                : individual.sales_price_tax_in.toLocaleString('ja-JP'),
          },
        ]}
        rows={individuals}
        emptyMessage="個体情報はまだありません"
        getRowKey={(individual) => `${individual.species_id}-${individual.id}`}
        onRowClick={(individual) =>
          navigate(`/admin/individuals/detail/${individual.species_id}/${individual.id}${currentSearch}`)
        }
        density="compact"
        noWrap
        fitContent
      />
    </AdminPageLayout>
  );
};
