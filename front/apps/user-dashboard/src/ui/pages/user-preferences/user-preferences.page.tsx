import './user-preferences.scss';

import React from 'react';

import { UserPreferencesComponent } from '@fc/user-preferences';

import { AppConfig } from '../../../config';

export const UserPreferencesPage = React.memo(() => {
  const config = AppConfig.UserPreferences;

  return (
    <div className="content-wrapper-md px16" id="user-preferences-page">
      <UserPreferencesComponent options={config} />
    </div>
  );
});

UserPreferencesPage.displayName = 'UserPreferencesPage';
