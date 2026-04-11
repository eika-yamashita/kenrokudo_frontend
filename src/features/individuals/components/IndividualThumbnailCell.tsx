import { adminStyles } from '../../../shared/ui/admin';
import { useIndividualImagesQuery } from '../hooks/useIndividualQueries';

type Props = {
  speciesId: string;
  id: string;
  density?: 'default' | 'compact';
};

export const IndividualThumbnailCell = ({ speciesId, id, density = 'default' }: Props) => {
  const imagesQuery = useIndividualImagesQuery(speciesId, id);
  const thumbClassName = `${adminStyles.thumb} ${density === 'compact' ? adminStyles.thumbCompact : ''}`;

  if (imagesQuery.isLoading) {
    return <div className={`${thumbClassName} ${adminStyles.thumbPlaceholder}`}>Loading</div>;
  }

  const primaryImage = imagesQuery.data?.find((image) => image.is_primary) ?? imagesQuery.data?.[0];

  return primaryImage ? (
    <img className={thumbClassName} src={primaryImage.public_url} alt={`${speciesId}-${id}`} />
  ) : (
    <div className={`${thumbClassName} ${adminStyles.thumbPlaceholder}`}>No Image</div>
  );
};
