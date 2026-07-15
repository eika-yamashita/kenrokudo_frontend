import { useParams } from 'react-router-dom';
import { EventUpsertScreen } from '../features/events/screens/EventUpsertScreen';

type Props = {
  mode: 'create' | 'edit';
};

export const EventUpsertPage = ({ mode }: Props) => {
  const { event_id: eventId } = useParams<{ event_id: string }>();

  if (mode === 'edit') {
    const numericEventId = Number(eventId);
    if (!eventId || Number.isNaN(numericEventId)) {
      return <div>イベントIDが指定されていません。</div>;
    }
    return <EventUpsertScreen mode="edit" eventId={numericEventId} />;
  }

  return <EventUpsertScreen mode="create" />;
};
