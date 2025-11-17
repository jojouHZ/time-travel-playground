import React from 'react';
import App from './App';
import { HistoryProvider } from './context/HistoryContext';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';
import { createRoot } from 'react-dom/client';

const rootEl = document.getElementById('root')!;
createRoot(rootEl).render(
  <React.StrictMode>
    <HistoryProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </HistoryProvider>
  </React.StrictMode>
);
