import { render } from '@testing-library/react';
import * as ReactFinalForm from 'react-final-form';
import { mocked } from 'ts-jest/utils';

import { useUserPreferencesApi } from '../hooks';
import { UserPreferencesComponent } from './user-preferences.component';
import { UserPreferencesFormComponent } from './user-preferences-form.component';

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
  const hookResultMock = {
    commit: commitMock,
    formValues: initialValuesMock,
    submitErrors: undefined,
    submitWithSuccess: false,
    userPreferences: userPreferencesMock,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mocked(useUserPreferencesApi).mockReturnValue(hookResultMock);
  });

  it('should useUserPreferencesApi have been called', () => {
    // when
    render(<UserPreferencesComponent options={optionsMock} />);
    // then
    expect(useUserPreferencesApi).toHaveBeenCalledTimes(1);
    expect(useUserPreferencesApi).toHaveBeenCalledWith(optionsMock);
  });

  it('should call UserPreferencesComponent with defined params', () => {
    // given
    const formSpy = jest.spyOn(ReactFinalForm, 'Form');
    // when
    render(<UserPreferencesComponent options={optionsMock} />);
    // then
    expect(formSpy).toHaveBeenCalledTimes(1);
    expect(formSpy).toHaveBeenCalledWith(
      expect.objectContaining({ initialValues: initialValuesMock, onSubmit: commitMock }),
      {},
    );
    formSpy.mockRestore();
  });

  it('should call UserPreferencesFormComponent with default params', () => {
    // when
    render(<UserPreferencesComponent options={optionsMock} />);
    // then
    expect(UserPreferencesFormComponent).toHaveBeenCalledTimes(1);
    expect(UserPreferencesFormComponent).toHaveBeenCalledWith(
      {
        canNotSubmit: true,
        onSubmit: expect.any(Function),
        showNotification: false,
        userPreferences: userPreferencesMock,
      },
      {},
    );
  });
});
