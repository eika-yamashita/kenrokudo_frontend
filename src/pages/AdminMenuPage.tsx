import { useNavigate } from 'react-router-dom';

export const AdminMenuPage = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-page">
      <div className="admin-menu-grid">
        <button className="primary-button admin-menu-button" onClick={() => navigate('/admin/individuals')}>
          個体管理
        </button>
        <button className="primary-button admin-menu-button" onClick={() => navigate('/admin/pairings')}>
          ペアリング管理
        </button>
      </div>
    </div>
  );
};
