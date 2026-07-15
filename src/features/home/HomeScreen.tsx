import { useUpcomingEventsQuery } from '../events/hooks/useEventQueries';
import styles from './HomeScreen.module.css';

const formatEventDate = (value: string) => {
  const [year, month, day] = value.split('-');
  if (!year || !month || !day) return value;
  return `${year}. ${month}. ${day}`;
};

export const HomeScreen = () => {
  const eventsQuery = useUpcomingEventsQuery(3);
  const events = eventsQuery.data ?? [];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <img className={styles.heroImage} src="/reopa1.jpg" alt="Leopard gecko portrait" />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1>
              絢禄堂
              <br />
              -KENROKUDO-
            </h1>
          </div>
        </div>
      </section>

      <section className={styles.eventSection} aria-labelledby="event-heading">
        <div className={styles.eventInner}>
          <h2 id="event-heading">出店イベント</h2>
          {events.length > 0 ? (
            <ul className={styles.eventList}>
              {events.map((event) => {
                const eventLabel = event.area ? `${event.area}｜${event.event_name}` : event.event_name;
                const content = (
                  <>
                    <time dateTime={event.event_date}>{formatEventDate(event.event_date)}</time>
                    <strong>{eventLabel}</strong>
                  </>
                );

                return (
                  <li key={event.event_id ?? `${event.event_date}-${event.event_name}`}>
                    {event.event_url ? (
                      <a href={event.event_url} target="_blank" rel="noreferrer">
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className={styles.eventNotice}>
              <p>{eventsQuery.isLoading ? '出店イベントを読み込み中です。' : '出店予定は随時更新いたします。'}</p>
            </div>
          )}
        </div>
      </section>

      <footer className={styles.footer}>
        <nav className={styles.contactList} aria-label="Contact information">
          <a href="https://line.me/R/ti/p/@kenrokudo" target="_blank" rel="noreferrer">
            LINE
          </a>
          <a href="tel:09020156826">TEL</a>
        </nav>
        <p className={styles.copyright}>Copyright &copy; KENROKUDO. All Rights Reserved.</p>
      </footer>
    </div>
  );
};
