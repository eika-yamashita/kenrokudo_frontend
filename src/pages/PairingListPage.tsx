import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPairingList } from '../api/PairingService';
import { getSpeciesList } from '../api/SpeciesService';
import type { Pairing } from '../api/models/Pairing';

export const PairingListPage = () => {
  const navigate = useNavigate();
  const [pairings, setPairings] = useState<Pairing[]>([]);
  const [speciesNames, setSpeciesNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPairings = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pairingList, speciesList] = await Promise.all([getPairingList(), getSpeciesList()]);
      setPairings(pairingList);
      setSpeciesNames(
        Object.fromEntries(
          speciesList.map((item) => [item.species_id, item.common_name || item.japanese_name || item.species_id])
        )
      );
    } catch (e: any) {
      setError(e.message ?? 'ペアリング一覧の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPairings();
  }, []);

  const handleRowNavigate = (pairing: Pairing) => {
    if (!pairing.fiscal_year || !pairing.pairing_id) return;
    navigate(`/admin/pairings/edit/${pairing.species_id}/${pairing.fiscal_year}/${pairing.pairing_id}`);
  };

  if (loading) {
    return <div className="status-message">読み込み中...</div>;
  }

  return (
    <div className="admin-page">
      <div className="page-heading">
        <button className="ghost-button" onClick={() => navigate('/admin')}>
          管理メニューへ戻る
        </button>
        <h1>ペアリング一覧</h1>
      </div>

      <div className="toolbar pairing-toolbar">
        <button className="primary-button" onClick={() => navigate('/admin/pairings/new')}>
          新規登録
        </button>
      </div>

      {error && <div className="status-message error-message">{error}</div>}

      <div className="table-wrap">
        <table className="individual-table pairing-table">
          <thead>
            <tr>
              <th>種名</th>
              <th>種ID</th>
              <th>年度</th>
              <th>ペアリングID</th>
              <th>オス親ID</th>
              <th>メス親ID</th>
              <th>ペアリング日</th>
              <th>備考</th>
            </tr>
          </thead>
          <tbody>
            {pairings.length === 0 && (
              <tr>
                <td colSpan={8}>ペアリング情報は未登録です</td>
              </tr>
            )}
            {pairings.map((pairing) => (
              <tr
                key={`${pairing.species_id}-${pairing.fiscal_year}-${pairing.pairing_id}`}
                className="row-clickable"
                onClick={() => handleRowNavigate(pairing)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleRowNavigate(pairing);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <td>{speciesNames[pairing.species_id] ?? pairing.species_id}</td>
                <td>{pairing.species_id}</td>
                <td>{pairing.fiscal_year ?? '-'}</td>
                <td>{pairing.pairing_id ?? '-'}</td>
                <td>{pairing.male_parent_id}</td>
                <td>{pairing.female_parent_id}</td>
                <td>{pairing.pairing_date}</td>
                <td className="pairing-note-cell">{pairing.note || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
