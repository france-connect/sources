import { render } from '@testing-library/react';

import { UserPreferencesComponent } from '@fc/user-preferences';

import { AppConfig } from '../../../config';
import { UserPreferencesPage } from './user-preferences.page';

jest.mock('@fc/user-preferences');

describe('UserPreferencesPage', () => {
  it('should call UserPreferencesComponent with props', () => {
    // when
    render(<UserPreferencesPage />);
    // then
    expect(UserPreferencesComponent).toHaveBeenCalledTimes(1);
    expect(UserPreferencesComponent).toHaveBeenCalledWith(
      { options: AppConfig.UserPreferences },
      {},
    );
  });
});
