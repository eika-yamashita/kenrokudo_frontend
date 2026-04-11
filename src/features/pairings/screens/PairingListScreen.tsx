/*
import { useMemo, useState, type FormEvent } from 'react';
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

type ListFilters = {
  speciesId: string;
  fiscalYear: string;
  keyword: string;
};

const createDefaultFilters = (): ListFilters => ({
  speciesId: '',
  fiscalYear: '',
  keyword: '',
});

export const PairingListScreen = () => {
  const navigate = useNavigate();
  const pairingsQuery = usePairingsQuery();
  const speciesQuery = useSpeciesQuery();
  const [draftFilters, setDraftFilters] = useState<ListFilters>(createDefaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<ListFilters>(createDefaultFilters);

  const speciesLabelMap = createSpeciesLabelMap(speciesQuery.data ?? []);
  const yearOptions = useMemo(() => {
    const years = new Set<number>();
    for (const pairing of pairingsQuery.data ?? []) {
      if (pairing.fiscal_year !== undefined && pairing.fiscal_year !== null) {
        years.add(pairing.fiscal_year);
      }
    }
    return Array.from(years).sort((a, b) => b - a);
  }, [pairingsQuery.data]);
  const filteredPairings = useMemo(() => {
    const keyword = appliedFilters.keyword.trim().toLowerCase();

    return (pairingsQuery.data ?? []).filter((pairing) => {
      const matchesSpecies = !appliedFilters.speciesId || pairing.species_id === appliedFilters.speciesId;
      const matchesYear = !appliedFilters.fiscalYear || String(pairing.fiscal_year ?? '') === appliedFilters.fiscalYear;
      const matchesKeyword =
        !keyword ||
        [pairing.pairing_id, pairing.male_parent_id, pairing.female_parent_id, pairing.note].some((value) =>
          String(value ?? '').toLowerCase().includes(keyword)
        );

      return matchesSpecies && matchesYear && matchesKeyword;
    });
  }, [appliedFilters, pairingsQuery.data]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAppliedFilters({
      speciesId: draftFilters.speciesId,
      fiscalYear: draftFilters.fiscalYear,
      keyword: draftFilters.keyword.trim(),
    });
  };

  const handleSearchClear = () => {
    const cleared = createDefaultFilters();
    setDraftFilters(cleared);
    setAppliedFilters(cleared);
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
            <button className={adminStyles.button} onClick={() => navigate('/admin/pairings/new')}>
              新規登録
            </button>
          </div>
        }
      />

      <form className={adminStyles.searchForm} onSubmit={handleSearchSubmit}>
        <label className={adminStyles.field}>
          種
          <select
            value={draftFilters.speciesId}
            onChange={(event) => {
              setDraftFilters((prev) => ({ ...prev, speciesId: event.target.value }));
            }}
          >
            <option value="">すべて</option>
            {(speciesQuery.data ?? []).map((species) => (
              <option key={species.species_id} value={species.species_id}>
                {species.common_name || species.japanese_name}
              </option>
            ))}
          </select>
        </label>

        <label className={adminStyles.field}>
          年度
          <select
            value={draftFilters.fiscalYear}
            onChange={(event) => {
              setDraftFilters((prev) => ({ ...prev, fiscalYear: event.target.value }));
            }}
          >
            <option value="">すべて</option>
            {yearOptions.map((year) => (
              <option key={year} value={String(year)}>
                {year}
              </option>
            ))}
          </select>
        </label>

        <label className={adminStyles.field}>
          フリーワード
          <input
            value={draftFilters.keyword}
            placeholder="ペアリングID・親ID・メモ など"
            onChange={(event) => {
              setDraftFilters((prev) => ({ ...prev, keyword: event.target.value }));
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
        rows={filteredPairings}
        emptyMessage="ペアリング情報はまだありません"
        getRowKey={(pairing) => `${pairing.species_id}-${pairing.fiscal_year}-${pairing.pairing_id}`}
        noWrap
        onRowClick={(pairing) => {
          if (!pairing.fiscal_year || !pairing.pairing_id) return;
          navigate(`/admin/pairings/edit/${pairing.species_id}/${pairing.fiscal_year}/${pairing.pairing_id}`);
        }}
      />
    </AdminPageLayout>
  );
};
*/

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Pairing } from '../../../api/models/Pairing';
import { AdminPageLayout, DataTable, PageHeader, StatusBanner, adminStyles } from '../../../shared/ui/admin';
import { useSpeciesQuery } from '../../species/hooks/useSpeciesQuery';
import { createSpeciesLabelMap } from '../../species/utils/getSpeciesLabel';
import { usePairingSearchQuery } from '../hooks/usePairingQueries';

