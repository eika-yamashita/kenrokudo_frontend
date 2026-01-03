import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { IndividualListPage } from './pages/IndividualListPage';
import { IndividualEditorPage } from './pages/IndividualEditorPage';
import './App.css';

function App() {
  return (
    <Router>
      <header className="app-header">
        <h2>絢禄堂</h2>
      </header>
      <Routes>
        <Route path="/" element={<IndividualListPage />} />
        <Route path="/edit/:species_cd/:id" element={<IndividualEditorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
