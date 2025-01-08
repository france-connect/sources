import { render } from '@testing-library/react';
import { Form } from 'react-final-form';

import { useUserPreferencesApi } from '../hooks';
import type { UserPreferencesDataInterface } from '../interfaces';
import { UserPreferencesComponent } from './user-preferences.component';

jest.mock('../hooks');
jest.mock('./services-list.component');
jest.mock('./user-preferences-form.component');

describe('UserPreferencesComponent', () => {
  // Given
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
    // Given
    jest.mocked(useUserPreferencesApi).mockReturnValue(hookResultMock);

    // When
    const { container } = render(<UserPreferencesComponent />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot if showServicesList is false because userpreferences is null', () => {
    // Given
    jest.mocked(useUserPreferencesApi).mockReturnValue({
      ...hookResultMock,
      userPreferences: null as unknown as UserPreferencesDataInterface,
    });

    // When
    render(<UserPreferencesComponent />);

    // Then
    expect(Form).toHaveBeenCalledTimes(0);
  });

  it('should match the snapshot if showServicesList is false because userpreferences is empty', () => {
    // Given
    jest.mocked(useUserPreferencesApi).mockReturnValue({
      ...hookResultMock,
      userPreferences: {} as unknown as UserPreferencesDataInterface,
    });

    // When
    render(<UserPreferencesComponent />);

    // Then
    expect(Form).toHaveBeenCalledTimes(0);
  });

  it('should match the snapshot if showServicesList is false because idpList is missing', () => {
    // Given
    jest.mocked(useUserPreferencesApi).mockReturnValue({
      ...hookResultMock,
      userPreferences: { allowFutureIdp: false, idpList: undefined },
    });

    // When
    render(<UserPreferencesComponent />);

    // Then
    expect(Form).toHaveBeenCalledTimes(0);
  });

  it('should match the snapshot if showServicesList is false because idpList length is null', () => {
    // Given
    jest.mocked(useUserPreferencesApi).mockReturnValue({
      ...hookResultMock,
      userPreferences: { ...userPreferencesMock, idpList: [] },
    });

    // When
    render(<UserPreferencesComponent />);

    // Then
    expect(Form).toHaveBeenCalledTimes(0);
  });

  it('should have called useUserPreferencesApi', () => {
    // Given
    jest.mocked(useUserPreferencesApi).mockReturnValue(hookResultMock);

    // When
    render(<UserPreferencesComponent />);

    // Then
    expect(useUserPreferencesApi).toHaveBeenCalledOnce();
    expect(useUserPreferencesApi).toHaveBeenCalledWith();
  });
});
