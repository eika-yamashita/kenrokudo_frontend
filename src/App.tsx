import { BrowserRouter as Router, Link, Route, Routes, useLocation } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AdminMenuPage } from './pages/AdminMenuPage';
import { IndividualListPage } from './pages/IndividualListPage';
import { IndividualDetailPage } from './pages/IndividualDetailPage';
import { IndividualEditorPage } from './pages/IndividualEditorPage';
import { IndividualCreatePage } from './pages/IndividualCreatePage';
import { PairingListPage } from './pages/PairingListPage';
import { PairingCreatePage } from './pages/PairingCreatePage';
import { PairingEditorPage } from './pages/PairingEditorPage';
import './styles/appShell.css';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isHomeRoute = location.pathname === '/';
  const headerClassName = `appHeader ${isAdminRoute ? 'appHeaderAdmin' : 'appHeaderHome'}`;
  const brandLinkClassName = `brandLink ${isAdminRoute ? 'brandLinkAdmin' : 'brandLinkHome'}`;
  const mainClassName = `appMain ${isHomeRoute ? 'appMainHome' : ''}`;
  const brandLinkTo = isAdminRoute ? '/admin' : '/';

  return (
    <div className="appShell">
      <header className={headerClassName}>
        <Link className={brandLinkClassName} to={brandLinkTo}>
          KENROKUDO
        </Link>
      </header>
      <main className={mainClassName}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminMenuPage />} />
          <Route path="/admin/individuals" element={<IndividualListPage />} />
          <Route path="/admin/individuals/new" element={<IndividualCreatePage />} />
          <Route path="/admin/individuals/detail/:species_id/:id" element={<IndividualDetailPage />} />
          <Route path="/admin/individuals/edit/:species_id/:id" element={<IndividualEditorPage />} />
          <Route path="/admin/pairings" element={<PairingListPage />} />
          <Route path="/admin/pairings/new" element={<PairingCreatePage />} />
          <Route path="/admin/pairings/edit/:species_id/:fiscal_year/:pairing_id" element={<PairingEditorPage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
