import React from 'react';
import { Helmet } from 'react-helmet';

import { ErrorComponent } from './error.component';
import { NotFoundComponent } from './not-found.component';
import { PublicnessErrorComponent } from './publicness-error.component';

const PageTitle = () => (
  <Helmet>
    <title>AgentConnect - Erreur</title>
  </Helmet>
);

// a temporary way to display a specific error content
// because react app is supposed to be replace by ejs pages soon
// if fca react app is not deleted at the end of 2023,
// this part should be rewrite
export const AGENT_NOT_FOUND_ERROR_CODE = 'Y000015';

export const ErrorPage = React.memo(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hasError = (window as any).appError !== undefined;
  if (hasError) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).appError.code === AGENT_NOT_FOUND_ERROR_CODE) {
      return (
        <React.Fragment>
          <PageTitle />
          <PublicnessErrorComponent />
        </React.Fragment>
      );
    }

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