const DEFAULT_SPECIES_ID = '0001';
const DEFAULT_FISCAL_YEAR = new Date().getFullYear();

type ListFilters = {
  speciesId: string;
  fiscalYear: number;
};

const createDefaultFilters = (): ListFilters => ({
  speciesId: DEFAULT_SPECIES_ID,
  fiscalYear: DEFAULT_FISCAL_YEAR,
});

const createYearOptions = (startYear: number, endYear: number) => {
  const from = Math.min(startYear, endYear);
  const to = Math.max(startYear, endYear);
  return Array.from({ length: to - from + 1 }, (_, index) => to - index);
};

export const PairingListScreen = () => {
  const navigate = useNavigate();
  const speciesQuery = useSpeciesQuery();
  const [draftFilters, setDraftFilters] = useState<ListFilters>(createDefaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<ListFilters>(createDefaultFilters);

  const pairingsQuery = usePairingSearchQuery({
    speciesId: appliedFilters.speciesId,
    fiscalYear: appliedFilters.fiscalYear,
  });

  const speciesLabelMap = useMemo(() => createSpeciesLabelMap(speciesQuery.data ?? []), [speciesQuery.data]);
  const yearOptions = useMemo(() => createYearOptions(2022, DEFAULT_FISCAL_YEAR), []);

  useEffect(() => {
    const speciesList = speciesQuery.data ?? [];
    if (speciesList.length === 0) {
      return;
    }

    const availableSpecies = new Set(speciesList.map((species) => species.species_id));
    const nextSpeciesId = availableSpecies.has(DEFAULT_SPECIES_ID) ? DEFAULT_SPECIES_ID : speciesList[0].species_id;

    setDraftFilters((previous) =>
      previous.speciesId === nextSpeciesId ? previous : { ...previous, speciesId: nextSpeciesId }
    );
    setAppliedFilters((previous) =>
      previous.speciesId === nextSpeciesId ? previous : { ...previous, speciesId: nextSpeciesId }
    );
  }, [speciesQuery.data]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAppliedFilters({
      speciesId: draftFilters.speciesId,
      fiscalYear: draftFilters.fiscalYear,
    });
  };

  const handleSearchClear = () => {
    const cleared = createDefaultFilters();
    setDraftFilters(cleared);
    setAppliedFilters(cleared);
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
            <button className={adminStyles.button} onClick={() => navigate('/admin/pairings/new')}>
              新規登録
            </button>
          </div>
        }
      />

      <form className={adminStyles.searchForm} onSubmit={handleSearchSubmit}>
        <label className={adminStyles.field}>
          種
          <select
            value={draftFilters.speciesId}
            onChange={(event) => {
              setDraftFilters((previous) => ({ ...previous, speciesId: event.target.value }));
            }}
          >
            {(speciesQuery.data ?? []).map((species) => (
              <option key={species.species_id} value={species.species_id}>
                {species.common_name || species.japanese_name}
              </option>
            ))}
          </select>
        </label>

        <label className={adminStyles.field}>
          年度
          <select
            value={String(draftFilters.fiscalYear)}
            onChange={(event) => {
              setDraftFilters((previous) => ({ ...previous, fiscalYear: Number(event.target.value) }));
            }}
          >
            {yearOptions.map((year) => (
              <option key={year} value={String(year)}>
                {year}
              </option>
            ))}
          </select>
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
        noWrap
        onRowClick={(pairing) => {
          if (!pairing.fiscal_year || !pairing.pairing_id) return;
          navigate(`/admin/pairings/edit/${pairing.species_id}/${pairing.fiscal_year}/${pairing.pairing_id}`);
        }}
      />
    </AdminPageLayout>
  );
};
