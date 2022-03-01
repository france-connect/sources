import React from 'react';

import { ErrorComponent } from './error.component';
import { NotFoundComponent } from './not-found.component';

export const ErrorPage = React.memo(() => {
  const hasError = (window as any).appError !== undefined;
  if (hasError) {
    return <ErrorComponent errors={(window as any).appError} />;
  }
  return <NotFoundComponent />;
});

ErrorPage.displayName = 'ErrorPage';
