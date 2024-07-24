import './layout.scss';

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';

import { LayoutFooterComponent } from './footer';
import { LayoutHeaderComponent } from './header';

export const ApplicationLayout = React.memo(() => (
  <React.Fragment>
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
  </React.Fragment>
));

ApplicationLayout.displayName = 'ApplicationLayout';
