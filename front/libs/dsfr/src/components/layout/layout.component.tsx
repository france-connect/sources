import './layout.scss';

import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';

import { LayoutFooterComponent } from './footer';
import { LayoutHeaderComponent } from './header';

export const ApplicationLayout = React.memo(() => (
  // @TODO let the application to add the HelmetProvider
  <HelmetProvider>
    <div className="sticky-body">
      <div className="sticky-content">
        <Helmet>
          <html data-fr-theme="light" lang="fr" />
        </Helmet>
        <LayoutHeaderComponent />
        <Outlet />
      </div>
      <LayoutFooterComponent />
    </div>
  </HelmetProvider>
));

ApplicationLayout.displayName = 'ApplicationLayout';
