import React, { useContext, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { AccountContext, AccountInterface } from '@fc/account';
import { AxiosErrorCatcherContext } from '@fc/axios-error-catcher';
import { HttpStatusCode } from '@fc/common';

import { AuthRouteProps } from '../../interfaces';

export const AuthedRoute = React.memo(({ fallbackPath, replace }: AuthRouteProps) => {
  const { pathname } = useLocation();
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

  if (!ready) {
    return <div data-testid="route-authed-component-loader-div" />;
  }

  if (!connected) {
    return <Navigate replace={!!replace} state={{ from: pathname }} to={fallbackPath} />;
  }

  return <Outlet />;
});

AuthedRoute.displayName = 'AuthedRoute';
