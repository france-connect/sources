import React from 'react';
import { Helmet } from 'react-helmet';

import { ErrorComponent } from './error.component';
import { NotFoundComponent } from './not-found.component';

const PageTitle = () => (
  <Helmet>
    <title>AgentConnect - Erreur</title>
  </Helmet>
);

export const ErrorPage = React.memo(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hasError = (window as any).appError !== undefined;
  if (hasError) {
    return (
      <React.Fragment>
        <PageTitle />
        <ErrorComponent
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          errors={(window as any).appError}
        />
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <PageTitle />
      <NotFoundComponent />
    </React.Fragment>
  );
});

ErrorPage.displayName = 'ErrorPage';
