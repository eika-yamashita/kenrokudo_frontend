import { useEffect, useMemo } from 'react';
import { useFieldArray, type UseFormReturn } from 'react-hook-form';
import type { BloodlineMaster } from '../../../api/models/BloodlineMaster';
import type { MorphMaster } from '../../../api/models/MorphMaster';
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
  { value: '0', label: '非売個体' },
  { value: '1', label: '販売中' },
  { value: '2', label: '販売済み' },
];

const currentYear = new Date().getFullYear();
const fiscalYearOptions = Array.from({ length: currentYear - 2021 + 1 }, (_, index) =>
  String(currentYear - index)
);

const inheritanceCategoryOptions = [
  { value: '0', label: '多因性遺伝' },
  { value: '1', label: '劣性遺伝' },
  { value: '2', label: '優勢遺伝' },
  { value: '3', label: '共優勢遺伝' },
];

type Props = {
  mode: 'create' | 'edit';
  form: UseFormReturn<IndividualFormValues>;
  speciesList: Species[];
  pairingList: Pairing[];
  morphList: MorphMaster[];
  bloodlineList: BloodlineMaster[];
};

const emptyHetEntry = () => ({ morph_id: '' });
const emptyPossibleHetEntry = () => ({ morph_id: '', possible_het_percentage: '' });

