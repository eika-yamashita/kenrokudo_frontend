import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIndividualImages } from '../api/IndividualImageService';
import { getSpeciesList } from '../api/SpeciesService';
import type { Individual } from '../api/models/Individual';

type Props = {
  individuals: Individual[];
};

export const IndividualList = ({ individuals }: Props) => {
  const navigate = useNavigate();
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [speciesNames, setSpeciesNames] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;

    const loadImages = async () => {
      const entries = await Promise.all(
        individuals.map(async (individual) => {
          const key = `${individual.species_cd}-${individual.id}`;

          try {
            const images = await getIndividualImages(individual.species_cd, individual.id);
            const primaryImage = images.find((image) => image.is_primary) ?? images[0];
            return [key, primaryImage?.public_url ?? ''] as const;
          } catch {
            return [key, ''] as const;
          }
        })
      );

      if (!cancelled) {
        setImageUrls(Object.fromEntries(entries));
      }
    };

    loadImages();

    return () => {
      cancelled = true;
    };
  }, [individuals]);

  useEffect(() => {
    let cancelled = false;

    const loadSpecies = async () => {
      try {
        const species = await getSpeciesList();
        if (!cancelled) {
          setSpeciesNames(
            Object.fromEntries(
              species.map((item) => [item.species_id, item.common_name || item.japanese_name || item.species_id])
            )
          );
        }
      } catch {
        if (!cancelled) {
          setSpeciesNames({});
        }
      }
    };

    loadSpecies();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="admin-page">
      <div className="page-heading">
        <h1>管理画面トップ</h1>
        <p>登録済みの個体情報を一覧し、必要に応じて追加や編集を行います。</p>
      </div>
      <div className="toolbar">
        <button className="primary-button" onClick={() => navigate('/admin/new')}>
          新規登録
        </button>
      </div>
      <div className="table-wrap">
        <table className="individual-table">
          <thead>
            <tr>
              <th>画像</th>
              <th>種名</th>
              <th>ID</th>
              <th>モルフ</th>
              <th>性別</th>
              <th>繁殖区分</th>
            </tr>
          </thead>
          <tbody>
            {individuals.map((i) => {
              const imageKey = `${i.species_cd}-${i.id}`;
              const imageUrl = imageUrls[imageKey];

              return (
                <tr
                  key={imageKey}
                  className="row-clickable"
                  onClick={() => navigate(`/admin/detail/${i.species_cd}/${i.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/admin/detail/${i.species_cd}/${i.id}`);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <td data-label="画像">
                    {imageUrl ? (
                      <img className="individual-thumb" src={imageUrl} alt={`${i.species_cd}-${i.id}`} />
                    ) : (
                      <div className="individual-thumb placeholder-thumb">No Image</div>
                    )}
                  </td>
                  <td data-label="種名">{speciesNames[i.species_cd] ?? i.species_cd}</td>
                  <td data-label="ID">{i.id}</td>
                  <td data-label="モルフ">{i.morph ?? '-'}</td>
                  <td data-label="性別">{i.gender_category ?? '-'}</td>
                  <td data-label="繁殖区分">{i.breeding_category ?? '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
