import { render } from '@testing-library/react';
import { Form } from 'react-final-form';

import { useUserPreferencesApi } from '../hooks';
import type { UserPreferencesData } from '../interfaces';
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

  it('should match the snapshot', () => {
    // given
    jest.mocked(useUserPreferencesApi).mockReturnValue(hookResultMock);

    // when
    const { container } = render(<UserPreferencesComponent options={optionsMock} />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot if showServicesList is false because userpreferences is null', () => {
    // given
    jest.mocked(useUserPreferencesApi).mockReturnValue({
      ...hookResultMock,
      userPreferences: null as unknown as UserPreferencesData,
    });

    // when
    render(<UserPreferencesComponent options={optionsMock} />);

    // then
    expect(Form).toHaveBeenCalledTimes(0);
  });

  it('should match the snapshot if showServicesList is false because userpreferences is empty', () => {
    // given
    jest.mocked(useUserPreferencesApi).mockReturnValue({
      ...hookResultMock,
      userPreferences: {} as unknown as UserPreferencesData,
    });

    // when
    render(<UserPreferencesComponent options={optionsMock} />);

    // then
    expect(Form).toHaveBeenCalledTimes(0);
  });

  it('should match the snapshot if showServicesList is false because idpList is missing', () => {
    // given
    jest.mocked(useUserPreferencesApi).mockReturnValue({
      ...hookResultMock,
      userPreferences: { allowFutureIdp: false, idpList: undefined },
    });

    // when
    render(<UserPreferencesComponent options={optionsMock} />);

    // then
    expect(Form).toHaveBeenCalledTimes(0);
  });

  it('should match the snapshot if showServicesList is false because idpList length is null', () => {
    // given
    jest.mocked(useUserPreferencesApi).mockReturnValue({
      ...hookResultMock,
      userPreferences: { ...userPreferencesMock, idpList: [] },
    });

    // when
    render(<UserPreferencesComponent options={optionsMock} />);

    // then
    expect(Form).toHaveBeenCalledTimes(0);
  });

  it('should have called useUserPreferencesApi', () => {
    // given
    jest.mocked(useUserPreferencesApi).mockReturnValue(hookResultMock);

    // when
    render(<UserPreferencesComponent options={optionsMock} />);

    // then
    expect(useUserPreferencesApi).toHaveBeenCalledOnce();
    expect(useUserPreferencesApi).toHaveBeenCalledWith(optionsMock);
  });
});
