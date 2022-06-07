import classnames from 'classnames';
import React from 'react';
import { useMediaQuery } from 'react-responsive';

import { TracksListComponent } from '@fc/tracks';

import { AppConfig } from '../../../config';
import { IntroductionComponent } from './introduction';

export const TracksPage = React.memo(() => {
  const gtTablet = useMediaQuery({ query: '(min-width: 992px)' });
  return (
    <div
      className={classnames('fr-m-auto fr-px-2w', {
        // Class CSS
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-mt-5w': !gtTablet,
        // Class CSS
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-mt-8w': gtTablet,
      })}
      id="page-container">
      <IntroductionComponent />
      <TracksListComponent options={AppConfig.Tracks} />
    </div>
  );
});

TracksPage.displayName = 'TracesPageComponent';
