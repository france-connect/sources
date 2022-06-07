import classnames from 'classnames';
import React from 'react';
import { useMediaQuery } from 'react-responsive';

import styles from './not-found.module.scss';

export const NotFoundComponent = React.memo(() => {
  const gtTablet = useMediaQuery({ query: '(min-width: 768px)' });
  return (
    <div
      className={classnames(styles.page, 'fr-m-auto', {
        // Class CSS
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-mt-4w': !gtTablet,
        // Class CSS
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-mt-8w': gtTablet,
      })}>
      <h1 className="text-center">404 - Not Found</h1>
    </div>
  );
});

NotFoundComponent.displayName = 'NotFoundComponent';
