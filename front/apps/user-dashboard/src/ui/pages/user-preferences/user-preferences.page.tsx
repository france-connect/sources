import classnames from 'classnames';
import React from 'react';
import { useMediaQuery } from 'react-responsive';

import { UserPreferencesComponent } from '@fc/user-preferences';

import { AppConfig } from '../../../config';
import { UserPreferencesIntroductionComponent } from './user-preferences-introduction.component';

export const UserPreferencesPage = React.memo(() => {
  const config = AppConfig.UserPreferences;
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
      <UserPreferencesIntroductionComponent />
      <UserPreferencesComponent options={config} />
    </div>
  );
});

UserPreferencesPage.displayName = 'UserPreferencesPage';
