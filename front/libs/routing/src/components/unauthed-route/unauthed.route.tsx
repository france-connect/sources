import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { AccountContext, AccountInterface } from '@fc/account';

import { AuthRouteProps } from '../../interfaces';

export const UnauthedRoute = React.memo(({ fallbackPath, replace }: AuthRouteProps) => {
  const { pathname } = useLocation();
  const { connected, ready } = useContext<AccountInterface>(AccountContext);

  if (!ready) {
    return <div data-testid="route-unauthed-component-loader-div" />;
  }

  if (connected) {
    return <Navigate replace={!!replace} state={{ from: pathname }} to={fallbackPath} />;
  }

  return <Outlet />;
});

UnauthedRoute.displayName = 'UnauthedRoute';
