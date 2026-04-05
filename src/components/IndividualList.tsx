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
          const key = `${individual.species_id}-${individual.id}`;

          try {
            const images = await getIndividualImages(individual.species_id, individual.id);
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
        <h1>個体一覧</h1>
      </div>
      <div className="toolbar">
        <button className="primary-button" onClick={() => navigate('/admin/new')}>
          新規登録
        </button>
      </div>
      <div className="table-wrap">
        <table className="individual-table">

          <tbody>
            {individuals.map((i) => {
              const imageKey = `${i.species_id}-${i.id}`;
              const imageUrl = imageUrls[imageKey];

              return (
                <tr
                  key={imageKey}
                  className="row-clickable"
                  onClick={() => navigate(`/admin/detail/${i.species_id}/${i.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/admin/detail/${i.species_id}/${i.id}`);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <td data-label="画像">
                    {imageUrl ? (
                      <img className="individual-thumb" src={imageUrl} alt={`${i.species_id}-${i.id}`} />
                    ) : (
                      <div className="individual-thumb placeholder-thumb">No Image</div>
                    )}
                  </td>
                  <td data-label="種名">{speciesNames[i.species_id] ?? i.species_id}</td>
                  <td data-label="ID">{i.id}</td>
                  <td data-label="モルフ">{i.morph ?? '-'}</td>
                  <td data-label="性別">{i.gender_category ?? '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
