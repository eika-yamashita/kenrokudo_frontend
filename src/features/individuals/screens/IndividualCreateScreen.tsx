import { useEffect, useMemo, useState } from 'react';
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
import { ImageUploadPicker } from '../components/ImageUploadPicker';
import { IndividualFormFields } from '../components/IndividualFormFields';
import {
  createEmptyIndividualFormValues,
  formValuesToIndividual,
} from '../forms/individualFormMapper';
import { individualFormSchema, type IndividualFormValues } from '../forms/individualFormSchema';
import { getSpeciesLabel } from '../../species/utils/getSpeciesLabel';
import {
  useCreateIndividualMutation,
  useUploadIndividualImageMutation,
} from '../hooks/useIndividualQueries';

export const IndividualCreateScreen = () => {
  const formId = 'individual-create-form';
  const navigate = useNavigate();
  const location = useLocation();
  const speciesQuery = useSpeciesQuery();
  const pairingsQuery = usePairingsQuery();
  const createMutation = useCreateIndividualMutation();
  const uploadImageMutation = useUploadIndividualImageMutation();

  const form = useForm<IndividualFormValues>({
    resolver: zodResolver(individualFormSchema),
    defaultValues: createEmptyIndividualFormValues(),
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

  useEffect(() => {
    if (speciesQuery.data?.[0] && !form.getValues('species_id')) {
      form.setValue('species_id', speciesQuery.data[0].species_id);
    }
  }, [form, speciesQuery.data]);

  useEffect(() => {
    const previewUrls = imageFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(previewUrls);

    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageFiles]);

  const errorMessage =
    speciesQuery.error?.message ||
    pairingsQuery.error?.message ||
    createMutation.error?.message ||
    uploadImageMutation.error?.message;

  const isSaving = createMutation.isPending || uploadImageMutation.isPending;
  const isLoading = speciesQuery.isLoading || pairingsQuery.isLoading;
  const pairings = useMemo(() => pairingsQuery.data ?? [], [pairingsQuery.data]);
  const selectedSpeciesId = form.watch('species_id');
  const speciesLabel = selectedSpeciesId ? getSpeciesLabel(selectedSpeciesId, speciesQuery.data ?? []) : '-';
  const listSearch = location.search;
  const confirmCreate = () => {
    if (typeof window === 'undefined' || typeof window.confirm !== 'function') return true;

    try {
      return window.confirm('登録してよろしいですか？');
    } catch {
      return true;
    }
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!confirmCreate()) return;

    const created = await createMutation.mutateAsync(formValuesToIndividual(values));

    if (imageFiles.length > 0) {
      for (let index = 0; index < imageFiles.length; index += 1) {
        await uploadImageMutation.mutateAsync({
          speciesId: created.species_id,
          id: created.id,
          file: imageFiles[index],
          isPrimary: index === primaryImageIndex,
        });
      }
    }

    navigate(`/admin/individuals${listSearch}`);
  });

  if (isLoading) {
    return <StatusBanner>読み込み中...</StatusBanner>;
  }

  if (!speciesQuery.data) {
    return <StatusBanner tone="error">種マスタを読み込めませんでした</StatusBanner>;
  }

  return (
    <AdminPageLayout>
      <PageHeader
        title={` ${speciesLabel} / 新規登録`}
        stickyActions
        actions={
          <div className={adminStyles.inlineActions}>
            <button className={adminStyles.buttonGhost} type="button" onClick={() => navigate(`/admin/individuals${listSearch}`)}>
              戻る
            </button>
            <button className={adminStyles.button} type="submit" form={formId} disabled={isSaving}>
              {isSaving ? '登録中...' : '登録する'}
            </button>
          </div>
        }
      />

      <form id={formId} className={adminStyles.stack} onSubmit={handleSubmit}>
        <ImageUploadPicker
          files={imageFiles}
          previews={imagePreviews}
          primaryIndex={primaryImageIndex}
          onFilesChange={(files) => {
            setImageFiles(files);
            setPrimaryImageIndex(0);
          }}
          onPrimaryIndexChange={setPrimaryImageIndex}
        />

        <div className={adminStyles.sectionPlain}>
          <IndividualFormFields mode="create" form={form} speciesList={speciesQuery.data} pairingList={pairings} />
        </div>
      </form>

      {errorMessage ? <StatusBanner tone="error">{errorMessage}</StatusBanner> : null}
    </AdminPageLayout>
  );
};
