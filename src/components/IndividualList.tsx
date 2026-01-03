// src/components/IndividualList.tsx
import { Link } from 'react-router-dom';
import type { Individual } from '../api/models/Individual';

type Props = {
  individuals: Individual[];
};

export const IndividualList = ({ individuals }: Props) => {
  return (
    <div>
      <h2>個体情報一覧</h2>
      <table border={1} cellPadding={6} cellSpacing={0}>
        <thead>
          <tr>
            <th>種コード</th>
            <th>ID</th>
            <th>モルフ</th>
            <th>雌雄区分</th>
            <th>繁殖区分</th>
            <th>編集</th>
          </tr>
        </thead>
        <tbody>
          {individuals.map((i) => (
            <tr key={`${i.species_cd}-${i.id}`}>
              <td>{i.species_cd}</td>
              <td>{i.id}</td>
              <td>{i.morph ?? '-'}</td>
              <td>{i.gender_category ?? '-'}</td>
              <td>{i.breeding_category ?? '-'}</td>
              <td>
                <Link to={`/edit/${i.species_cd}/${i.id}`}>編集</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
