import React from 'react';
import { Outlet } from 'react-router-dom';

export const PageLayout = React.memo(() => (
  <main className="fr-container fr-py-8v">
    <div className="fr-grid-row fr-grid-row--center">
      <Outlet />
    </div>
  </main>
));

PageLayout.displayName = 'PageLayout';
