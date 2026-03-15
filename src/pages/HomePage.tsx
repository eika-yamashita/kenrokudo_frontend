export const HomePage = () => {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="hero-image-frame">
          <img className="hero-image" src="/reopa1.jpg" alt="Leopard gecko" />
        </div>

        <div className="hero-copy-block">
          <p className="hero-kicker">Leopard Gecko Archive</p>
          <h1>静かな存在感で魅せる、レオパ飼育のためのホーム画面。</h1>
          <p className="hero-description">
            必要な情報だけを落ち着いて見せるために、余白とコントラストを大切にしたトップページへ整えました。
            運用用の導線は表に出さず、公開側の印象を崩さない構成です。
          </p>
        </div>
      </section>

      <section className="home-grid">
        <article className="home-card statement-card">
          <span className="card-index">01</span>
          <h2>Clean</h2>
          <p>白と黒を軸に、写真の存在感が埋もれないよう装飾を削いだレイアウトにしています。</p>
        </article>
        <article className="home-card statement-card">
          <span className="card-index">02</span>
          <h2>Quiet</h2>
          <p>公開画面では余計な操作を見せず、ブランド感と閲覧体験を優先した見せ方に寄せています。</p>
        </article>
        <article className="home-card statement-card">
          <span className="card-index">03</span>
          <h2>Focused</h2>
          <p>将来コンテンツを増やしても散らからないよう、見出しと情報のまとまりをシンプルに保っています。</p>
        </article>
      </section>
    </div>
  );
};
