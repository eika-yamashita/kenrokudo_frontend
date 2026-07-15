import { BrowserRouter as Router, Link, Route, Routes, useLocation } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AdminMenuPage } from './pages/AdminMenuPage';
import { MasterMenuPage } from './pages/MasterMenuPage';
import { SpeciesListPage } from './pages/SpeciesListPage';
import { SpeciesDetailPage } from './pages/SpeciesDetailPage';
import { SpeciesUpsertPage } from './pages/SpeciesUpsertPage';
import { MorphListPage } from './pages/MorphListPage';
import { MorphDetailPage } from './pages/MorphDetailPage';
import { MorphUpsertPage } from './pages/MorphUpsertPage';
import { BloodlineListPage } from './pages/BloodlineListPage';
import { BloodlineDetailPage } from './pages/BloodlineDetailPage';
import { BloodlineUpsertPage } from './pages/BloodlineUpsertPage';
import { IndividualListPage } from './pages/IndividualListPage';
import { IndividualDetailPage } from './pages/IndividualDetailPage';
import { IndividualEditorPage } from './pages/IndividualEditorPage';
import { IndividualCreatePage } from './pages/IndividualCreatePage';
import { PairingListPage } from './pages/PairingListPage';
import { PairingCreatePage } from './pages/PairingCreatePage';
import { PairingEditorPage } from './pages/PairingEditorPage';
import { EventListPage } from './pages/EventListPage';
import { EventUpsertPage } from './pages/EventUpsertPage';
import './styles/appShell.css';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isHomeRoute = location.pathname === '/';
  const headerClassName = `appHeader ${isAdminRoute ? 'appHeaderAdmin' : 'appHeaderHome'}`;
  const brandLinkClassName = `brandLink ${isAdminRoute ? 'brandLinkAdmin' : 'brandLinkHome'}`;
  const mainClassName = ['appMain', isHomeRoute ? 'appMainHome' : '', isAdminRoute ? 'appMainAdmin' : '']
    .filter(Boolean)
    .join(' ');
  const brandLinkTo = isAdminRoute ? '/admin' : '/';

  return (
    <div className="appShell">
      <header className={headerClassName}>
        <Link className={brandLinkClassName} to={brandLinkTo}>
          絢禄堂 -KENROKUDO-
        </Link>
      </header>
      <main className={mainClassName}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminMenuPage />} />
          <Route path="/admin/masters" element={<MasterMenuPage />} />
          <Route path="/admin/masters/species" element={<SpeciesListPage />} />
          <Route path="/admin/masters/species/new" element={<SpeciesUpsertPage mode="create" />} />
          <Route path="/admin/masters/species/detail/:species_id" element={<SpeciesDetailPage />} />
          <Route path="/admin/masters/species/edit/:species_id" element={<SpeciesUpsertPage mode="edit" />} />
          <Route path="/admin/masters/morphs" element={<MorphListPage />} />
          <Route path="/admin/masters/morphs/new" element={<MorphUpsertPage mode="create" />} />
          <Route path="/admin/masters/morphs/detail/:species_id/:morph_id" element={<MorphDetailPage />} />
          <Route path="/admin/masters/morphs/edit/:species_id/:morph_id" element={<MorphUpsertPage mode="edit" />} />
          <Route path="/admin/masters/bloodlines" element={<BloodlineListPage />} />
          <Route path="/admin/masters/bloodlines/new" element={<BloodlineUpsertPage mode="create" />} />
          <Route
            path="/admin/masters/bloodlines/detail/:species_id/:morph_id/:bloodline_id"
            element={<BloodlineDetailPage />}
          />
          <Route
            path="/admin/masters/bloodlines/edit/:species_id/:morph_id/:bloodline_id"
            element={<BloodlineUpsertPage mode="edit" />}
          />
          <Route path="/admin/individuals" element={<IndividualListPage />} />
          <Route path="/admin/individuals/new" element={<IndividualCreatePage />} />
          <Route path="/admin/individuals/detail/:species_id/:id" element={<IndividualDetailPage />} />
          <Route path="/admin/individuals/edit/:species_id/:id" element={<IndividualEditorPage />} />
          <Route path="/admin/pairings" element={<PairingListPage />} />
          <Route path="/admin/pairings/new" element={<PairingCreatePage />} />
          <Route path="/admin/pairings/edit/:species_id/:fiscal_year/:pairing_id" element={<PairingEditorPage />} />
          <Route path="/admin/events" element={<EventListPage />} />
          <Route path="/admin/events/new" element={<EventUpsertPage mode="create" />} />
          <Route path="/admin/events/edit/:event_id" element={<EventUpsertPage mode="edit" />} />
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
