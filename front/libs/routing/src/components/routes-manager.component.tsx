import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { RouteItem } from '../interfaces';

interface RouterComponentProps {
  routes: RouteItem[];
}

export const RoutesManagerComponent = React.memo(({ routes }: RouterComponentProps) => (
  <Switch>
    {routes.map((route: RouteItem) => {
      const { component, exact = false, path, routing, strict = false } = route;
      if (routing && routing.authWrapper) {
        const AuthRouteComponent = routing.authWrapper;
        return (
          <AuthRouteComponent
            key={path}
            authRedirect={routing.authRedirect}
            component={component}
            exact={exact}
            path={path}
            strict={strict}
          />
        );
      }
      return <Route key={path} component={component} exact={exact} path={path} strict={strict} />;
    })}
  </Switch>
));

RoutesManagerComponent.displayName = 'RoutesManagerComponent';
