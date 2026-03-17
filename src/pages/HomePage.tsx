import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div className="home-page home-styled">
      <section className="home-hero-banner">
        <div className="hero-overlay" />
        <img className="hero-banner-image" src="/reopa1.jpg" alt="Leopard gecko portrait" />
        <div className="hero-banner-content">
          <p className="hero-kicker">KENROKUDO</p>
          <h1>
            美しき
            <br />
            レオパの世界へ。
          </h1>
          <p>
            余白と陰影で魅せるトップページとして再構築。
            <br />
            飼育記録を「作品」として見せるホーム体験を目指しました。
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#collections">
              コレクションを見る
            </a>
            <Link className="ghost-button" to="/admin">
              管理画面へ
            </Link>
          </div>
        </div>
      </section>

      <section className="home-intro">
        <div className="intro-panel">
          <p className="section-label">Curated Atmosphere</p>
          <h2>ホテルラウンジのような質感で、情報を落ち着いて届ける。</h2>
          <p>
            ダークトーンとブロンズ系アクセントを軸に、写真・文字・導線が自然に視線誘導する設計に変更しました。
            派手さより「品のある印象」を優先した、長く使えるビジュアルです。
          </p>
        </div>
        <div className="intro-metrics">
          <article>
            <span>Archive</span>
            <strong>198+</strong>
            <p>個体情報を将来追加しても破綻しない、拡張前提のグリッド設計。</p>
          </article>
          <article>
            <span>Design</span>
            <strong>Mobile Ready</strong>
            <p>スマホでは要素順を最適化し、タイポグラフィの迫力を維持します。</p>
          </article>
        </div>
      </section>

      <section className="home-collections" id="collections">
        <header className="collections-header">
          <p className="section-label">Featured Collections</p>
          <h2>静かな存在感を引き立てる、3つの視点。</h2>
        </header>
        <div className="collections-grid">
          <article className="collection-card">
            <span>01</span>
            <h3>Portrait Focus</h3>
            <p>被写体を大きく配置し、視線が最初に写真へ向かうように設計。</p>
          </article>
          <article className="collection-card">
            <span>02</span>
            <h3>Story Blocks</h3>
            <p>説明文は短くリズムをつくり、読み疲れしない情報密度に調整。</p>
          </article>
          <article className="collection-card">
            <span>03</span>
            <h3>Elegant Contrast</h3>
            <p>黒一色ではなく濃淡レイヤーで奥行きをつくり、上質感を強化。</p>
          </article>
        </div>
      </section>

      <section className="home-showcase">
        <img src="/reopa1.jpg" alt="Leopard gecko detail" />
        <div>
          <p className="section-label">Signature Frame</p>
          <h2>写真1枚でも成立する、余白主体のショーケース。</h2>
          <p>
            参考サイトのように、画像を「背景」ではなく「主役」として扱うため、
            周囲に余白とグラデーションレイヤーを入れて画面全体の完成度を上げています。
          </p>
        </div>
      </section>
    </div>
  );
};

