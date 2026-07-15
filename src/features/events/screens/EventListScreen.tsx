import { useNavigate } from 'react-router-dom';
import type { ExhibitionEvent } from '../../../api/models/ExhibitionEvent';
import { AdminPageLayout, DataTable, PageHeader, StatusBanner, adminStyles } from '../../../shared/ui/admin';
import { useEventsQuery } from '../hooks/useEventQueries';

const formatTimeRange = (event: ExhibitionEvent) => {
  if (event.start_time && event.end_time) return `${event.start_time} - ${event.end_time}`;
  if (event.start_time) return event.start_time;
  if (event.end_time) return `- ${event.end_time}`;
  return '-';
};

export const EventListScreen = () => {
  const navigate = useNavigate();
  const eventsQuery = useEventsQuery();

  if (eventsQuery.isLoading) {
    return <StatusBanner>読み込み中...</StatusBanner>;
  }

  if (eventsQuery.error) {
    return <StatusBanner tone="error">{eventsQuery.error.message}</StatusBanner>;
  }

  return (
    <AdminPageLayout>
      <PageHeader
        title="出店イベント"
        actions={
          <div className={adminStyles.inlineActions}>
            <button className={adminStyles.buttonGhost} onClick={() => navigate('/admin')}>
              戻る
            </button>
            <button className={adminStyles.button} onClick={() => navigate('/admin/events/new')}>
              新規登録
            </button>
          </div>
        }
      />

      <DataTable<ExhibitionEvent>
        columns={[
          { key: 'event_date', header: '日付', renderCell: (event) => event.event_date },
          { key: 'area', header: 'エリア', renderCell: (event) => event.area || '-' },
          { key: 'time', header: '時間', renderCell: formatTimeRange },
          { key: 'event_name', header: 'イベント名', renderCell: (event) => event.event_name },
          { key: 'venue', header: '場所', renderCell: (event) => event.venue || '-' },
          { key: 'is_published', header: '公開', renderCell: (event) => (event.is_published ? '公開' : '非公開') },
        ]}
        rows={eventsQuery.data ?? []}
        emptyMessage="出店イベントはまだ登録されていません"
        getRowKey={(event) => String(event.event_id)}
        onRowClick={(event) => event.event_id && navigate(`/admin/events/edit/${event.event_id}`)}
      />
    </AdminPageLayout>
  );
};
