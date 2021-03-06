import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { mocked } from 'ts-jest/utils';

import { UserPreferencesData } from '../interfaces';
import { checkHasDefaultConfiguration, checkSomeIdpHasBeenChangedSinceLoading } from '../utils';
import { useUserPreferencesForm } from './use-user-preferences-form.hook';

jest.mock('../utils');

describe('useUserPreferencesForm', () => {
  const userPreferences: UserPreferencesData = {
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

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should return an object with default values at first render', () => {
    // given
    mocked(checkHasDefaultConfiguration).mockReturnValueOnce(true);
    mocked(checkSomeIdpHasBeenChangedSinceLoading).mockReturnValueOnce(true);

    // when
    const { result } = renderHook(() => useUserPreferencesForm(options));

    // then
    expect(result.current).toStrictEqual({
      alertInfoState: {
        hasInteractedWithAlertInfo: false,
        isDisplayedAlertInfo: true,
      },
      allowingIdPConfirmation: expect.any(Function),
    });
  });

  it('should call setAlertInfoState when allowingIdPConfirmation is called', () => {
    // given
    mocked(checkHasDefaultConfiguration).mockReturnValueOnce(true);
    mocked(checkSomeIdpHasBeenChangedSinceLoading).mockReturnValueOnce(true);
    const setAlertInfoStateMock = jest.fn();
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [
      {
        hasInteractedWithAlertInfo: false,
        isDisplayedAlertInfo: false,
      },
      setAlertInfoStateMock,
    ]);
    jest.spyOn(React, 'useEffect').mockImplementationOnce(() => jest.fn());

    // when
    const { result } = renderHook(() => useUserPreferencesForm(options));

    act(() => {
      result.current.allowingIdPConfirmation();
    });

    // then
    expect(setAlertInfoStateMock).toHaveBeenCalledTimes(1);
    expect(setAlertInfoStateMock).toHaveBeenCalledWith(expect.any(Function));
  });
});
