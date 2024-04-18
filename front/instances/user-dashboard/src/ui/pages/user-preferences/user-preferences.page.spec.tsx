import { render } from '@testing-library/react';
import { useMediaQuery } from 'react-responsive';

import { UserPreferencesComponent } from '@fc/user-preferences';

import { AppConfig } from '../../../config';
import { UserPreferencesPage } from './user-preferences.page';

jest.mock('react-responsive');
jest.mock('@fc/user-preferences');

describe('UserPreferencesPage', () => {
  it('should match the snapshot, display into a desktop viewport', () => {
    // given
    jest.mocked(useMediaQuery).mockReturnValueOnce(true);

    // when
    const { container } = render(<UserPreferencesPage />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, display into a mobile viewport', () => {
    // given
    jest.mocked(useMediaQuery).mockReturnValueOnce(false);

    // when
    const { container } = render(<UserPreferencesPage />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call UserPreferencesComponent with props', () => {
    // when
    render(<UserPreferencesPage />);

    // then
    expect(UserPreferencesComponent).toHaveBeenCalledOnce();
    expect(UserPreferencesComponent).toHaveBeenCalledWith(
      { options: AppConfig.UserPreferences },
      {},
    );
  });
});