export const IndividualFormFields = ({
  mode,
  form,
  speciesList,
  pairingList,
  morphList,
  bloodlineList,
}: Props) => {
  const {
    control,
    formState: { errors },
    register,
    setValue,
    watch,
  } = form;

  const {
    fields: hetFields,
    append: appendHet,
  } = useFieldArray({
    control,
    name: 'het_entries',
  });
  const {
    fields: possibleHetFields,
    append: appendPossibleHet,
  } = useFieldArray({
    control,
    name: 'possible_het_entries',
  });

  const speciesId = watch('species_id');
  const fiscalYear = watch('fiscal_year');
  const breedingCategory = watch('breeding_category');
  const pairingFiscalYear = watch('pairing_fiscal_year');
  const pairingId = watch('pairing_id');
  const visualMorphId = watch('visual_morph_id');
  const bloodlineId = watch('bloodline_id');
  const salesCategory = watch('sales_category');
  const hetEntries = watch('het_entries');
  const possibleHetEntries = watch('possible_het_entries');
  const selectedPairingKey = pairingFiscalYear && pairingId ? `${pairingFiscalYear}|${pairingId}` : '';
  const pairingSelected = Boolean(selectedPairingKey);
  const isPurchaseIndividual = breedingCategory === '1';
  const isSelfBreeding = breedingCategory === '0';
  const showSalesTo = salesCategory === '2';
  const showSalesPricing = salesCategory === '1' || salesCategory === '2';

  const filteredPairings = useMemo(
    () =>
      pairingList
        .filter(
          (pairing) =>
            pairing.species_id === speciesId &&
            (!pairingFiscalYear || String(pairing.fiscal_year) === pairingFiscalYear)
        )
        .sort((a, b) => {
          const yearDiff = (b.fiscal_year ?? 0) - (a.fiscal_year ?? 0);
          if (yearDiff !== 0) {
            return yearDiff;
          }
          return (a.pairing_id ?? '').localeCompare(b.pairing_id ?? '');
        }),
    [pairingFiscalYear, pairingList, speciesId]
  );

  const filteredMorphs = useMemo(
    () =>
      morphList
        .filter((morph) => morph.species_id === speciesId)
        .sort((a, b) => a.morph_id.localeCompare(b.morph_id)),
    [morphList, speciesId]
  );

  const recessiveMorphs = useMemo(
    () => filteredMorphs.filter((morph) => morph.inheritance_category === '1'),
    [filteredMorphs]
  );

  const filteredBloodlines = useMemo(
    () =>
      bloodlineList
        .filter((bloodline) => bloodline.species_id === speciesId && bloodline.morph_id === visualMorphId)
        .sort((a, b) => a.bloodline_id.localeCompare(b.bloodline_id)),
    [bloodlineList, speciesId, visualMorphId]
  );

  useEffect(() => {
    if (hetFields.length === 0) {
      appendHet(emptyHetEntry());
      return;
    }

    const lastEntry = hetEntries?.[hetEntries.length - 1];
    if (lastEntry && lastEntry.morph_id.trim() !== '') {
      appendHet(emptyHetEntry());
    }
  }, [appendHet, hetEntries, hetFields.length]);

  useEffect(() => {
    if (possibleHetFields.length === 0) {
      appendPossibleHet(emptyPossibleHetEntry());
      return;
    }

    const lastEntry = possibleHetEntries?.[possibleHetEntries.length - 1];
    if (lastEntry && lastEntry.morph_id.trim() !== '') {
      appendPossibleHet(emptyPossibleHetEntry());
    }
  }, [appendPossibleHet, possibleHetEntries, possibleHetFields.length]);

  const clearPairingSelection = () => {
    setValue('pairing_id', '', { shouldDirty: true, shouldValidate: true });
    setValue('male_parent_id', '', { shouldDirty: true, shouldValidate: true });
    setValue('female_parent_id', '', { shouldDirty: true, shouldValidate: true });
  };

  const clearMorphSelections = () => {
    setValue('visual_morph_id', '', { shouldDirty: true, shouldValidate: true });
    setValue('bloodline_id', '', { shouldDirty: true, shouldValidate: true });
    setValue(
      'het_entries',
      [emptyHetEntry()],
      { shouldDirty: true, shouldValidate: true }
    );
    setValue(
      'possible_het_entries',
      [emptyPossibleHetEntry()],
      { shouldDirty: true, shouldValidate: true }
    );
  };

  const handlePairingFiscalYearChange = (value: string) => {
    setValue('pairing_fiscal_year', value, { shouldDirty: true, shouldValidate: true });
    clearPairingSelection();
  };

  const handlePairingChange = (value: string) => {
    if (!value) {
      clearPairingSelection();
      return;
    }

    const [selectedFiscalYear, selectedPairingId] = value.split('|');
    const selected = filteredPairings.find(
      (pairing) =>
        String(pairing.fiscal_year) === selectedFiscalYear && pairing.pairing_id === selectedPairingId
    );

    if (!selected) {
      return;
    }

    setValue('pairing_fiscal_year', selectedFiscalYear, { shouldDirty: true, shouldValidate: true });
    setValue('pairing_id', selectedPairingId, { shouldDirty: true, shouldValidate: true });
    setValue('male_parent_id', selected.male_parent_id, { shouldDirty: true, shouldValidate: true });
    setValue('female_parent_id', selected.female_parent_id, { shouldDirty: true, shouldValidate: true });
  };

  const handleHetChange = (index: number, value: string) => {
    setValue(`het_entries.${index}.morph_id`, value, { shouldDirty: true, shouldValidate: true });
    if (value && index === hetFields.length - 1) {
      appendHet(emptyHetEntry());
    }
  };

  const handlePossibleHetChange = (index: number, value: string) => {
    setValue(`possible_het_entries.${index}.morph_id`, value, { shouldDirty: true, shouldValidate: true });
    if (value && index === possibleHetFields.length - 1) {
      appendPossibleHet(emptyPossibleHetEntry());
    }
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
                setValue('pairing_fiscal_year', fiscalYear, { shouldDirty: true, shouldValidate: true });
                clearPairingSelection();
                clearMorphSelections();
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
            登録年度
            <select
              {...register('fiscal_year')}
              onChange={(event) => {
                const value = event.target.value;
                setValue('fiscal_year', value, { shouldDirty: true, shouldValidate: true });
                setValue('pairing_fiscal_year', value, { shouldDirty: true, shouldValidate: true });
                clearPairingSelection();
              }}
            >
              {fiscalYearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.fiscal_year ? <p className={adminStyles.fieldError}>{errors.fiscal_year.message}</p> : null}
          </label>
        </>
      ) : (
        <>
          <input type="hidden" {...register('species_id')} />
          <input type="hidden" {...register('fiscal_year')} />
          <input type="hidden" {...register('id')} />
        </>
      )}

      <label className={adminStyles.field}>
        繁殖区分
        <select
          {...register('breeding_category')}
          onChange={(event) => {
            const value = event.target.value;
            setValue('breeding_category', value, { shouldDirty: true, shouldValidate: true });

            if (value === '1') {
              setValue('pairing_fiscal_year', '', { shouldDirty: true, shouldValidate: true });
              clearPairingSelection();
              setValue('breeder', '', { shouldDirty: true });
              setValue('hatch_date', '', { shouldDirty: true, shouldValidate: true });
              return;
            }

            setValue('breeder', '自家繁殖', { shouldDirty: true });
            setValue('pairing_fiscal_year', fiscalYear, { shouldDirty: true, shouldValidate: true });
            setValue('hatch_date', new Date().toISOString().slice(0, 10), {
              shouldDirty: true,
              shouldValidate: true,
            });
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

      {isSelfBreeding ? (
        <>
          <label className={adminStyles.field}>
            ペアリング年度
            <select value={pairingFiscalYear} onChange={(event) => handlePairingFiscalYearChange(event.target.value)}>
              {fiscalYearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.pairing_fiscal_year ? (
              <p className={adminStyles.fieldError}>{errors.pairing_fiscal_year.message}</p>
            ) : null}
          </label>

          <label className={adminStyles.field}>
            ペアリングID
            <select value={selectedPairingKey} onChange={(event) => handlePairingChange(event.target.value)}>
              <option value="">選択してください</option>
              {filteredPairings.map((pairing) => {
                const optionKey = `${pairing.fiscal_year}|${pairing.pairing_id}`;
                return (
                  <option key={optionKey} value={optionKey}>
                    {`${pairing.fiscal_year} / ${pairing.pairing_id} (M:${pairing.male_parent_id} F:${pairing.female_parent_id})`}
                  </option>
                );
              })}
            </select>
            {errors.pairing_id ? <p className={adminStyles.fieldError}>{errors.pairing_id.message}</p> : null}
          </label>

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
        </>
      ) : null}

      <label className={adminStyles.field}>
        モルフ
        <select
          {...register('visual_morph_id')}
          value={visualMorphId}
          onChange={(event) => {
            setValue('visual_morph_id', event.target.value, { shouldDirty: true, shouldValidate: true });
            setValue('bloodline_id', '', { shouldDirty: true, shouldValidate: true });
          }}
        >
          <option value="">選択してください</option>
          {filteredMorphs.map((morph) => (
            <option key={`${morph.species_id}-${morph.morph_id}`} value={morph.morph_id}>
              {morph.morph_name}
            </option>
          ))}
        </select>
        {errors.visual_morph_id ? <p className={adminStyles.fieldError}>{errors.visual_morph_id.message}</p> : null}
      </label>

      <label className={adminStyles.field}>
        血統
        <select
          {...register('bloodline_id')}
          value={bloodlineId}
          onChange={(event) => setValue('bloodline_id', event.target.value, { shouldDirty: true, shouldValidate: true })}
          disabled={!visualMorphId}
        >
          <option value="">選択してください</option>
          {filteredBloodlines.map((bloodline) => (
            <option
              key={`${bloodline.species_id}-${bloodline.morph_id}-${bloodline.bloodline_id}`}
              value={bloodline.bloodline_id}
            >
              {bloodline.bloodline_name}
            </option>
          ))}
        </select>
      </label>

      <div className={adminStyles.field}>
        <span>ヘテロ</span>
        <div className={adminStyles.stack}>
          {hetFields.map((field, index) => (
            <div key={field.id} className={adminStyles.formGrid}>
              <label className={adminStyles.field}>
                {index === 0 ? 'ヘテロ1' : `ヘテロ${index + 1}`}
                <select
                  {...register(`het_entries.${index}.morph_id` as const)}
                  onChange={(event) => handleHetChange(index, event.target.value)}
                >
                  <option value="">選択してください</option>
                  {recessiveMorphs.map((morph) => (
                    <option key={`${morph.species_id}-${morph.morph_id}`} value={morph.morph_id}>
                      {morph.morph_name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ))}
          {errors.het_entries?.message ? (
            <p className={adminStyles.fieldError}>{errors.het_entries.message}</p>
          ) : null}
        </div>
      </div>

      <div className={adminStyles.field}>
        <span>Possヘテロ</span>
        <div className={adminStyles.stack}>
          {possibleHetFields.map((field, index) => (
            <div key={field.id} className={adminStyles.formGrid}>
              <label className={adminStyles.field}>
                {index === 0 ? 'Possヘテロ1' : `Possヘテロ${index + 1}`}
                <select
                  {...register(`possible_het_entries.${index}.morph_id` as const)}
                  onChange={(event) => handlePossibleHetChange(index, event.target.value)}
                >
                  <option value="">選択してください</option>
                  {recessiveMorphs.map((morph) => (
                    <option key={`${morph.species_id}-${morph.morph_id}`} value={morph.morph_id}>
                      {morph.morph_name}
                    </option>
                  ))}
                </select>
                {errors.possible_het_entries?.[index]?.morph_id ? (
                  <p className={adminStyles.fieldError}>{errors.possible_het_entries[index]?.morph_id?.message}</p>
                ) : null}
              </label>

              <label className={adminStyles.field}>
                Poss率(%)
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  {...register(`possible_het_entries.${index}.possible_het_percentage` as const)}
                />
                {errors.possible_het_entries?.[index]?.possible_het_percentage ? (
                  <p className={adminStyles.fieldError}>
                    {errors.possible_het_entries[index]?.possible_het_percentage?.message}
                  </p>
                ) : null}
              </label>
            </div>
          ))}
          {errors.possible_het_entries?.message ? (
            <p className={adminStyles.fieldError}>{errors.possible_het_entries.message}</p>
          ) : null}
        </div>
      </div>

      <label className={adminStyles.field}>
        遺伝性区分
        <select disabled value={filteredMorphs.find((morph) => morph.morph_id === visualMorphId)?.inheritance_category ?? ''}>
          <option value="">-</option>
          {inheritanceCategoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className={adminStyles.field}>
        性別区分
        <select {...register('gender_category')}>
          {genderCategoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className={adminStyles.field}>
        ブリーダー
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
            購入日
            <input type="date" {...register('purchase_date')} />
          </label>

          <label className={adminStyles.field}>
            購入価格
            <input type="number" step="0.01" {...register('purchase_price')} />
          </label>
        </>
      ) : null}

      <label className={adminStyles.field}>
        販売区分
        <select
          {...register('sales_category')}
          onChange={(event) => {
            const value = event.target.value;
            setValue('sales_category', value, { shouldDirty: true, shouldValidate: true });
            if (value !== '2') {
              setValue('sales_to', '', { shouldDirty: true });
              setValue('sales_date', '', { shouldDirty: true });
            }
            if (value === '0') {
              setValue('sales_price_tax_ex', '', { shouldDirty: true });
              setValue('sales_price_tax', '', { shouldDirty: true });
              setValue('sales_price_tax_in', '', { shouldDirty: true });
            }
          }}
        >
          {salesCategoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {showSalesTo ? (
        <label className={adminStyles.field}>
          販売先
          <input {...register('sales_to')} />
        </label>
      ) : null}

      {showSalesTo ? (
        <label className={adminStyles.field}>
          販売日
          <input type="date" {...register('sales_date')} />
        </label>
      ) : null}

      {showSalesPricing ? (
        <>
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
        </>
      ) : null}

      {mode === 'edit' ? (
        <label className={adminStyles.field}>
          死亡日
          <input type="date" {...register('death_date')} />
        </label>
      ) : null}

      <label className={adminStyles.field}>
        メモ
        <textarea {...register('note')} />
      </label>
    </div>
  );
};
