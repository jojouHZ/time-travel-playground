import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HistoryProvider } from './context/HistoryContext';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HistoryProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </HistoryProvider>
  </React.StrictMode>
);
