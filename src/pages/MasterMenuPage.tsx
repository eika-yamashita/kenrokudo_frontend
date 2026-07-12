import { useNavigate } from 'react-router-dom';
import { AdminPageLayout, PageHeader, adminStyles } from '../shared/ui/admin';

export const MasterMenuPage = () => {
  const navigate = useNavigate();

  return (
    <AdminPageLayout>
      <PageHeader title="マスタ管理" />
      <div className={adminStyles.menuCardGrid}>
        <button className={adminStyles.menuCardButton} onClick={() => navigate('/admin/masters/species')}>
          種マスタ
        </button>
        <button className={adminStyles.menuCardButton} onClick={() => navigate('/admin/masters/morphs')}>
          モルフマスタ
        </button>
        <button className={adminStyles.menuCardButton} onClick={() => navigate('/admin/masters/bloodlines')}>
          血統マスタ
        </button>
      </div>
    </AdminPageLayout>
  );
};
