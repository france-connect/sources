import './index.scss';

import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { RouteItem } from '@fc/routing';

import { NavigationComponent } from '../navigation/navigation.component';

type LayoutProps = {
  routes: RouteItem[];
};

export const LayoutBackofficeComponent = React.memo(({ routes }: LayoutProps) => (
  <div id="application-container">
    <NavigationComponent routes={routes} />
    <div id="application-page">
      <Switch>
        {routes.map((page: RouteItem) => (
          <Route key={page.id} exact component={page.component} path={page.path} />
        ))}
      </Switch>
    </div>
  </div>
));

LayoutBackofficeComponent.displayName = 'LayoutComponent';
