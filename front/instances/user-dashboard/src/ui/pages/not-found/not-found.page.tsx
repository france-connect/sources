import classnames from 'classnames';
import React from 'react';

import { useStylesQuery, useStylesVariables } from '@fc/styles';

export const NotFoundPage = React.memo(() => {
  const [breakpointLg] = useStylesVariables(['breakpoint-lg']) as unknown as string;
  const gtDesktop = useStylesQuery({ minWidth: breakpointLg });

  return (
    <div
      className={classnames('fr-m-auto fr-px-2w text-center', {
        // Class CSS
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-mt-5w': !gtDesktop,
        // Class CSS
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-mt-8w': gtDesktop,
      })}
      id="page-container">
      <h1 className="text-center">404 - Not Found</h1>
    </div>
  );
});

NotFoundPage.displayName = 'NotFoundPage';
