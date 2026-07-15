import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ExhibitionEvent } from '../../../api/models/ExhibitionEvent';
import {
  AdminPageLayout,
  FormActions,
  PageHeader,
  StatusBanner,
  adminStyles,
  confirmDeleteByKeyword,
} from '../../../shared/ui/admin';
import {
  useCreateEventMutation,
  useDeleteEventMutation,
  useEventQuery,
  useUpdateEventMutation,
} from '../hooks/useEventQueries';

type Props =
  | { mode: 'create' }
  | { mode: 'edit'; eventId: number };

const emptyEvent: ExhibitionEvent = {
  event_name: '',
  event_date: '',
  area: '',
  start_time: '',
  end_time: '',
  venue: '',
  event_url: '',
  note: '',
  display_order: 0,
  is_published: true,
};

export const EventUpsertScreen = (props: Props) => {
  const navigate = useNavigate();
  const detailQuery = useEventQuery(props.mode === 'edit' ? props.eventId : undefined);
  const createMutation = useCreateEventMutation();
  const updateMutation = useUpdateEventMutation();
  const deleteMutation = useDeleteEventMutation();
  const [form, setForm] = useState<ExhibitionEvent>(emptyEvent);

  useEffect(() => {
    if (props.mode === 'edit' && detailQuery.data) {
      setForm({
        event_id: detailQuery.data.event_id,
        event_name: detailQuery.data.event_name,
        event_date: detailQuery.data.event_date,
        area: detailQuery.data.area ?? '',
        start_time: detailQuery.data.start_time ?? '',
        end_time: detailQuery.data.end_time ?? '',
        venue: detailQuery.data.venue ?? '',
        event_url: detailQuery.data.event_url ?? '',
        note: detailQuery.data.note ?? '',
        display_order: detailQuery.data.display_order ?? 0,
        is_published: detailQuery.data.is_published ?? true,
      });
    }
  }, [detailQuery.data, props.mode]);

  const isSaving = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  const errorMessage =
    detailQuery.error?.message ||
    createMutation.error?.message ||
    updateMutation.error?.message ||
    deleteMutation.error?.message;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: ExhibitionEvent = {
      event_name: form.event_name.trim(),
      event_date: form.event_date,
      area: form.area?.trim() || undefined,
      start_time: form.start_time?.trim() || undefined,
      end_time: form.end_time?.trim() || undefined,
      venue: form.venue?.trim() || undefined,
      event_url: form.event_url?.trim() || undefined,
      note: form.note?.trim() || undefined,
      display_order: Number(form.display_order ?? 0),
      is_published: Boolean(form.is_published),
    };

    if (props.mode === 'create') {
      await createMutation.mutateAsync(payload);
      navigate('/admin/events');
      return;
    }

    await updateMutation.mutateAsync({ eventId: props.eventId, event: payload });
    navigate('/admin/events');
  };

  const handleDelete = async () => {
    if (props.mode !== 'edit') return;
    if (!confirmDeleteByKeyword()) return;
    await deleteMutation.mutateAsync(props.eventId);
    navigate('/admin/events');
  };

  if (props.mode === 'edit' && detailQuery.isLoading) {
    return <StatusBanner>読み込み中...</StatusBanner>;
  }

  return (
    <AdminPageLayout>
      <PageHeader
        title={props.mode === 'create' ? '出店イベント新規登録' : '出店イベント編集'}
        actions={
          <button className={adminStyles.buttonGhost} onClick={() => navigate('/admin/events')}>
            戻る
          </button>
        }
      />

      <form className={adminStyles.stack} onSubmit={handleSubmit}>
        <div className={adminStyles.formGrid}>
          <label className={adminStyles.field}>
            イベント名
            <input
              value={form.event_name}
              onChange={(event) => setForm((current) => ({ ...current, event_name: event.target.value }))}
              required
            />
          </label>

          <label className={adminStyles.field}>
            日付
            <input
              type="date"
              value={form.event_date}
              onChange={(event) => setForm((current) => ({ ...current, event_date: event.target.value }))}
              required
            />
          </label>

          <label className={adminStyles.field}>
            エリア
            <input
              value={form.area ?? ''}
              onChange={(event) => setForm((current) => ({ ...current, area: event.target.value }))}
              placeholder="東京"
            />
          </label>

          <label className={adminStyles.field}>
            開始時間
            <input
              type="time"
              value={form.start_time ?? ''}
              onChange={(event) => setForm((current) => ({ ...current, start_time: event.target.value }))}
            />
          </label>

          <label className={adminStyles.field}>
            終了時間
            <input
              type="time"
              value={form.end_time ?? ''}
              onChange={(event) => setForm((current) => ({ ...current, end_time: event.target.value }))}
            />
          </label>

          <label className={adminStyles.field}>
            場所
            <input
              value={form.venue ?? ''}
              onChange={(event) => setForm((current) => ({ ...current, venue: event.target.value }))}
            />
          </label>

          <label className={adminStyles.field}>
            URL
            <input
              type="url"
              value={form.event_url ?? ''}
              onChange={(event) => setForm((current) => ({ ...current, event_url: event.target.value }))}
            />
          </label>

          <label className={adminStyles.field}>
            表示順
            <input
              type="number"
              value={form.display_order ?? 0}
              onChange={(event) =>
                setForm((current) => ({ ...current, display_order: Number(event.target.value || 0) }))
              }
            />
          </label>

          <label className={adminStyles.field}>
            公開設定
            <select
              value={form.is_published ? 'true' : 'false'}
              onChange={(event) => setForm((current) => ({ ...current, is_published: event.target.value === 'true' }))}
            >
              <option value="true">公開</option>
              <option value="false">非公開</option>
            </select>
          </label>
        </div>

        <label className={adminStyles.field}>
          備考
          <textarea
            value={form.note ?? ''}
            onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
          />
        </label>

        <FormActions>
          <button className={adminStyles.button} type="submit" disabled={isSaving}>
            {isSaving ? '保存中...' : '保存'}
          </button>
          {props.mode === 'edit' ? (
            <button className={adminStyles.buttonDanger} type="button" onClick={() => void handleDelete()} disabled={isSaving}>
              削除
            </button>
          ) : null}
        </FormActions>
      </form>

      {errorMessage ? <StatusBanner tone="error">{errorMessage}</StatusBanner> : null}
    </AdminPageLayout>
  );
};
