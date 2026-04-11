import type { Individual } from '../../../api/models/Individual';
import type { Species } from '../../../api/models/Species';
import { normalizeIdInput } from '../../../utils/idNormalizer';
import { isFemaleCategory, isMaleCategory } from '../../../utils/genderFilter';
import { getSpeciesLabel } from '../../species/utils/getSpeciesLabel';
import type { PairingFormValues } from '../forms/pairingFormSchema';
import type { UseFormReturn } from 'react-hook-form';
import { adminStyles } from '../../../shared/ui/admin';

const buildIndividualLabel = (individual: Individual) => {
  if (individual.morph) {
    return `${individual.id} (${individual.morph})`;
  }

  return individual.id;
};

type Props = {
  mode: 'create' | 'edit';
  form: UseFormReturn<PairingFormValues>;
  speciesList: Species[];
  individuals: Individual[];
};

export const PairingForm = ({ mode, form, speciesList, individuals }: Props) => {
  const speciesId = form.watch('species_id');
  const maleCandidates = individuals.filter(
    (individual) => individual.species_id === speciesId && isMaleCategory(individual.gender_category)
  );
  const femaleCandidates = individuals.filter(
    (individual) => individual.species_id === speciesId && isFemaleCategory(individual.gender_category)
  );

  const {
    formState: { errors },
    register,
    setValue,
  } = form;

  return (
    <div className={adminStyles.formGrid}>
      <label className={adminStyles.field}>
        種
        <select
          {...register('species_id')}
          onChange={(event) => {
            form.setValue('species_id', event.target.value, { shouldDirty: true, shouldValidate: true });
            form.setValue('male_parent_id', '', { shouldDirty: true });
            form.setValue('female_parent_id', '', { shouldDirty: true });
          }}
        >
          <option value="">選択してください</option>
          {speciesList.map((species) => (
            <option key={species.species_id} value={species.species_id}>
              {getSpeciesLabel(species.species_id, speciesList)} ({species.species_id})
            </option>
          ))}
        </select>
        {errors.species_id ? <p className={adminStyles.fieldError}>{errors.species_id.message}</p> : null}
      </label>

      {mode === 'edit' ? (
        <>
          <label className={adminStyles.field}>
            年度
            <input {...register('fiscal_year')} disabled />
          </label>
          <label className={adminStyles.field}>
            ペアリングID
            <input {...register('pairing_id')} disabled />
          </label>
        </>
      ) : (
        <label className={adminStyles.field}>
          ペアリングID
          <input
            {...register('pairing_id')}
            onBlur={(event) =>
              setValue('pairing_id', normalizeIdInput(event.target.value), { shouldDirty: true, shouldValidate: true })
            }
            placeholder="例: A / B / AA"
          />
        </label>
      )}

      <label className={adminStyles.field}>
        オス親ID
        <input
          list={`pairing-male-${mode}`}
          {...register('male_parent_id')}
          onBlur={(event) =>
            setValue('male_parent_id', normalizeIdInput(event.target.value), {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          placeholder="個体IDを入力"
        />
        <datalist id={`pairing-male-${mode}`}>
          {maleCandidates.map((individual) => (
            <option key={`${individual.species_id}-${individual.id}`} value={individual.id} label={buildIndividualLabel(individual)} />
          ))}
        </datalist>
        {errors.male_parent_id ? <p className={adminStyles.fieldError}>{errors.male_parent_id.message}</p> : null}
      </label>

      <label className={adminStyles.field}>
        メス親ID
        <input
          list={`pairing-female-${mode}`}
          {...register('female_parent_id')}
          onBlur={(event) =>
            setValue('female_parent_id', normalizeIdInput(event.target.value), {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          placeholder="個体IDを入力"
        />
        <datalist id={`pairing-female-${mode}`}>
          {femaleCandidates.map((individual) => (
            <option key={`${individual.species_id}-${individual.id}`} value={individual.id} label={buildIndividualLabel(individual)} />
          ))}
        </datalist>
        {errors.female_parent_id ? (
          <p className={adminStyles.fieldError}>{errors.female_parent_id.message}</p>
        ) : null}
      </label>

      <label className={adminStyles.field}>
        ペアリング日
        <input type="date" {...register('pairing_date')} />
        {errors.pairing_date ? <p className={adminStyles.fieldError}>{errors.pairing_date.message}</p> : null}
      </label>

      <label className={adminStyles.field}>
        メモ
        <textarea {...register('note')} />
      </label>
    </div>
  );
};
