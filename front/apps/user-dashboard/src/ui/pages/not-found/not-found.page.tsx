import classnames from 'classnames';
import React from 'react';
import { useMediaQuery } from 'react-responsive';

export const NotFoundPage = React.memo(() => {
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
      <h1 className="text-center">404 - Not Found</h1>
    </div>
  );
});

NotFoundPage.displayName = 'NotFoundPage';
