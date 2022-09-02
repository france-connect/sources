import React, { useContext, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';

import { AccountContext, AccountInterface } from '@fc/account';
import { AxiosErrorCatcherContext } from '@fc/axios-error-catcher';
import { HttpStatusCode } from '@fc/common';

import { AuthRouteProps } from '../interfaces';

export const AuthedRouteComponent = React.memo(
  ({ authRedirect, component: Component, loader: Loader, ...rest }: AuthRouteProps) => {
    const { connected, ready, updateAccount } = useContext<AccountInterface>(AccountContext);
    const { codeError, hasError } = useContext(AxiosErrorCatcherContext);

    useEffect(() => {
      if (hasError && codeError === HttpStatusCode.UNAUTHORIZED) {
        updateAccount({
          connected: false,
          ready: true,
          userinfos: {
            firstname: '',
            lastname: '',
          },
        });
      }
    }, [codeError, hasError, updateAccount]);

    return (
      <Route
        render={({ location }) => {
          if (!ready) {
            return (
              (Loader && <Loader />) || <div data-testid="route-authed-component-loader-div" />
            );
          }
          if (connected) {
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

AuthedRouteComponent.displayName = 'AuthedRouteComponent';
