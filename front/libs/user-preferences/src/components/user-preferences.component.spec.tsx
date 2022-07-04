import { render } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';

import { useUserPreferencesApi } from '../hooks';
import { UserPreferencesComponent } from './user-preferences.component';

jest.mock('react-final-form');
jest.mock('../hooks');
jest.mock('./services-list.component');
jest.mock('./user-preferences-form.component');

describe('UserPreferencesComponent', () => {
  // given
  const optionsMock = {
    API_ROUTE_CSRF_TOKEN: 'csrf-token-endpoint',
    API_ROUTE_USER_PREFERENCES: 'any-endpoint',
  };
  const commitMock = jest.fn();
  const initialValuesMock = { allowFutureIdp: false, idpList: expect.any(Object) };
  const userPreferencesMock = {
    allowFutureIdp: false,
    idpList: [expect.any(Object), expect.any(Object)],
  };
  const validateHandlerMock = jest.fn();
  const hookResultMock = {
    commit: commitMock,
    formValues: initialValuesMock,
    submitErrors: undefined,
    submitWithSuccess: false,
    userPreferences: userPreferencesMock,
    validateHandler: validateHandlerMock,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot', () => {
    // given
    mocked(useUserPreferencesApi).mockReturnValue(hookResultMock);
    // when
    const { container } = render(<UserPreferencesComponent options={optionsMock} />);
    // then
    expect(container).toMatchSnapshot();
  });

  it('should have called useUserPreferencesApi', () => {
    // given
    mocked(useUserPreferencesApi).mockReturnValue(hookResultMock);
    // when
    render(<UserPreferencesComponent options={optionsMock} />);
    // then
    expect(useUserPreferencesApi).toHaveBeenCalledTimes(1);
    expect(useUserPreferencesApi).toHaveBeenCalledWith(optionsMock);
  });
});
