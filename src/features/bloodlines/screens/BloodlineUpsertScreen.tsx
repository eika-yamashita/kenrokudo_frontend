import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { BloodlineMaster } from '../../../api/models/BloodlineMaster';
import {
  AdminPageLayout,
  FormActions,
  PageHeader,
  StatusBanner,
  adminStyles,
  confirmDeleteByKeyword,
} from '../../../shared/ui/admin';
import { useMorphSearchQuery } from '../../morphs/hooks/useMorphQueries';
import { useSpeciesQuery } from '../../species/hooks/useSpeciesQuery';
import {
  useBloodlineQuery,
  useCreateBloodlineMutation,
  useDeleteBloodlineMutation,
  useUpdateBloodlineMutation,
} from '../hooks/useBloodlineQueries';

type Props =
  | { mode: 'create' }
  | { mode: 'edit'; speciesId: string; morphId: string; bloodlineId: string };

const emptyBloodline: BloodlineMaster = {
  species_id: '',
  morph_id: '',
  bloodline_id: '',
  bloodline_name: '',
};

export const BloodlineUpsertScreen = (props: Props) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultSpeciesId = searchParams.get('speciesId') ?? '';
  const defaultMorphId = searchParams.get('morphId') ?? '';
  const speciesQuery = useSpeciesQuery();
  const detailQuery = useBloodlineQuery(
    props.mode === 'edit' ? props.speciesId : undefined,
    props.mode === 'edit' ? props.morphId : undefined,
    props.mode === 'edit' ? props.bloodlineId : undefined
  );
  const createMutation = useCreateBloodlineMutation();
  const updateMutation = useUpdateBloodlineMutation();
  const deleteMutation = useDeleteBloodlineMutation();
  const [form, setForm] = useState<BloodlineMaster>({
    ...emptyBloodline,
    species_id: defaultSpeciesId,
    morph_id: defaultMorphId,
  });
  const morphsQuery = useMorphSearchQuery({
    speciesId: props.mode === 'edit' ? props.speciesId : form.species_id,
  });

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
    morphsQuery.error?.message ||
    detailQuery.error?.message ||
    createMutation.error?.message ||
    updateMutation.error?.message ||
    deleteMutation.error?.message;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: BloodlineMaster = {
      species_id: form.species_id,
      morph_id: form.morph_id,
      bloodline_id: form.bloodline_id,
      bloodline_name: form.bloodline_name.trim(),
    };

    if (props.mode === 'create') {
      const created = await createMutation.mutateAsync({
        species_id: payload.species_id,
        morph_id: payload.morph_id,
        bloodline_name: payload.bloodline_name,
      });
      navigate(
        `/admin/masters/bloodlines/detail/${created.species_id}/${created.morph_id}/${created.bloodline_id}?speciesId=${created.species_id}&morphId=${created.morph_id}`
      );
      return;
    }

    const updated = await updateMutation.mutateAsync({
      speciesId: props.speciesId,
      morphId: props.morphId,
      bloodlineId: props.bloodlineId,
      bloodline: payload,
    });
    navigate(
      `/admin/masters/bloodlines/detail/${updated.species_id}/${updated.morph_id}/${updated.bloodline_id}?speciesId=${updated.species_id}&morphId=${updated.morph_id}`
    );
  };

  const handleDelete = async () => {
    if (props.mode !== 'edit') return;
    if (!confirmDeleteByKeyword()) return;
    await deleteMutation.mutateAsync({
      speciesId: props.speciesId,
      morphId: props.morphId,
      bloodlineId: props.bloodlineId,
    });
    navigate(`/admin/masters/bloodlines?speciesId=${props.speciesId}&morphId=${props.morphId}`);
  };

  if (speciesQuery.isLoading || morphsQuery.isLoading || (props.mode === 'edit' && detailQuery.isLoading)) {
    return <StatusBanner>読み込み中...</StatusBanner>;
  }

  return (
    <AdminPageLayout>
      <PageHeader
        title={props.mode === 'create' ? '血統マスタ新規登録' : '血統マスタ編集'}
        actions={
          <button
            className={adminStyles.buttonGhost}
            onClick={() =>
              navigate(
                props.mode === 'create'
                  ? `/admin/masters/bloodlines${form.species_id ? `?speciesId=${form.species_id}${form.morph_id ? `&morphId=${form.morph_id}` : ''}` : ''}`
                  : `/admin/masters/bloodlines/detail/${props.speciesId}/${props.morphId}/${props.bloodlineId}?speciesId=${props.speciesId}&morphId=${props.morphId}`
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
              onChange={(event) =>
                setForm((current) => ({ ...current, species_id: event.target.value, morph_id: '' }))
              }
              required
            >
              {speciesQuery.data?.map((species) => (
                <option key={species.species_id} value={species.species_id}>
                  {species.common_name || species.japanese_name}
                </option>
              ))}
            </select>
          </label>

          <label className={adminStyles.field}>
            モルフ
            <select
              value={form.morph_id}
              disabled={props.mode === 'edit'}
              onChange={(event) => setForm((current) => ({ ...current, morph_id: event.target.value }))}
              required
            >
              <option value="">選択してください</option>
              {(morphsQuery.data ?? []).map((morph) => (
                <option key={`${morph.species_id}-${morph.morph_id}`} value={morph.morph_id}>
                  {morph.morph_name}
                </option>
              ))}
            </select>
          </label>

          {props.mode === 'edit' ? (
            <label className={adminStyles.field}>
              血統ID
              <input value={form.bloodline_id} disabled />
            </label>
          ) : null}

          <label className={adminStyles.field}>
            血統名
            <input
              value={form.bloodline_name}
              onChange={(event) => setForm((current) => ({ ...current, bloodline_name: event.target.value }))}
              required
            />
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
