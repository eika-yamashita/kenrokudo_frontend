import { useNavigate } from 'react-router-dom';
import { adminStyles } from '../../../shared/ui/admin';
import type { ReturnNavigationState } from '../../../shared/utils/returnNavigation';
import { useIndividualImagesQuery, useIndividualQuery } from '../../individuals/hooks/useIndividualQueries';
import { getIndividualMorphDisplay } from '../../individuals/utils/getIndividualMorphDisplay';
import styles from '../screens/PairingDetailScreen.module.css';

type Props = {
  label: 'オス親' | 'メス親';
  speciesId: string;
  individualId: string;
  returnState: ReturnNavigationState;
};

export const PairingParentCard = ({ label, speciesId, individualId, returnState }: Props) => {
  const navigate = useNavigate();
  const individualQuery = useIndividualQuery(speciesId, individualId);
  const imagesQuery = useIndividualImagesQuery(speciesId, individualId);
  const primaryImage = imagesQuery.data?.find((image) => image.is_primary) ?? imagesQuery.data?.[0];
  const morph = individualQuery.data ? getIndividualMorphDisplay(individualQuery.data) || '-' : '-';

  const renderImage = () => {
    if (individualQuery.isLoading || imagesQuery.isLoading) {
      return <div className={styles.parentImageMessage}>読み込み中...</div>;
    }

    if (individualQuery.error) {
      return <div className={styles.parentImageMessage}>個体情報が見つかりません</div>;
    }

    if (imagesQuery.error) {
      return <div className={styles.parentImageMessage}>画像を読み込めません</div>;
    }

    if (!primaryImage) {
      return <div className={styles.parentImageMessage}>NO IMAGE</div>;
    }

    return <img src={primaryImage.public_url} alt={`${label} ${individualId}`} />;
  };

  return (
    <section className={styles.parentCard} aria-label={`${label} ${individualId}`}>
      <h2>{label}</h2>
      <button
        type="button"
        className={adminStyles.textLinkButton}
        onClick={() => navigate(`/admin/individuals/detail/${speciesId}/${individualId}`, { state: returnState })}
      >
        {individualId}
      </button>
      <div className={styles.parentImage}>{renderImage()}</div>
      <p className={styles.parentMorph}>{morph}</p>
    </section>
  );
};
