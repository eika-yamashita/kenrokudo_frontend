import { useParams } from 'react-router-dom';
import { PairingUpsertScreen } from '../features/pairings/screens/PairingUpsertScreen';
import { StatusBanner } from '../shared/ui/admin';

export const PairingEditorPage = () => {
  const {
    species_id: speciesId,
    fiscal_year: fiscalYearParam,
    pairing_id: pairingId,
  } = useParams<{ species_id: string; fiscal_year: string; pairing_id: string }>();
  const fiscalYear = Number(fiscalYearParam);

  if (!speciesId || !pairingId || Number.isNaN(fiscalYear)) {
    return <StatusBanner tone="error">URLパラメータが不正です</StatusBanner>;
  }

  return <PairingUpsertScreen mode="edit" speciesId={speciesId} fiscalYear={fiscalYear} pairingId={pairingId} />;
};
