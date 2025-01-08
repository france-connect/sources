import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import type { AccountContextState } from '@fc/account';
import { AccountContext } from '@fc/account';
import { useSafeContext } from '@fc/common';

import { AuthFallbackRoutes } from '../../enums';
import type { AuthRouteInterface } from '../../interfaces';

export const AuthedRoute = React.memo(
  ({ fallback = AuthFallbackRoutes.LOGIN, replace = false }: AuthRouteInterface) => {
    const location = useLocation();
    const { connected, expired } = useSafeContext<AccountContextState>(AccountContext);

    if (!connected || expired) {
      const navigateTo = typeof fallback === 'function' ? fallback(location) : fallback;
      return <Navigate replace={!!replace} state={{ from: location }} to={navigateTo} />;
    }

    return <Outlet />;
  },
);

AuthedRoute.displayName = 'AuthedRoute';
