import { useNavigate, useParams } from 'react-router-dom';
import { useIndividualEditor } from '../hooks/useIndividualEditor';

export const IndividualEditorPage = () => {
  const { species_cd: speciesCd, id } = useParams<{
    species_cd: string;
    id: string;
  }>();
  const navigate = useNavigate();

  const { individual, updateField, save, loading, saving, error } = useIndividualEditor({
    species: speciesCd!,
    individualId: id!,
  });

  if (loading) return <div className="status-message">Loading...</div>;
  if (!individual) return <div className="status-message">No data</div>;

  return (
    <div className="admin-page">
      <div className="page-heading">
        <button className="ghost-button" onClick={() => navigate('/admin')}>
          一覧へ戻る
        </button>
        <h1>個体情報の編集</h1>
        <p>
          種コード: <strong>{individual.species_cd}</strong> / 個体ID: <strong>{individual.id}</strong>
        </p>
      </div>

      <div className="admin-form compact-form">
        <label>
          モルフ
          <input
            value={individual.morph ?? ''}
            onChange={(e) => updateField('morph', e.target.value)}
          />
        </label>
      </div>

      <div className="form-actions">
        <button className="primary-button" onClick={save} disabled={saving}>
          {saving ? '保存中...' : '保存する'}
        </button>
      </div>

      {error && <div className="status-message error-message">{error}</div>}
    </div>
  );
};
