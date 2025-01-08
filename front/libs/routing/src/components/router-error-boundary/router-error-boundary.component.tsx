import React from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

import { RouterException } from '../../exceptions';

export const RouterErrorBoundaryComponent = React.memo(() => {
  const error = useRouteError();

  const shoudThrow = !isRouteErrorResponse(error);
  if (shoudThrow) {
    throw new RouterException(error as Error);
  }

  // @TODO
  // implement error page specific to router error
  // @SEE https://reactrouter.com/en/main/hooks/use-route-error
  // @SEE https://reactrouter.com/en/main/utils/is-route-error-response
  return <div>{JSON.stringify(error)}</div>;
});

RouterErrorBoundaryComponent.displayName = 'RouterErrorBoundaryComponent';
