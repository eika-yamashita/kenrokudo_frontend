import { useNavigate, useParams } from 'react-router-dom';
import { useIndividualEditor } from '../hooks/useIndividualEditor';

export const IndividualEditorPage = () => {
  const { species_cd: speciesCd, id } = useParams<{
    species_cd: string;
    id: string;
  }>();
  const navigate = useNavigate();

  const {
    individual,
    updateField,
    save,
    loading,
    saving,
    error,
  } = useIndividualEditor({
    species: speciesCd!,
    individualId: id!,
  });

  if (loading) return <div>Loading...</div>;
  if (!individual) return <div>No data</div>;

  return (
    <div>
      <button onClick={() => navigate('/')}>個体情報一覧に戻る</button>
      <h2>個体編集</h2>

      <input
        value={individual.morph ?? ''}
        onChange={(e) => updateField('morph', e.target.value)}
      />

      <button onClick={save} disabled={saving}>
        保存
      </button>

      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};
