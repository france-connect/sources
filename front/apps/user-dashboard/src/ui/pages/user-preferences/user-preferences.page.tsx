import React from 'react';

import { UserPreferencesComponent } from '@fc/user-preferences';

import { AppConfig } from '../../../config';
import { UserPreferencesIntroductionComponent } from './user-preferences-introduction.component';

export const UserPreferencesPage = React.memo(() => {
  const config = AppConfig.UserPreferences;

  return (
    <div className="content-wrapper-lg px16" id="page-container">
      <UserPreferencesIntroductionComponent />
      <UserPreferencesComponent options={config} />
    </div>
  );
});

UserPreferencesPage.displayName = 'UserPreferencesPage';
