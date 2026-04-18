import { useNavigate } from 'react-router-dom';
import { AdminPageLayout, PageHeader, adminStyles } from '../shared/ui/admin';

export const AdminMenuPage = () => {
  const navigate = useNavigate();

  return (
    <AdminPageLayout>
      <PageHeader
        title=""
        description=""
      />
      <div className={adminStyles.menuCardGrid}>
        <button className={adminStyles.menuCardButton} onClick={() => navigate('/admin/individuals')}>
          個体管理
        </button>
        <button className={adminStyles.menuCardButton} onClick={() => navigate('/admin/pairings')}>
          ペアリング管理
        </button>
      </div>
    </AdminPageLayout>
  );
};
