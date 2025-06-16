import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './ChatInterface';
import SystemFlowWidget from './SystemFlowWidget';

const container = document.getElementById('root')!;
const root = ReactDOM.createRoot(container);

root.render(
  <>
    <App />
    <SystemFlowWidget />
  </>
);
