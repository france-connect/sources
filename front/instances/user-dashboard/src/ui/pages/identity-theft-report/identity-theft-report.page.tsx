import { Helmet } from '@dr.pogodin/react-helmet';
import classnames from 'classnames';
import React from 'react';

import { useStylesQuery, useStylesVariables } from '@fc/styles';

export const IdentityTheftReportPage = React.memo(() => {
  const [breakpointLg] = useStylesVariables(['breakpoint-lg']);
  const gtDesktop = useStylesQuery({ minWidth: breakpointLg });

  return (
    <React.Fragment>
      <Helmet>
        <title>Mon tableau de bord - Signaler une usurpation</title>
      </Helmet>
      <div
        className={classnames('fr-m-auto fr-px-2w', {
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-mt-5w': !gtDesktop,
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-mt-8w': gtDesktop,
        })}
        id="page-container">
        <h1>Fishing Report</h1>
        <p>This is the fishing report page.</p>
        <p>Hello World !</p>
      </div>
    </React.Fragment>
  );
});

IdentityTheftReportPage.displayName = 'IdentityTheftReportPage';
