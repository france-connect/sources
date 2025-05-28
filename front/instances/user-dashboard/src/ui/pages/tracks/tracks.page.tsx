import { Helmet } from '@dr.pogodin/react-helmet';
import classnames from 'classnames';
import React from 'react';

import { useStylesQuery, useStylesVariables } from '@fc/styles';
import { TracksListComponent } from '@fc/tracks';

import { IntroductionComponent } from './introduction';

export const TracksPage = React.memo(() => {
  const [breakpointLg] = useStylesVariables(['breakpoint-lg']);
  const gtDesktop = useStylesQuery({ minWidth: breakpointLg });

  return (
    <React.Fragment>
      <Helmet>
        <title>Mon tableau de bord - Historique</title>
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
        <IntroductionComponent />
        <TracksListComponent />
      </div>
    </React.Fragment>
  );
});

TracksPage.displayName = 'TracesPageComponent';
