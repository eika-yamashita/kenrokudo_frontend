import styles from './HomeScreen.module.css';

export const HomeScreen = () => {
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
              KENROKUDO
            </h1>
          </div>
        </div>
      </section>
    </div>
  );
};
