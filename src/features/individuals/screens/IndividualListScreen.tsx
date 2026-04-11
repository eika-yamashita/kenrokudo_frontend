/*
import { useMemo, useState, type FormEvent } from 'react';
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

export const IndividualListScreen = () => {
  const navigate = useNavigate();
  const individualsQuery = useIndividualsQuery();
  const speciesQuery = useSpeciesQuery();
  const [draftFilters, setDraftFilters] = useState<ListFilters>(createDefaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<ListFilters>(createDefaultFilters);
  const speciesLabelMap = useMemo(() => createSpeciesLabelMap(speciesQuery.data ?? []), [speciesQuery.data]);
  const yearOptions = useMemo(() => {
    const years = new Set<number>();
    for (const individual of individualsQuery.data ?? []) {
      if (individual.pairing_fiscal_year !== undefined && individual.pairing_fiscal_year !== null) {
        years.add(individual.pairing_fiscal_year);
      }
    }
    return Array.from(years).sort((a, b) => b - a);
  }, [individualsQuery.data]);
  const filteredIndividuals = useMemo(() => {
    const keyword = appliedFilters.keyword.trim().toLowerCase();

    return (individualsQuery.data ?? []).filter((individual) => {
      const matchesSpecies = !appliedFilters.speciesId || individual.species_id === appliedFilters.speciesId;
      const matchesYear =
        !appliedFilters.fiscalYear || String(individual.pairing_fiscal_year ?? '') === appliedFilters.fiscalYear;
      const matchesKeyword =
        !keyword ||
        [
          individual.id,
          individual.morph,
          individual.bloodline,
          individual.male_parent_id,
          individual.female_parent_id,
          individual.note,
        ].some((value) => String(value ?? '').toLowerCase().includes(keyword));

      return matchesSpecies && matchesYear && matchesKeyword;
    });
  }, [appliedFilters, individualsQuery.data]);

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
            <button className={adminStyles.button} onClick={() => navigate('/admin/individuals/new')}>
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
            placeholder="個体ID・モルフ・メモ など"
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
        rows={filteredIndividuals}
        emptyMessage="個体情報はまだありません"
        getRowKey={(individual) => `${individual.species_id}-${individual.id}`}
        onRowClick={(individual) => navigate(`/admin/individuals/detail/${individual.species_id}/${individual.id}`)}
        density="compact"
      />
    </AdminPageLayout>
  );
};
*/

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Individual } from '../../../api/models/Individual';
import { AdminPageLayout, DataTable, PageHeader, StatusBanner, adminStyles } from '../../../shared/ui/admin';
import { formatGenderCategory } from '../../../utils/genderCategory';
import { useSpeciesQuery } from '../../species/hooks/useSpeciesQuery';
import { createSpeciesLabelMap } from '../../species/utils/getSpeciesLabel';
import { IndividualThumbnailCell } from '../components/IndividualThumbnailCell';
import { useIndividualSearchQuery } from '../hooks/useIndividualQueries';

const DEFAULT_SPECIES_ID = '0001';
const DEFAULT_FISCAL_YEAR = new Date().getFullYear();

type ListFilters = {
  speciesId: string;
  fiscalYear: number;
  morph: string;
};

const createDefaultFilters = (): ListFilters => ({
  speciesId: DEFAULT_SPECIES_ID,
  fiscalYear: DEFAULT_FISCAL_YEAR,
  morph: '',
});

const createYearOptions = (startYear: number, endYear: number) => {
  const from = Math.min(startYear, endYear);
  const to = Math.max(startYear, endYear);
  return Array.from({ length: to - from + 1 }, (_, index) => to - index);
};

export const IndividualListScreen = () => {
  const navigate = useNavigate();
  const speciesQuery = useSpeciesQuery();
  const [draftFilters, setDraftFilters] = useState<ListFilters>(createDefaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<ListFilters>(createDefaultFilters);

  const individualsQuery = useIndividualSearchQuery({
    speciesId: appliedFilters.speciesId,
    fiscalYear: appliedFilters.fiscalYear,
    morph: appliedFilters.morph.trim() || undefined,
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
      morph: draftFilters.morph.trim(),
    });
  };

  const handleSearchClear = () => {
    const cleared = createDefaultFilters();
    setDraftFilters(cleared);
    setAppliedFilters(cleared);
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
            <button className={adminStyles.button} onClick={() => navigate('/admin/individuals/new')}>
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

        <label className={adminStyles.field}>
          モルフ
          <input
            value={draftFilters.morph}
            placeholder="モルフ名で検索"
            onChange={(event) => {
              setDraftFilters((previous) => ({ ...previous, morph: event.target.value }));
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
            header: '性別',
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
