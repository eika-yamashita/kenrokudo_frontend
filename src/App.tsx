import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { IndividualList } from './components/IndividualList';
import { IndividualEditorPage } from './components/IndividualEditorPage';

const App: React.FC = () => (
  <Router>
    <h2>絢禄堂ss</h2>
    <Routes>
      <Route path="/" element={<IndividualList />} />
      <Route path="/edit/:speciesCd/:id" element={<IndividualEditorPage />} />
    </Routes>
  </Router>
);

export default App;