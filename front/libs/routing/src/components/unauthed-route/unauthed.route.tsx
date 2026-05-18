import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';

import { useAccountContext } from '@fc/account';

import { AuthFallbackRoutes } from '../../enums';
import type { AuthRouteInterface } from '../../interfaces';

export const UnauthedRoute = React.memo(
  ({ fallback = AuthFallbackRoutes.INDEX, replace = false }: AuthRouteInterface) => {
    const location = useLocation();
    const { connected } = useAccountContext();

    if (connected) {
      const navigateTo = typeof fallback === 'function' ? fallback(location) : fallback;
      return <Navigate replace={replace} state={{ from: location }} to={navigateTo} />;
    }

    return <Outlet />;
  },
);

UnauthedRoute.displayName = 'UnauthedRoute';
