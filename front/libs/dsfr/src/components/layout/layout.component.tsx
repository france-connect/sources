import './layout.scss';

import React from 'react';
// @TODO remove react-helmet -> cause error dans la console
// pas necessaire, peut facilement etre remplacé par un composant custom
// pour changer le titre de la page HTML
import { Helmet } from 'react-helmet';
import { Outlet } from 'react-router-dom';

import { LayoutFooterComponent } from './footer';
import { LayoutHeaderComponent } from './header';

export const ApplicationLayout = React.memo(() => (
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
));

ApplicationLayout.displayName = 'ApplicationLayout';
