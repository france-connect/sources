import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import type { AccountContextState } from '@fc/account';
import { AccountContext } from '@fc/account';
import { useSafeContext } from '@fc/common';

import { AuthFallbackRoutes } from '../../enums';
import type { AuthRouteInterface } from '../../interfaces';

export const UnauthedRoute = React.memo(
  ({ fallback = AuthFallbackRoutes.INDEX, replace = false }: AuthRouteInterface) => {
    const location = useLocation();
    const { connected, ready } = useSafeContext<AccountContextState>(AccountContext);

    if (!ready) {
      return <div data-testid="route-unauthed-component-loader-div" />;
    }

    if (connected) {
      const { pathname } = location;
      const navigateTo = typeof fallback === 'function' ? fallback(location) : fallback;
      return <Navigate replace={!!replace} state={{ from: pathname }} to={navigateTo} />;
    }

    return <Outlet />;
  },
);

UnauthedRoute.displayName = 'UnauthedRoute';
