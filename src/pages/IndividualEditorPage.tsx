import { useParams } from 'react-router-dom';
import { useIndividualEditor } from '../hooks/useIndividualEditor';

export const IndividualEditorPage = () => {
  const { species, id } = useParams<{
    species: string;
    id: string;
  }>();

  const {
    individual,
    updateField,
    save,
    loading,
    saving,
    error,
  } = useIndividualEditor({
    species: species!,
    individualId: id!,
  });

  if (loading) return <div>Loading...</div>;
  if (!individual) return <div>No data</div>;

  return (
    <div>
      <h2>個体編集</h2>

      <input
        value={individual.name}
        onChange={(e) => updateField('name', e.target.value)}
      />

      <button onClick={save} disabled={saving}>
        保存
      </button>

      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};
