import classnames from 'classnames';
import React from 'react';
import { useMediaQuery } from 'react-responsive';

export const ErrorPage = React.memo(() => {
  const gtTablet = useMediaQuery({ query: '(min-width: 992px)' });
  return (
    <div
      className={classnames('fr-m-auto fr-px-2w text-center', {
        // Class CSS
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-mt-5w': !gtTablet,
        // Class CSS
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-mt-8w': gtTablet,
      })}
      id="page-container">
      <h1 className="text-center">Une erreur est survenue</h1>
      <h2 className="text-center">
        <span>Erreur</span>
      </h2>
      <p className="text-center">Ceci est une erreur</p>
    </div>
  );
});

ErrorPage.displayName = 'ErrorPage';
