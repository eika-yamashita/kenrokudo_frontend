import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Species } from '../../../api/models/Species';
import {
  AdminPageLayout,
  FormActions,
  PageHeader,
  StatusBanner,
  adminStyles,
  confirmDeleteByKeyword,
} from '../../../shared/ui/admin';
import {
  useCreateSpeciesMutation,
  useDeleteSpeciesMutation,
  useSpeciesDetailQuery,
  useUpdateSpeciesMutation,
} from '../hooks/useSpeciesQuery';

type Props =
  | { mode: 'create' }
  | { mode: 'edit'; speciesId: string };

const emptySpecies: Species = {
  species_id: '',
  japanese_name: '',
  common_name: '',
  english_name: '',
  total_length: '',
  body_weight: '',
  lifespan: '',
};

export const SpeciesUpsertScreen = (props: Props) => {
  const navigate = useNavigate();
  const detailQuery = useSpeciesDetailQuery(props.mode === 'edit' ? props.speciesId : undefined);
  const createMutation = useCreateSpeciesMutation();
  const updateMutation = useUpdateSpeciesMutation();
  const deleteMutation = useDeleteSpeciesMutation();
  const [form, setForm] = useState<Species>(emptySpecies);

  useEffect(() => {
    if (props.mode === 'edit' && detailQuery.data) {
      setForm({
        species_id: detailQuery.data.species_id,
        japanese_name: detailQuery.data.japanese_name,
        common_name: detailQuery.data.common_name ?? '',
        english_name: detailQuery.data.english_name ?? '',
        total_length: detailQuery.data.total_length ?? '',
        body_weight: detailQuery.data.body_weight ?? '',
        lifespan: detailQuery.data.lifespan ?? '',
      });
    }
  }, [detailQuery.data, props.mode]);

  const isSaving = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  const errorMessage =
    detailQuery.error?.message ||
    createMutation.error?.message ||
    updateMutation.error?.message ||
    deleteMutation.error?.message;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: Species = {
      species_id: form.species_id.trim(),
      japanese_name: form.japanese_name.trim(),
      common_name: form.common_name?.trim() || undefined,
      english_name: form.english_name?.trim() || undefined,
      total_length: form.total_length?.trim() || undefined,
      body_weight: form.body_weight?.trim() || undefined,
      lifespan: form.lifespan?.trim() || undefined,
    };

    if (props.mode === 'create') {
      const created = await createMutation.mutateAsync(payload);
      navigate(`/admin/masters/species/detail/${created.species_id}`);
      return;
    }

    const updated = await updateMutation.mutateAsync({ speciesId: props.speciesId, species: payload });
    navigate(`/admin/masters/species/detail/${updated.species_id}`);
  };

  const handleDelete = async () => {
    if (props.mode !== 'edit') return;
    if (!confirmDeleteByKeyword()) return;
    await deleteMutation.mutateAsync(props.speciesId);
    navigate('/admin/masters/species');
  };

  if (props.mode === 'edit' && detailQuery.isLoading) {
    return <StatusBanner>読み込み中...</StatusBanner>;
  }

  return (
    <AdminPageLayout>
      <PageHeader
        title={props.mode === 'create' ? '種マスタ新規登録' : '種マスタ編集'}
        actions={
          <button
            className={adminStyles.buttonGhost}
            onClick={() =>
              navigate(
                props.mode === 'create'
                  ? '/admin/masters/species'
                  : `/admin/masters/species/detail/${props.speciesId}`
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
            種コード
            <input
              value={form.species_id}
              disabled={props.mode === 'edit'}
              onChange={(event) => setForm((current) => ({ ...current, species_id: event.target.value }))}
              required
            />
          </label>

          <label className={adminStyles.field}>
            和名
            <input
              value={form.japanese_name}
              onChange={(event) => setForm((current) => ({ ...current, japanese_name: event.target.value }))}
              required
            />
          </label>

          <label className={adminStyles.field}>
            通称
            <input
              value={form.common_name ?? ''}
              onChange={(event) => setForm((current) => ({ ...current, common_name: event.target.value }))}
            />
          </label>

          <label className={adminStyles.field}>
            英名
            <input
              value={form.english_name ?? ''}
              onChange={(event) => setForm((current) => ({ ...current, english_name: event.target.value }))}
            />
          </label>

          <label className={adminStyles.field}>
            全長
            <input
              value={form.total_length ?? ''}
              onChange={(event) => setForm((current) => ({ ...current, total_length: event.target.value }))}
            />
          </label>

          <label className={adminStyles.field}>
            体重
            <input
              value={form.body_weight ?? ''}
              onChange={(event) => setForm((current) => ({ ...current, body_weight: event.target.value }))}
            />
          </label>

          <label className={adminStyles.field}>
            寿命
            <input
              value={form.lifespan ?? ''}
              onChange={(event) => setForm((current) => ({ ...current, lifespan: event.target.value }))}
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
