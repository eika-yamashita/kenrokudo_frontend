import { Link } from 'react-router-dom';
import type { Individual } from '../api/models/Individual';

type Props = {
  individuals: Individual[];
};

export const IndividualList = ({ individuals }: Props) => {
  return (
    <div className="admin-page">
      <div className="page-heading">
        <h1>管理画面トップ</h1>
        <p>登録済みの個体情報を一覧し、必要に応じて追加や編集を行います。</p>
      </div>
      <div className="toolbar">
        <Link className="primary-button" to="/admin/new">
          新規登録
        </Link>
      </div>
      <div className="table-wrap">
        <table className="individual-table">
          <thead>
            <tr>
              <th>種コード</th>
              <th>ID</th>
              <th>モルフ</th>
              <th>性別</th>
              <th>繁殖区分</th>
              <th>編集</th>
            </tr>
          </thead>
          <tbody>
            {individuals.map((i) => (
              <tr key={`${i.species_cd}-${i.id}`}>
                <td data-label="種コード">{i.species_cd}</td>
                <td data-label="ID">{i.id}</td>
                <td data-label="モルフ">{i.morph ?? '-'}</td>
                <td data-label="性別">{i.gender_category ?? '-'}</td>
                <td data-label="繁殖区分">{i.breeding_category ?? '-'}</td>
                <td data-label="編集">
                  <Link to={`/admin/edit/${i.species_cd}/${i.id}`}>編集</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
