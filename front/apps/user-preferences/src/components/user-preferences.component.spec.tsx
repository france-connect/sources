import { render } from '@testing-library/react';
import { Form } from 'react-final-form';

import { useUserPreferencesApi } from '../hooks';
import type { UserPreferencesDataInterface } from '../interfaces';
import { UserPreferencesComponent } from './user-preferences.component';
import { UserPreferencesFormComponent } from './user-preferences-form.component';

jest.mock('../hooks/user-preferences-api/user-preferences-api.hook');
jest.mock('./services-list.component');
jest.mock('./user-preferences-form.component');

describe('UserPreferencesComponent', () => {
  // Given
  const userPreferencesMock = {
    allowFutureIdp: false,
    idpList: [expect.any(Object), expect.any(Object)],
  };
  const hookResultMock = {
    commit: jest.fn(),
    formValues: { allowFutureIdp: false, idpList: expect.any(Object) },
    submitErrors: undefined,
    submitWithSuccess: false,
    userPreferences: userPreferencesMock,
    validateHandler: jest.fn(),
  };

  it('should match the snapshot', () => {
    // Given
    jest.mocked(useUserPreferencesApi).mockReturnValueOnce(hookResultMock);

    // When
    const { container } = render(<UserPreferencesComponent />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot if showServicesList is false because userpreferences is null', () => {
    // Given
    jest.mocked(useUserPreferencesApi).mockReturnValueOnce({
      ...hookResultMock,
      userPreferences: null as unknown as UserPreferencesDataInterface,
    });

    // When
    render(<UserPreferencesComponent />);

    // Then
    expect(Form).not.toHaveBeenCalled();
  });

  it('should match the snapshot if showServicesList is false because userpreferences is empty', () => {
    // Given
    jest.mocked(useUserPreferencesApi).mockReturnValueOnce({
      ...hookResultMock,
      userPreferences: {} as unknown as UserPreferencesDataInterface,
    });

    // When
    render(<UserPreferencesComponent />);

    // Then
    expect(Form).not.toHaveBeenCalled();
  });

  it('should match the snapshot if showServicesList is false because idpList is missing', () => {
    // Given
    jest.mocked(useUserPreferencesApi).mockReturnValueOnce({
      ...hookResultMock,
      userPreferences: { allowFutureIdp: false, idpList: undefined },
    });

    // When
    render(<UserPreferencesComponent />);

    // Then
    expect(Form).not.toHaveBeenCalled();
  });

  it('should match the snapshot if showServicesList is false because idpList length is null', () => {
    // Given
    jest.mocked(useUserPreferencesApi).mockReturnValueOnce({
      ...hookResultMock,
      userPreferences: { ...userPreferencesMock, idpList: [] },
    });

    // When
    render(<UserPreferencesComponent />);

    // Then
    expect(Form).not.toHaveBeenCalled();
  });

  it('should have called useUserPreferencesApi', () => {
    // Given
    jest.mocked(useUserPreferencesApi).mockReturnValueOnce(hookResultMock);

    // When
    render(<UserPreferencesComponent />);

    // Then
    expect(useUserPreferencesApi).toHaveBeenCalledOnce();
    expect(useUserPreferencesApi).toHaveBeenCalledWith();
  });

  it('should call UserPreferencesFormComponent with props', () => {
    // Given
    jest.mocked(useUserPreferencesApi).mockReturnValueOnce({
      ...hookResultMock,
      submitWithSuccess: true,
    });

    // When
    render(<UserPreferencesComponent />);

    // Then
    expect(jest.mocked(UserPreferencesFormComponent)).toHaveBeenCalledWith(
      {
        submitWithSuccess: true,
        userPreferences: userPreferencesMock,
      },
      undefined,
    );
  });
});
