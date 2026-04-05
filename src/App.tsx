import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AdminMenuPage } from './pages/AdminMenuPage';
import { IndividualListPage } from './pages/IndividualListPage';
import { IndividualDetailPage } from './pages/IndividualDetailPage';
import { IndividualEditorPage } from './pages/IndividualEditorPage';
import { IndividualCreatePage } from './pages/IndividualCreatePage';
import { PairingListPage } from './pages/PairingListPage';
import { PairingCreatePage } from './pages/PairingCreatePage';
import { PairingEditorPage } from './pages/PairingEditorPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-shell">
        <header className="app-header">
          <Link className="brand-link" to="/">
            絢禄堂 KENROKUDO
          </Link>
        </header>
        <main className="app-main">
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
    </Router>
  );
}

export default App;
