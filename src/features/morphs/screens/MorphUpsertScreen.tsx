import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { MorphComponent, MorphMaster } from '../../../api/models/MorphMaster';
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
  useMorphsQuery,
  useUpdateMorphMutation,
} from '../hooks/useMorphQueries';

type Props =
  | { mode: 'create' }
  | { mode: 'edit'; speciesId: string; morphId: string };

const inheritanceCategoryOptions = [
  { value: '0', label: '多因子遺伝' },
  { value: '1', label: '劣性遺伝' },
  { value: '2', label: '優性遺伝' },
  { value: '3', label: '共優性遺伝' },
];

const emptyComponent = (sortOrder: number): MorphComponent => ({
  component_morph_id: '',
  required_expression: '0',
  sort_order: sortOrder,
});

const emptyMorph: MorphMaster = {
  species_id: '',
  morph_id: '',
  morph_name: '',
  morph_type: 'SINGLE',
  inheritance_category: '0',
  display_priority: 0,
  components: [],
};

export const MorphUpsertScreen = (props: Props) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultSpeciesId = searchParams.get('speciesId') ?? '';
  const speciesQuery = useSpeciesQuery();
  const morphsQuery = useMorphsQuery();
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
      setForm({ ...detailQuery.data, components: detailQuery.data.components ?? [] });
      return;
    }
    if (props.mode === 'create' && !form.species_id && speciesQuery.data?.[0]) {
      setForm((current) => ({ ...current, species_id: speciesQuery.data![0].species_id }));
    }
  }, [detailQuery.data, form.species_id, props.mode, speciesQuery.data]);

  const componentOptions = useMemo(
    () =>
      (morphsQuery.data ?? [])
        .filter(
          (morph) =>
            morph.species_id === form.species_id &&
            morph.morph_type === 'SINGLE' &&
            morph.morph_id !== form.morph_id
        )
        .sort((a, b) => a.morph_name.localeCompare(b.morph_name)),
    [form.morph_id, form.species_id, morphsQuery.data]
  );

  const isSaving = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  const errorMessage =
    speciesQuery.error?.message ||
    morphsQuery.error?.message ||
    detailQuery.error?.message ||
    createMutation.error?.message ||
    updateMutation.error?.message ||
    deleteMutation.error?.message;

  const updateComponent = (index: number, morphId: string) => {
    setForm((current) => ({
      ...current,
      components: (current.components ?? []).map((component, componentIndex) =>
        componentIndex === index ? { ...component, component_morph_id: morphId } : component
      ),
    }));
  };

  const removeComponent = (index: number) => {
    setForm((current) => ({
      ...current,
      components: (current.components ?? [])
        .filter((_, componentIndex) => componentIndex !== index)
        .map((component, componentIndex) => ({ ...component, sort_order: componentIndex })),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const components = form.morph_type === 'COMBO'
      ? (form.components ?? []).filter((component) => component.component_morph_id)
      : [];
    const payload: MorphMaster = {
      ...form,
      morph_name: form.morph_name.trim(),
      inheritance_category: form.morph_type === 'SINGLE' ? form.inheritance_category : undefined,
      display_priority: form.morph_type === 'COMBO' ? Number(form.display_priority ?? 0) : 0,
      components: components.map((component, index) => ({
        ...component,
        required_expression: '0',
        sort_order: index,
      })),
    };

    if (props.mode === 'create') {
      const created = await createMutation.mutateAsync(payload);
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
    if (props.mode !== 'edit' || !confirmDeleteByKeyword()) return;
    await deleteMutation.mutateAsync({ speciesId: props.speciesId, morphId: props.morphId });
    navigate(`/admin/masters/morphs?speciesId=${props.speciesId}`);
  };

  if (speciesQuery.isLoading || morphsQuery.isLoading || (props.mode === 'edit' && detailQuery.isLoading)) {
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
              onChange={(event) => setForm((current) => ({ ...current, species_id: event.target.value, components: [] }))}
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
            <input value={form.morph_name} onChange={(event) => setForm((current) => ({ ...current, morph_name: event.target.value }))} required />
          </label>

          <label className={adminStyles.field}>
            モルフ種別
            <select
              value={form.morph_type}
              disabled={props.mode === 'edit'}
              onChange={(event) => {
                const morphType = event.target.value as MorphMaster['morph_type'];
                setForm((current) => ({
                  ...current,
                  morph_type: morphType,
                  inheritance_category: morphType === 'SINGLE' ? '0' : undefined,
                  components: morphType === 'COMBO' ? [emptyComponent(0), emptyComponent(1)] : [],
                }));
              }}
            >
              <option value="SINGLE">シングル</option>
              <option value="COMBO">コンボ</option>
            </select>
          </label>

          {form.morph_type === 'SINGLE' ? (
            <label className={adminStyles.field}>
              遺伝性区分
              <select
                value={form.inheritance_category ?? '0'}
                onChange={(event) => setForm((current) => ({ ...current, inheritance_category: event.target.value }))}
                required
              >
                {inheritanceCategoryOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
          ) : (
            <label className={adminStyles.field}>
              表示優先度
              <input
                type="number"
                min="0"
                value={form.display_priority ?? 0}
                onChange={(event) => setForm((current) => ({ ...current, display_priority: Number(event.target.value) }))}
              />
            </label>
          )}
        </div>

        {form.morph_type === 'COMBO' ? (
          <div className={adminStyles.sectionPlain}>
            <h2>構成モルフ</h2>
            <div className={adminStyles.stack}>
              {(form.components ?? []).map((component, index) => (
                <div className={adminStyles.inlineActions} key={`${index}-${component.component_morph_id}`}>
                  <select
                    aria-label={`構成モルフ${index + 1}`}
                    value={component.component_morph_id}
                    onChange={(event) => updateComponent(index, event.target.value)}
                    required
                  >
                    <option value="">選択してください</option>
                    {componentOptions.map((morph) => (
                      <option key={morph.morph_id} value={morph.morph_id}>{morph.morph_name}</option>
                    ))}
                  </select>
                  <span>Visual</span>
                  <button className={adminStyles.buttonGhost} type="button" onClick={() => removeComponent(index)} disabled={(form.components?.length ?? 0) <= 2}>
                    削除
                  </button>
                </div>
              ))}
              <button
                className={adminStyles.buttonGhost}
                type="button"
                onClick={() => setForm((current) => ({ ...current, components: [...(current.components ?? []), emptyComponent(current.components?.length ?? 0)] }))}
              >
                構成モルフを追加
              </button>
            </div>
          </div>
        ) : null}

        <FormActions>
          <button className={adminStyles.button} type="submit" disabled={isSaving}>{isSaving ? '保存中...' : '保存'}</button>
          {props.mode === 'edit' ? (
            <button className={adminStyles.buttonDanger} type="button" onClick={() => void handleDelete()} disabled={isSaving}>削除</button>
          ) : null}
        </FormActions>
      </form>
      {errorMessage ? <StatusBanner tone="error">{errorMessage}</StatusBanner> : null}
    </AdminPageLayout>
  );
};
