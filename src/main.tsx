import React from 'react';
import App from './app/App';
import ErrorBoundary from './components/ErrorBoundary';
import { createRoot } from 'react-dom/client';
import './index.css';

const rootEl = document.getElementById('root')!;
createRoot(rootEl).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
