import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div className="home-page home-styled">
      <section className="home-hero-banner">
        <div className="hero-overlay" />
        <img className="hero-banner-image" src="/reopa1.jpg" alt="Leopard gecko portrait" />
        <div className="hero-banner-content">
          <h1>
            絢禄堂
            <br />
            KENROKUDO
          </h1>
        </div>
      </section>
    </div>
  );
};

