import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';

import { LayoutProvider } from '../context';
import { LayoutFooterComponent } from './footer';
import { LayoutHeaderComponent } from './header';

export const ApplicationLayout = React.memo(() => (
  <LayoutProvider>
    <Helmet>
      <html data-fr-theme="light" lang="fr" />
    </Helmet>
    <div className="sticky-body">
      <div className="sticky-content">
        <LayoutHeaderComponent />
        <Outlet />
      </div>
      <LayoutFooterComponent />
    </div>
  </LayoutProvider>
));

ApplicationLayout.displayName = 'ApplicationLayout';
