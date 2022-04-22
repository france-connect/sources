import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';

import { UserInfosContext, UserInterface } from '@fc/oidc-client';

import { AuthRouteProps } from '../interfaces';

export const UnauthedRouteComponent = React.memo(
  ({ authRedirect, component: Component, loader: Loader, ...rest }: AuthRouteProps) => {
    const { connected, ready } = useContext<UserInterface>(UserInfosContext);

    return (
      <Route
        render={({ location }) => {
          if (!ready) {
            return (
              (Loader && <Loader />) || <div data-testid="route-unauthed-component-loader-div" />
            );
          }
          if (!connected) {
            // inherited props from reat-router-dom <Route> component
            // eslint-disable-next-line react/jsx-props-no-spreading
            return <Component {...rest} />;
          }
          return (
            <Redirect
              to={{
                pathname: authRedirect,
                state: { from: location },
              }}
            />
          );
        }}
      />
    );
  },
);

UnauthedRouteComponent.displayName = 'UnauthedRouteComponent';
