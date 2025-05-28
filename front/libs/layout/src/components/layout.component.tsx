import './layout.component.scss';

import { Helmet } from '@dr.pogodin/react-helmet';
import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router';

import { LayoutProvider } from '../context';
import { LayoutFooterComponent } from './footer';
import { LayoutHeaderComponent } from './header';

export const ApplicationLayout = React.memo(() => (
  <LayoutProvider>
    <ScrollRestoration />
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
