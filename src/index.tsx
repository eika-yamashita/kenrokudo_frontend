import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProviders } from './app/AppProviders';
import './styles/theme.css';
import './index.css';

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <AppProviders>
        <App />
      </AppProviders>
    </React.StrictMode>
  );
}
