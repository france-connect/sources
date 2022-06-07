import React from 'react';

import { ErrorComponent } from './error.component';
import { NotFoundComponent } from './not-found.component';

export const ErrorPage = React.memo(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hasError = (window as any).appError !== undefined;
  if (hasError) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <ErrorComponent errors={(window as any).appError} />;
  }
  return <NotFoundComponent />;
});

ErrorPage.displayName = 'ErrorPage';
