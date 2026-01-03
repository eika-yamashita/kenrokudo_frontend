import { useNavigate } from 'react-router-dom';
import { useIndividualCreator } from '../hooks/useIndividualCreator';

export const IndividualCreatePage = () => {
  const navigate = useNavigate();
  const { individual, updateField, save, saving, error } = useIndividualCreator();

  const handleSubmit = async () => {
    try {
      await save();
      navigate('/');
    } catch (e) {
      // error state is handled inside the hook
    }
  };

  return (
    <div>
      <button onClick={() => navigate('/')}>個体情報一覧に戻る</button>
      <h2>個体新規登録</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}>
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
          モルフ
          <input
            value={individual.morph ?? ''}
            onChange={(e) => updateField('morph', e.target.value)}
          />
        </label>
        <label>
          雌雄区分 (M/F/U)
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
          登録者
          <input
            value={individual.create_user}
            onChange={(e) => updateField('create_user', e.target.value)}
          />
        </label>
        <label>
          登録日時
          <input
            type="datetime-local"
            value={individual.create_at}
            onChange={(e) => updateField('create_at', e.target.value)}
          />
        </label>
      </div>

      <button onClick={handleSubmit} disabled={saving} style={{ marginTop: 16 }}>
        登録
      </button>

      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};
