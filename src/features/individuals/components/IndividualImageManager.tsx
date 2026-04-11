import type { IndividualImage } from '../../../api/models/IndividualImage';
import { StatusBanner, adminStyles } from '../../../shared/ui/admin';

type Props = {
  images: IndividualImage[];
  loading: boolean;
  error?: string | null;
  onSetPrimary: (imageId: number) => Promise<void>;
  onReplace: (imageId: number, file: File) => Promise<void>;
  onDelete: (imageId: number) => Promise<void>;
};

export const IndividualImageManager = ({ images, loading, error, onSetPrimary, onReplace, onDelete }: Props) => {
  return (
    <div className={adminStyles.panel}>
      <h2>登録済み画像</h2>
      {loading ? <StatusBanner>画像を読み込み中...</StatusBanner> : null}
      {error ? <StatusBanner tone="error">{error}</StatusBanner> : null}

      {!loading ? (
        <div className={adminStyles.imageGrid}>
          {images.length === 0 ? <StatusBanner>画像は未登録です</StatusBanner> : null}
          {images.map((image) => (
            <div key={image.image_id} className={adminStyles.imageCard}>
              <img src={image.public_url} alt={image.file_name ?? String(image.image_id)} />
              <div className={adminStyles.imageMeta}>
                <div>{image.is_primary ? 'メイン画像' : 'サブ画像'}</div>
                <div className={adminStyles.inlineActions}>
                  {!image.is_primary ? (
                    <button className={adminStyles.buttonGhost} type="button" onClick={() => void onSetPrimary(image.image_id)}>
                      メインにする
                    </button>
                  ) : null}
                  <label className={`${adminStyles.buttonGhost} ${adminStyles.fileButton}`}>
                    差替
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        void onReplace(image.image_id, file);
                      }}
                    />
                  </label>
                  <button className={adminStyles.buttonDanger} type="button" onClick={() => void onDelete(image.image_id)}>
                    削除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
