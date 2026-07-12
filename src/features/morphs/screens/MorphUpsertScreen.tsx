import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { MorphMaster } from '../../../api/models/MorphMaster';
import {
  AdminPageLayout,
  FormActions,
  PageHeader,
  StatusBanner,
  adminStyles,
  confirmDeleteByKeyword,
} from '../../../shared/ui/admin';
import { useSpeciesQuery } from '../../species/hooks/useSpeciesQuery';
import {
  useCreateMorphMutation,
  useDeleteMorphMutation,
  useMorphQuery,
  useUpdateMorphMutation,
} from '../hooks/useMorphQueries';

type Props =
  | { mode: 'create' }
  | { mode: 'edit'; speciesId: string; morphId: string };

const inheritanceCategoryOptions = [
  { value: '0', label: '多因性遺伝' },
  { value: '1', label: '劣性遺伝' },
  { value: '2', label: '優勢遺伝' },
  { value: '3', label: '共優勢遺伝' },
];

const emptyMorph: MorphMaster = {
  species_id: '',
  morph_id: '',
  morph_name: '',
  inheritance_category: '0',
};

export const MorphUpsertScreen = (props: Props) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultSpeciesId = searchParams.get('speciesId') ?? '';
  const speciesQuery = useSpeciesQuery();
  const detailQuery = useMorphQuery(
    props.mode === 'edit' ? props.speciesId : undefined,
    props.mode === 'edit' ? props.morphId : undefined
  );
  const createMutation = useCreateMorphMutation();
  const updateMutation = useUpdateMorphMutation();
  const deleteMutation = useDeleteMorphMutation();
  const [form, setForm] = useState<MorphMaster>({ ...emptyMorph, species_id: defaultSpeciesId });

  useEffect(() => {
    if (props.mode === 'edit' && detailQuery.data) {
      setForm(detailQuery.data);
      return;
    }

    if (props.mode === 'create' && !form.species_id && speciesQuery.data?.[0]) {
      setForm((current) => ({ ...current, species_id: speciesQuery.data![0].species_id }));
    }
  }, [detailQuery.data, form.species_id, props.mode, speciesQuery.data]);

  const isSaving = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  const errorMessage =
    speciesQuery.error?.message ||
    detailQuery.error?.message ||
    createMutation.error?.message ||
    updateMutation.error?.message ||
    deleteMutation.error?.message;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: MorphMaster = {
      species_id: form.species_id,
      morph_id: form.morph_id,
      morph_name: form.morph_name.trim(),
      inheritance_category: form.inheritance_category,
    };

    if (props.mode === 'create') {
      const created = await createMutation.mutateAsync({
        species_id: payload.species_id,
        morph_name: payload.morph_name,
        inheritance_category: payload.inheritance_category,
      });
      navigate(`/admin/masters/morphs/detail/${created.species_id}/${created.morph_id}?speciesId=${created.species_id}`);
      return;
    }

    const updated = await updateMutation.mutateAsync({
      speciesId: props.speciesId,
      morphId: props.morphId,
      morph: payload,
    });
    navigate(`/admin/masters/morphs/detail/${updated.species_id}/${updated.morph_id}?speciesId=${updated.species_id}`);
  };

  const handleDelete = async () => {
    if (props.mode !== 'edit') return;
    if (!confirmDeleteByKeyword()) return;
    await deleteMutation.mutateAsync({ speciesId: props.speciesId, morphId: props.morphId });
    navigate(`/admin/masters/morphs?speciesId=${props.speciesId}`);
  };

  if (speciesQuery.isLoading || (props.mode === 'edit' && detailQuery.isLoading)) {
    return <StatusBanner>読み込み中...</StatusBanner>;
  }

  return (
    <AdminPageLayout>
      <PageHeader
        title={props.mode === 'create' ? 'モルフマスタ新規登録' : 'モルフマスタ編集'}
        actions={
          <button
            className={adminStyles.buttonGhost}
            onClick={() =>
              navigate(
                props.mode === 'create'
                  ? `/admin/masters/morphs${form.species_id ? `?speciesId=${form.species_id}` : ''}`
                  : `/admin/masters/morphs/detail/${props.speciesId}/${props.morphId}?speciesId=${props.speciesId}`
              )
            }
          >
            戻る
          </button>
        }
      />

      <form className={adminStyles.stack} onSubmit={handleSubmit}>
        <div className={adminStyles.formGrid}>
          <label className={adminStyles.field}>
            種
            <select
              value={form.species_id}
              disabled={props.mode === 'edit'}
              onChange={(event) => setForm((current) => ({ ...current, species_id: event.target.value }))}
              required
            >
              {speciesQuery.data?.map((species) => (
                <option key={species.species_id} value={species.species_id}>
                  {species.common_name || species.japanese_name}
                </option>
              ))}
            </select>
          </label>

          {props.mode === 'edit' ? (
            <label className={adminStyles.field}>
              モルフID
              <input value={form.morph_id} disabled />
            </label>
          ) : null}

          <label className={adminStyles.field}>
            モルフ名
            <input
              value={form.morph_name}
              onChange={(event) => setForm((current) => ({ ...current, morph_name: event.target.value }))}
              required
            />
          </label>

          <label className={adminStyles.field}>
            遺伝性区分
            <select
              value={form.inheritance_category}
              onChange={(event) =>
                setForm((current) => ({ ...current, inheritance_category: event.target.value }))
              }
              required
            >
              {inheritanceCategoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <FormActions>
          <button className={adminStyles.button} type="submit" disabled={isSaving}>
            {isSaving ? '保存中...' : '保存'}
          </button>
          {props.mode === 'edit' ? (
            <button
              className={adminStyles.buttonDanger}
              type="button"
              onClick={() => void handleDelete()}
              disabled={isSaving}
            >
              削除
            </button>
          ) : null}
        </FormActions>
      </form>

      {errorMessage ? <StatusBanner tone="error">{errorMessage}</StatusBanner> : null}
    </AdminPageLayout>
  );
};
