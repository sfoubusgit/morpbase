import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './ui/App';
import { ErrorBoundary } from './ui/ErrorBoundary';
import { initErrorTracking } from './engine/errorTracker';
import './index.css';
import './ui/styles/tokens.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

initErrorTracking();

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

