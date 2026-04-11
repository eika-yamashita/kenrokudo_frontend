import { useNavigate } from 'react-router-dom';
import { AdminPageLayout, PageHeader, adminStyles } from '../shared/ui/admin';

export const AdminMenuPage = () => {
  const navigate = useNavigate();

  return (
    <AdminPageLayout>
      <PageHeader
        title="管理メニュー"
        description={<p>個体管理とペアリング管理の入口をここにまとめています。</p>}
      />
      <div className={adminStyles.formGrid}>
        <button className={adminStyles.button} onClick={() => navigate('/admin/individuals')}>
          個体一覧へ
        </button>
        <button className={adminStyles.button} onClick={() => navigate('/admin/pairings')}>
          ペアリング一覧へ
        </button>
      </div>
    </AdminPageLayout>
  );
};
