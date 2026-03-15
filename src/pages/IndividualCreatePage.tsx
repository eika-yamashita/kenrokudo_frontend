import { useNavigate } from 'react-router-dom';
import { useIndividualCreator } from '../hooks/useIndividualCreator';

export const IndividualCreatePage = () => {
  const navigate = useNavigate();
  const { individual, updateField, save, saving, error } = useIndividualCreator();

  const handleSubmit = async () => {
    try {
      await save();
      navigate('/admin');
    } catch (e) {
      // error state is handled inside the hook
    }
  };

  return (
    <div className="admin-page">
      <div className="page-heading">
        <button className="ghost-button" onClick={() => navigate('/admin')}>
          一覧へ戻る
        </button>
        <h1>個体の新規登録</h1>
        <p>管理画面から新しい個体情報を登録します。</p>
      </div>

      <div className="admin-form">
        <label>
          種コード
          <input
            value={individual.species_cd}
            onChange={(e) => updateField('species_cd', e.target.value)}
          />
        </label>
        <label>
          個体ID
          <input value={individual.id} onChange={(e) => updateField('id', e.target.value)} />
        </label>
        <label>
          オス親ID
          <input
            value={individual.male_parent_id ?? ''}
            onChange={(e) => updateField('male_parent_id', e.target.value)}
          />
        </label>
        <label>
          メス親ID
          <input
            value={individual.female_parent_id ?? ''}
            onChange={(e) => updateField('female_parent_id', e.target.value)}
          />
        </label>
        <label>
          モルフ
          <input
            value={individual.morph ?? ''}
            onChange={(e) => updateField('morph', e.target.value)}
          />
        </label>
        <label>
          血統
          <input
            value={individual.bloodline ?? ''}
            onChange={(e) => updateField('bloodline', e.target.value)}
          />
        </label>
        <label>
          性別区分 (M/F/U)
          <input
            value={individual.gender_category ?? ''}
            onChange={(e) => updateField('gender_category', e.target.value)}
          />
        </label>
        <label>
          繁殖区分 (A/B)
          <input
            value={individual.breeding_category ?? ''}
            onChange={(e) => updateField('breeding_category', e.target.value)}
          />
        </label>
        <label>
          ブリーダー名
          <input
            value={individual.breeder ?? ''}
            onChange={(e) => updateField('breeder', e.target.value)}
          />
        </label>
        <label>
          クラッチ日
          <input
            type="date"
            value={individual.clutch_date ?? ''}
            onChange={(e) => updateField('clutch_date', e.target.value)}
          />
        </label>
        <label>
          ハッチ日
          <input
            type="date"
            value={individual.hatch_date ?? ''}
            onChange={(e) => updateField('hatch_date', e.target.value)}
          />
        </label>
        <label>
          購入元
          <input
            value={individual.purchase_from ?? ''}
            onChange={(e) => updateField('purchase_from', e.target.value)}
          />
        </label>
        <label>
          購入価格
          <input
            type="number"
            step="0.01"
            value={individual.purchase_price ?? ''}
            onChange={(e) =>
              updateField(
                'purchase_price',
                e.target.value === '' ? undefined : Number(e.target.value)
              )
            }
          />
        </label>
        <label>
          購入日
          <input
            type="date"
            value={individual.purchase_date ?? ''}
            onChange={(e) => updateField('purchase_date', e.target.value)}
          />
        </label>
        <label>
          販売区分
          <input
            value={individual.sales_category ?? ''}
            onChange={(e) => updateField('sales_category', e.target.value)}
          />
        </label>
        <label>
          販売先
          <input
            value={individual.sales_to ?? ''}
            onChange={(e) => updateField('sales_to', e.target.value)}
          />
        </label>
        <label>
          販売価格(税抜)
          <input
            type="number"
            step="0.01"
            value={individual.sales_price_tax_ex ?? ''}
            onChange={(e) =>
              updateField(
                'sales_price_tax_ex',
                e.target.value === '' ? undefined : Number(e.target.value)
              )
            }
          />
        </label>
        <label>
          消費税額
          <input
            type="number"
            step="0.01"
            value={individual.sales_price_tax ?? ''}
            onChange={(e) =>
              updateField(
                'sales_price_tax',
                e.target.value === '' ? undefined : Number(e.target.value)
              )
            }
          />
        </label>
        <label>
          販売価格(税込)
          <input
            type="number"
            step="0.01"
            value={individual.sales_price_tax_in ?? ''}
            onChange={(e) =>
              updateField(
                'sales_price_tax_in',
                e.target.value === '' ? undefined : Number(e.target.value)
              )
            }
          />
        </label>
        <label>
          販売日
          <input
            type="date"
            value={individual.sales_date ?? ''}
            onChange={(e) => updateField('sales_date', e.target.value)}
          />
        </label>
        <label>
          死亡日
          <input
            type="date"
            value={individual.death_date ?? ''}
            onChange={(e) => updateField('death_date', e.target.value)}
          />
        </label>
        <label>
          メモ
          <textarea value={individual.note ?? ''} onChange={(e) => updateField('note', e.target.value)} />
        </label>
        <label>
          作成者
          <input
            value={individual.create_user}
            onChange={(e) => updateField('create_user', e.target.value)}
          />
        </label>
        <label>
          作成日時
          <input
            type="datetime-local"
            value={individual.create_at}
            onChange={(e) => updateField('create_at', e.target.value)}
          />
        </label>
      </div>

      <div className="form-actions">
        <button className="primary-button" onClick={handleSubmit} disabled={saving}>
          {saving ? '登録中...' : '登録する'}
        </button>
      </div>

      {error && <div className="status-message error-message">{error}</div>}
    </div>
  );
};
