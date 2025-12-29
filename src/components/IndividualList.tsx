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
            <th>種別CD</th>
            <th>ID</th>
            <th>名前</th>
            <th>編集</th>
          </tr>
        </thead>
        <tbody>
          {individuals.map((i) => (
            <tr key={`${i.speciesCd}-${i.id}`}>
              <td>{i.speciesCd}</td>
              <td>{i.id}</td>
              <td>{i.name ?? '-'}</td>
              <td>
                <Link to={`/edit/${i.speciesCd}/${i.id}`}>編集</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
