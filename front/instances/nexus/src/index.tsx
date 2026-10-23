import React from 'react';
import { createRoot } from 'react-dom/client';

import { Application } from './ui/application';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <Application />
  </React.StrictMode>,
);
