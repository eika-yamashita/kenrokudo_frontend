import { useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { Pairing } from '../../../api/models/Pairing';
import type { Species } from '../../../api/models/Species';
import { adminStyles } from '../../../shared/ui/admin';
import { genderCategoryOptions } from '../../../utils/genderCategory';
import { normalizeIdInput } from '../../../utils/idNormalizer';
import type { IndividualFormValues } from '../forms/individualFormSchema';

const breedingCategoryOptions = [
  { value: '0', label: '自家繁殖' },
  { value: '1', label: '購入個体' },
];

const salesCategoryOptions = [
  { value: '', label: '未設定' },
  { value: '0', label: '非売個体' },
  { value: '1', label: '販売中' },
  { value: '2', label: '販売済' },
];

type Props = {
  mode: 'create' | 'edit';
  form: UseFormReturn<IndividualFormValues>;
  speciesList: Species[];
  pairingList: Pairing[];
};

export const IndividualFormFields = ({ mode, form, speciesList, pairingList }: Props) => {
  const {
    formState: { errors },
    register,
    setValue,
    watch,
  } = form;

  const speciesId = watch('species_id');
  const breedingCategory = watch('breeding_category');
  const selectedPairingKey =
    watch('pairing_fiscal_year') && watch('pairing_id')
      ? `${watch('pairing_fiscal_year')}|${watch('pairing_id')}`
      : '';
  const pairingSelected = Boolean(selectedPairingKey);
  const isPurchaseIndividual = breedingCategory === '1';

  const filteredPairings = useMemo(
    () =>
      pairingList
        .filter((pairing) => pairing.species_id === speciesId)
        .sort((a, b) => {
          const yearDiff = (b.fiscal_year ?? 0) - (a.fiscal_year ?? 0);
          if (yearDiff !== 0) return yearDiff;
          return (a.pairing_id ?? '').localeCompare(b.pairing_id ?? '');
        }),
    [pairingList, speciesId]
  );

  const handlePairingChange = (value: string) => {
    if (!value) {
      setValue('pairing_fiscal_year', '', { shouldDirty: true });
      setValue('pairing_id', '', { shouldDirty: true });
      setValue('male_parent_id', '', { shouldDirty: true });
      setValue('female_parent_id', '', { shouldDirty: true });
      return;
    }

    const [fiscalYear, pairingId] = value.split('|');
    const selected = filteredPairings.find(
      (pairing) => String(pairing.fiscal_year) === fiscalYear && pairing.pairing_id === pairingId
    );

    if (!selected) return;

    setValue('pairing_fiscal_year', fiscalYear, { shouldDirty: true, shouldValidate: true });
    setValue('pairing_id', pairingId, { shouldDirty: true, shouldValidate: true });
    setValue('male_parent_id', selected.male_parent_id, { shouldDirty: true, shouldValidate: true });
    setValue('female_parent_id', selected.female_parent_id, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className={adminStyles.formGrid}>
      {mode === 'create' ? (
        <>
          <label className={adminStyles.field}>
            種
            <select
              {...register('species_id')}
              onChange={(event) => {
                setValue('species_id', event.target.value, { shouldDirty: true, shouldValidate: true });
                setValue('pairing_fiscal_year', '', { shouldDirty: true });
                setValue('pairing_id', '', { shouldDirty: true });
                setValue('male_parent_id', '', { shouldDirty: true });
                setValue('female_parent_id', '', { shouldDirty: true });
              }}
            >
              <option value="">選択してください</option>
              {speciesList.map((species) => (
                <option key={species.species_id} value={species.species_id}>
                  {species.common_name || species.japanese_name}
                </option>
              ))}
            </select>
            {errors.species_id ? <p className={adminStyles.fieldError}>{errors.species_id.message}</p> : null}
          </label>

          <label className={adminStyles.field}>
            ペアリングID
            <select value={selectedPairingKey} onChange={(event) => handlePairingChange(event.target.value)}>
              <option value="">選択なし（親IDを手入力）</option>
              {filteredPairings.map((pairing) => {
                const optionKey = `${pairing.fiscal_year}|${pairing.pairing_id}`;
                return (
                  <option key={optionKey} value={optionKey}>
                    {`${pairing.fiscal_year} / ${pairing.pairing_id} (M:${pairing.male_parent_id} F:${pairing.female_parent_id})`}
                  </option>
                );
              })}
            </select>
            {errors.pairing_fiscal_year ? (
              <p className={adminStyles.fieldError}>{errors.pairing_fiscal_year.message}</p>
            ) : null}
          </label>
        </>
      ) : (
        <>
          <label className={adminStyles.field}>
            種
            <input {...register('species_id')} disabled />
          </label>
          <label className={adminStyles.field}>
            個体ID
            <input {...register('id')} disabled />
          </label>
        </>
      )}

      {mode === 'create' ? (
        <label className={adminStyles.field}>
          個体ID
          <input
            {...register('id')}
            onBlur={(event) =>
              setValue('id', normalizeIdInput(event.target.value), { shouldDirty: true, shouldValidate: true })
            }
          />
          {errors.id ? <p className={adminStyles.fieldError}>{errors.id.message}</p> : null}
        </label>
      ) : null}

      <label className={adminStyles.field}>
        オス親ID
        <input
          {...register('male_parent_id')}
          disabled={pairingSelected}
          onBlur={(event) =>
            setValue('male_parent_id', normalizeIdInput(event.target.value), {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />
      </label>

      <label className={adminStyles.field}>
        メス親ID
        <input
          {...register('female_parent_id')}
          disabled={pairingSelected}
          onBlur={(event) =>
            setValue('female_parent_id', normalizeIdInput(event.target.value), {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />
      </label>

      <label className={adminStyles.field}>
        モルフ
        <input {...register('morph')} />
      </label>

      <label className={adminStyles.field}>
        血統
        <input {...register('bloodline')} />
      </label>

      <label className={adminStyles.field}>
        雌雄区分
        <select {...register('gender_category')}>
          {genderCategoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className={adminStyles.field}>
        繁殖区分
        <select
          {...register('breeding_category')}
          onChange={(event) => {
            const value = event.target.value;
            setValue('breeding_category', value, { shouldDirty: true, shouldValidate: true });
            if (value === '1') {
              setValue('breeder', '', { shouldDirty: true });
              return;
            }

            setValue('breeder', '絢禄堂', { shouldDirty: true });
            setValue('purchase_from', '', { shouldDirty: true });
            setValue('purchase_price', '', { shouldDirty: true });
            setValue('purchase_date', '', { shouldDirty: true });
          }}
        >
          {breedingCategoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.breeding_category ? (
          <p className={adminStyles.fieldError}>{errors.breeding_category.message}</p>
        ) : null}
      </label>

      <label className={adminStyles.field}>
        ブリーダー名
        <input {...register('breeder')} />
      </label>

      <label className={adminStyles.field}>
        ハッチ日
        <input type="date" {...register('hatch_date')} />
        {errors.hatch_date ? <p className={adminStyles.fieldError}>{errors.hatch_date.message}</p> : null}
      </label>

      <label className={adminStyles.field}>
        クラッチ日
        <input type="date" {...register('clutch_date')} />
      </label>

      {isPurchaseIndividual ? (
        <>
          <label className={adminStyles.field}>
            購入元
            <input {...register('purchase_from')} />
          </label>

          <label className={adminStyles.field}>
            購入価格
            <input type="number" step="0.01" {...register('purchase_price')} />
          </label>

          <label className={adminStyles.field}>
            購入日
            <input type="date" {...register('purchase_date')} />
          </label>
        </>
      ) : null}

      <label className={adminStyles.field}>
        販売区分
        <select {...register('sales_category')}>
          {salesCategoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className={adminStyles.field}>
        販売先
        <input {...register('sales_to')} />
      </label>

      <label className={adminStyles.field}>
        販売価格(税抜)
        <input type="number" step="0.01" {...register('sales_price_tax_ex')} />
      </label>

      <label className={adminStyles.field}>
        消費税額
        <input type="number" step="0.01" {...register('sales_price_tax')} />
      </label>

      <label className={adminStyles.field}>
        販売価格(税込)
        <input type="number" step="0.01" {...register('sales_price_tax_in')} />
      </label>

      <label className={adminStyles.field}>
        販売日
        <input type="date" {...register('sales_date')} />
      </label>

      <label className={adminStyles.field}>
        死亡日
        <input type="date" {...register('death_date')} />
      </label>

      <label className={adminStyles.field}>
        メモ
        <textarea {...register('note')} />
      </label>
    </div>
  );
};
