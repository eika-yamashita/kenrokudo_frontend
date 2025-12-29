import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { IndividualListPage } from './pages/IndividualListPage';
import { IndividualEditorPage } from './pages/IndividualEditorPage';

function App() {
  return (
    <Router>
      <h2>絢禄堂</h2>
      <Routes>
        <Route path="/" element={<IndividualListPage />} />
        <Route path="/edit/:speciesCd/:id" element={<IndividualEditorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
