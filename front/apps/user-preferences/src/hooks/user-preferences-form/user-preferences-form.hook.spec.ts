import { act, renderHook } from '@testing-library/react';
import React from 'react';

import type { UserPreferencesDataInterface } from '../../interfaces';
import { checkHasDefaultConfiguration, checkSomeIdpHasBeenChangedSinceLoading } from '../../utils';
import { useUserPreferencesForm } from './user-preferences-form.hook';

jest.mock('../../utils');

describe('useUserPreferencesForm', () => {
  const userPreferences: UserPreferencesDataInterface = {
    allowFutureIdp: false,
    idpList: [
      {
        active: false,
        image: 'any-image',
        isChecked: false,
        name: 'any-name-1',
        title: 'any-title',
        uid: 'any-uid-1',
      },
      {
        active: false,
        image: 'any-image',
        isChecked: true,
        name: 'any-name-2',
        title: 'any-title',
        uid: 'any-uid-2',
      },
      {
        active: false,
        image: 'any-image',
        isChecked: false,
        name: 'any-name-3',
        title: 'any-title',
        uid: 'any-uid-3',
      },
    ],
  };
  const dirtyFields = {};
  const options = { dirtyFields, userPreferences };

  it('should return an object with default values at first render', () => {
    // Given
    jest.mocked(checkHasDefaultConfiguration).mockReturnValueOnce(true);
    jest.mocked(checkSomeIdpHasBeenChangedSinceLoading).mockReturnValueOnce(true);

    // When
    const { result } = renderHook(() => useUserPreferencesForm(options));

    // Then
    expect(result.current).toStrictEqual({
      alertInfoState: {
        hasInteractedWithAlertInfo: false,
        isDisplayedAlertInfo: true,
      },
      allowingIdPConfirmation: expect.any(Function),
    });
  });

  it('should call setAlertInfoState when allowingIdPConfirmation is called', () => {
    // Given
    jest.mocked(checkHasDefaultConfiguration).mockReturnValueOnce(true);
    jest.mocked(checkSomeIdpHasBeenChangedSinceLoading).mockReturnValueOnce(true);
    const setAlertInfoStateMock = jest.fn();
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [
      {
        hasInteractedWithAlertInfo: false,
        isDisplayedAlertInfo: false,
      },
      setAlertInfoStateMock,
    ]);
    jest.spyOn(React, 'useEffect').mockImplementationOnce(() => jest.fn());

    // When
    const { result } = renderHook(() => useUserPreferencesForm(options));

    act(() => {
      result.current.allowingIdPConfirmation();
    });

    // Then
    expect(setAlertInfoStateMock).toHaveBeenCalledOnce();
    expect(setAlertInfoStateMock).toHaveBeenCalledWith(expect.any(Function));
  });
});
