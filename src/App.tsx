import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { IndividualListPage } from './pages/IndividualListPage';
import { IndividualDetailPage } from './pages/IndividualDetailPage';
import { IndividualEditorPage } from './pages/IndividualEditorPage';
import { IndividualCreatePage } from './pages/IndividualCreatePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-shell">
        <header className="app-header">
          <Link className="brand-link" to="/">
            絢禄堂 -KENROKUDO-
          </Link>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<IndividualListPage />} />
            <Route path="/admin/new" element={<IndividualCreatePage />} />
            <Route path="/admin/detail/:species_cd/:id" element={<IndividualDetailPage />} />
            <Route path="/admin/edit/:species_cd/:id" element={<IndividualEditorPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
