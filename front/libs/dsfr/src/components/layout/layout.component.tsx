import './layout.scss';

import React from 'react';
// @TODO remove react-helmet -> cause error dans la console
// pas necessaire, peut facilement etre remplacé par un composant custom
// pour changer le titre de la page HTML
import { Helmet } from 'react-helmet';
import { matchPath, RouteProps, useLocation } from 'react-router-dom';

import { RouteItem, RoutesManagerComponent } from '@fc/routing';

import { LayoutConfig } from '../../interfaces';
import { LayoutFooterComponent } from './footer';
import { LayoutHeaderComponent } from './header';

export interface ApplicationLayoutProps {
  routes: RouteItem[];
  config: LayoutConfig;
}

// @TODO https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/836
// extraction -> utils + refacto pour simplification et lisibilité
export const getDocumentTitle = (obj: RouteItem) => `${obj && obj.label ? `${obj.label} - ` : ''}`;

// @TODO https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/836
// extraction -> utils + refacto pour simplification et lisibilité
export const getCurrentRouteObjectByPath = (entries: RouteItem[], locationPathname: string) =>
  (entries && entries.filter((obj) => obj && matchPath(locationPathname, obj as RouteProps))[0]) ||
  null;

// @TODO `config` and `routes` properties should be into a `react context`
// like `AppConfigContext` / `useAppConfigContext()`
// to simplify usage into children components
// instead of passing it as a child dependency
export const ApplicationLayout: React.FC<ApplicationLayoutProps> = React.memo(
  ({ routes }: ApplicationLayoutProps) => {
    const { pathname } = useLocation();
    const currentRouteObj = getCurrentRouteObjectByPath(routes, pathname);
    const documentTitle = getDocumentTitle(currentRouteObj);
    return (
      <div className="sticky-body">
        <div className="sticky-content">
          <Helmet>
            <html data-fr-theme="light" lang="fr" />
            <title>{documentTitle}</title>
          </Helmet>
          <LayoutHeaderComponent />
          <RoutesManagerComponent routes={routes} />
        </div>
        <LayoutFooterComponent />
      </div>
    );
  },
);

ApplicationLayout.displayName = 'ApplicationLayout';
