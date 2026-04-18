import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AdminPageLayout,
  PageHeader,
  StatusBanner,
  adminStyles,
} from '../../../shared/ui/admin';
import { usePairingsQuery } from '../../pairings/hooks/usePairingQueries';
import { useSpeciesQuery } from '../../species/hooks/useSpeciesQuery';
import { getSpeciesLabel } from '../../species/utils/getSpeciesLabel';
import { ImageUploadPicker } from '../components/ImageUploadPicker';
import { IndividualFormFields } from '../components/IndividualFormFields';
import { IndividualImageManager } from '../components/IndividualImageManager';
import { formValuesToIndividual, individualToFormValues } from '../forms/individualFormMapper';
import { individualFormSchema, type IndividualFormValues } from '../forms/individualFormSchema';
import {
  useDeleteIndividualImageMutation,
  useIndividualImagesQuery,
  useIndividualQuery,
  useReplaceIndividualImageMutation,
  useSetPrimaryIndividualImageMutation,
  useUpdateIndividualMutation,
  useUploadIndividualImageMutation,
} from '../hooks/useIndividualQueries';

type Props = {
  speciesId: string;
  id: string;
};

export const IndividualEditScreen = ({ speciesId, id }: Props) => {
  const formId = 'individual-edit-form';
  const navigate = useNavigate();
  const location = useLocation();
  const individualQuery = useIndividualQuery(speciesId, id);
  const imagesQuery = useIndividualImagesQuery(speciesId, id);
  const speciesQuery = useSpeciesQuery();
  const pairingsQuery = usePairingsQuery();
  const updateMutation = useUpdateIndividualMutation();
  const uploadImageMutation = useUploadIndividualImageMutation();
  const replaceImageMutation = useReplaceIndividualImageMutation();
  const deleteImageMutation = useDeleteIndividualImageMutation();
  const setPrimaryMutation = useSetPrimaryIndividualImageMutation();

  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const form = useForm<IndividualFormValues>({
    resolver: zodResolver(individualFormSchema),
    defaultValues: individualQuery.data ? individualToFormValues(individualQuery.data) : undefined,
  });

  useEffect(() => {
    if (individualQuery.data) {
      form.reset(individualToFormValues(individualQuery.data));
    }
  }, [form, individualQuery.data]);

  useEffect(() => {
    const previewUrls = newFiles.map((file) => URL.createObjectURL(file));
    setNewPreviews(previewUrls);

    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newFiles]);

  const isLoading =
    individualQuery.isLoading || imagesQuery.isLoading || speciesQuery.isLoading || pairingsQuery.isLoading;
  const errorMessage =
    individualQuery.error?.message ||
    imagesQuery.error?.message ||
    speciesQuery.error?.message ||
    pairingsQuery.error?.message ||
    updateMutation.error?.message ||
    uploadImageMutation.error?.message ||
    replaceImageMutation.error?.message ||
    deleteImageMutation.error?.message ||
    setPrimaryMutation.error?.message;

  const isSaving =
    updateMutation.isPending ||
    uploadImageMutation.isPending ||
    replaceImageMutation.isPending ||
    deleteImageMutation.isPending ||
    setPrimaryMutation.isPending;
  const listSearch = location.search;
  const confirmSave = () => {
    if (typeof window === 'undefined' || typeof window.confirm !== 'function') return true;

    try {
      return window.confirm('保存してよろしいですか？');
    } catch {
      return true;
    }
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!individualQuery.data) return;
    if (!confirmSave()) return;

    await updateMutation.mutateAsync({
      speciesId,
      id,
      individual: formValuesToIndividual(values, individualQuery.data),
    });

    for (const file of newFiles) {
      await uploadImageMutation.mutateAsync({
        speciesId,
        id,
        file,
      });
    }

    setNewFiles([]);
  });

  if (isLoading) {
    return <StatusBanner>読み込み中...</StatusBanner>;
  }

  if (!individualQuery.data || !speciesQuery.data || !pairingsQuery.data) {
    return <StatusBanner tone="error">必要なデータを読み込めませんでした</StatusBanner>;
  }

  return (
    <AdminPageLayout>
      <PageHeader
        title={`${getSpeciesLabel(speciesId, speciesQuery.data)} / ${individualQuery.data.id}`}
        stickyActions
        actions={
          <div className={adminStyles.inlineActions}>
            <button
              className={adminStyles.buttonGhost}
              type="button"
              onClick={() => navigate(`/admin/individuals/detail/${speciesId}/${id}${listSearch}`)}
            >
              戻る
            </button>
            <button className={adminStyles.button} type="submit" form={formId} disabled={isSaving}>
              {isSaving ? '保存中...' : '保存する'}
            </button>
          </div>
        }
      />

      <form id={formId} className={adminStyles.stack} onSubmit={handleSubmit}>
        <IndividualImageManager
          images={imagesQuery.data ?? []}
          loading={imagesQuery.isLoading}
          error={null}
          onSetPrimary={async (imageId) => {
            await setPrimaryMutation.mutateAsync({ speciesId, id, imageId });
          }}
          onReplace={async (imageId, file) => {
            await replaceImageMutation.mutateAsync({ speciesId, id, imageId, file });
          }}
          onDelete={async (imageId) => {
            await deleteImageMutation.mutateAsync({ speciesId, id, imageId });
          }}
        />

        <ImageUploadPicker files={newFiles} previews={newPreviews} primaryIndex={0} onFilesChange={setNewFiles} />

        <div className={adminStyles.sectionPlain}>
          <IndividualFormFields
            mode="edit"
            form={form}
            speciesList={speciesQuery.data}
            pairingList={pairingsQuery.data}
          />
        </div>
      </form>

      {errorMessage ? <StatusBanner tone="error">{errorMessage}</StatusBanner> : null}
    </AdminPageLayout>
  );
};
