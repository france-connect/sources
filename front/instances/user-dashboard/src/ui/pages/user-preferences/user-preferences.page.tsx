import classnames from 'classnames';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useMediaQuery } from 'react-responsive';

import { UserPreferencesComponent } from '@fc/user-preferences';

import { AppConfig } from '../../../config';
import { UserPreferencesIntroductionComponent } from './user-preferences-introduction.component';

export const UserPreferencesPage = React.memo(() => {
  const config = AppConfig.UserPreferences;
  const gtTablet = useMediaQuery({ query: '(min-width: 992px)' });

  return (
    <React.Fragment>
      <Helmet>
        <title>Mon tableau de bord - Mes Accès</title>
      </Helmet>
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
        <UserPreferencesIntroductionComponent />
        <UserPreferencesComponent options={config} />
      </div>
    </React.Fragment>
  );
});

UserPreferencesPage.displayName = 'UserPreferencesPage';
