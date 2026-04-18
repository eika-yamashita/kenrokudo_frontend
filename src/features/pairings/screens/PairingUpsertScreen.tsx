import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AdminPageLayout,
  FormActions,
  PageHeader,
  StatusBanner,
  adminStyles,
} from '../../../shared/ui/admin';
import { useIndividualsQuery } from '../../individuals/hooks/useIndividualQueries';
import { useSpeciesQuery } from '../../species/hooks/useSpeciesQuery';
import { PairingForm } from '../components/PairingForm';
import {
  createEmptyPairingFormValues,
  formValuesToPairing,
  pairingToFormValues,
} from '../forms/pairingFormMapper';
import { pairingFormSchema, type PairingFormValues } from '../forms/pairingFormSchema';
import {
  useCreatePairingMutation,
  useDeletePairingMutation,
  usePairingQuery,
  useUpdatePairingMutation,
} from '../hooks/usePairingQueries';

type Props =
  | { mode: 'create' }
  | { mode: 'edit'; speciesId: string; fiscalYear: number; pairingId: string };

export const PairingUpsertScreen = (props: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const speciesQuery = useSpeciesQuery();
  const individualsQuery = useIndividualsQuery();
  const pairingQuery = usePairingQuery(
    props.mode === 'edit' ? props.speciesId : undefined,
    props.mode === 'edit' ? props.fiscalYear : undefined,
    props.mode === 'edit' ? props.pairingId : undefined
  );
  const createMutation = useCreatePairingMutation();
  const updateMutation = useUpdatePairingMutation();
  const deleteMutation = useDeletePairingMutation();

  const form = useForm<PairingFormValues>({
    resolver: zodResolver(pairingFormSchema),
    defaultValues: createEmptyPairingFormValues(),
  });

  useEffect(() => {
    if (props.mode === 'edit' && pairingQuery.data) {
      form.reset(pairingToFormValues(pairingQuery.data));
      return;
    }

    if (props.mode === 'create' && speciesQuery.data?.[0] && !form.getValues('species_id')) {
      form.setValue('species_id', speciesQuery.data[0].species_id);
    }
  }, [form, pairingQuery.data, props.mode, speciesQuery.data]);

  const isLoading = speciesQuery.isLoading || individualsQuery.isLoading || pairingQuery.isLoading;
  const errorMessage =
    speciesQuery.error?.message ||
    individualsQuery.error?.message ||
    pairingQuery.error?.message ||
    createMutation.error?.message ||
    updateMutation.error?.message ||
    deleteMutation.error?.message;
  const listSearch = location.search;

  const handleSubmit = form.handleSubmit(async (values) => {
    const payload = formValuesToPairing(values);

    if (props.mode === 'create') {
      await createMutation.mutateAsync(payload);
      navigate(`/admin/pairings${listSearch}`);
      return;
    }

    const updated = await updateMutation.mutateAsync({
      speciesId: props.speciesId,
      fiscalYear: props.fiscalYear,
      pairingId: props.pairingId,
      pairing: payload,
    });

    navigate(`/admin/pairings/edit/${updated.species_id}/${updated.fiscal_year}/${updated.pairing_id}${listSearch}`, {
      replace: true,
    });
  });

  const handleDelete = async () => {
    if (props.mode !== 'edit') return;
    if (!window.confirm('このペアリング情報を削除しますか？')) return;

    await deleteMutation.mutateAsync({
      speciesId: props.speciesId,
      fiscalYear: props.fiscalYear,
      pairingId: props.pairingId,
    });
    navigate(`/admin/pairings${listSearch}`);
  };

  if (isLoading) {
    return <StatusBanner>読み込み中...</StatusBanner>;
  }

  if (!speciesQuery.data || !individualsQuery.data) {
    return <StatusBanner tone="error">必要なデータを読み込めませんでした</StatusBanner>;
  }

  return (
    <AdminPageLayout>
      <PageHeader
        title={props.mode === 'create' ? 'ペアリング新規登録' : 'ペアリング編集'}
        actions={
          <button className={adminStyles.buttonGhost} onClick={() => navigate(`/admin/pairings${listSearch}`)}>
            {props.mode === 'edit' ? '戻る' : '戻る'}
          </button>
        }
      />

      <form className={adminStyles.stack} onSubmit={handleSubmit}>
        <PairingForm
          mode={props.mode}
          form={form}
          speciesList={speciesQuery.data}
          individuals={individualsQuery.data}
        />

        <FormActions>
          <button
            className={adminStyles.button}
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending ? '保存中...' : '保存'}
          </button>
          {props.mode === 'edit' ? (
            <button
              className={adminStyles.buttonDanger}
              type="button"
              onClick={handleDelete}
              disabled={createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
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
