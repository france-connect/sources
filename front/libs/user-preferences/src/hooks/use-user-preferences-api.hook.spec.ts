import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import axios, { AxiosResponse } from 'axios';
import { mocked } from 'ts-jest/utils';

import { useApiGet } from '@fc/common';

import { FormValues, IGetCsrfTokenResponse } from '../interfaces';
import { UserPreferencesService } from '../services/user-preferences.service';
import { useUserPreferencesApi } from './use-user-preferences-api.hook';

// given
jest.mock('axios');
jest.mock('../services/user-preferences.service');

describe('useUserPreferencesApi', () => {
  // given
  const options = { API_ROUTE_CSRF_TOKEN: 'token-route', API_ROUTE_USER_PREFERENCES: 'any-route' };

  const userPreferences = {
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

  const idpList = {
    'uid-mock-1': false,
    'uid-mock-2': true,
    'uid-mock-3': false,
  };

  const csrfToken = 'csrfTokenMockValue';

  const getCsrfTokenResponse = {
    data: {
      csrfToken,
    },
  } as unknown as AxiosResponse<IGetCsrfTokenResponse>;

  beforeEach(() => {
    jest.clearAllMocks();
    mocked(useApiGet).mockReturnValue(userPreferences);
  });

  describe('reading preferences', () => {
    beforeEach(() => {
      mocked(useApiGet).mockReturnValue(userPreferences);
    });

    it('should return an object with default values at first render', () => {
      // given
      mocked(useApiGet).mockReturnValue(undefined);
      // when
      const { result } = renderHook(() => useUserPreferencesApi(options));
      // then
      expect(result.current).toStrictEqual({
        commit: expect.any(Function),
        formValues: undefined,
        submitErrors: undefined,
        submitWithSuccess: false,
        userPreferences: undefined,
      });
    });
  });

  describe('updating preferences', () => {
    beforeEach(() => {
      mocked(axios.get).mockResolvedValue(getCsrfTokenResponse);
    });

    it('should call UserPreferencesService.parseFormData when userPreferences are defined but none formValues', () => {
      // when
      renderHook(() => useUserPreferencesApi(options));
      // then
      expect(UserPreferencesService.parseFormData).toHaveBeenCalledTimes(1);
      expect(UserPreferencesService.parseFormData).toHaveBeenCalledWith(userPreferences);
    });

    it('should return formValues when userPreferences are defined at first render', () => {
      // given
      mocked(UserPreferencesService.parseFormData).mockReturnValueOnce({
        allowFutureIdp: true,
        idpList,
      });
      // when
      const { result } = renderHook(() => useUserPreferencesApi(options));
      // then
      expect(result.current).toStrictEqual({
        commit: expect.any(Function),
        formValues: {
          allowFutureIdp: false,
          idpList,
        },
        submitErrors: undefined,
        submitWithSuccess: false,
        userPreferences,
      });
    });

    it('should call UserPreferencesService.encodeFormData when commit is called with params', async () => {
      // given
      mocked(UserPreferencesService.parseFormData).mockReturnValueOnce({
        allowFutureIdp: true,
        idpList,
      });
      // when
      const { result, waitForNextUpdate } = renderHook(() => useUserPreferencesApi(options));
      act(() => {
        result.current.commit({ allowFutureIdp: false, idpList });
      });
      // then
      await waitForNextUpdate();
      expect(UserPreferencesService.encodeFormData).toHaveBeenCalledTimes(1);
      expect(UserPreferencesService.encodeFormData).toHaveBeenCalledWith({
        allowFutureIdp: true,
        csrfToken,
        idpList,
      });
    });

    it('should call axios.post when commit is called with params', async () => {
      // given
      mocked(UserPreferencesService.parseFormData).mockReturnValueOnce({
        allowFutureIdp: true,
        idpList,
      });
      const dataMock = new URLSearchParams();
      dataMock.append('allowFutureIdp', 'true');
      dataMock.append('idpList', 'idplistmock');
      mocked(UserPreferencesService.encodeFormData).mockReturnValueOnce(dataMock);
      // when
      const { result, waitForNextUpdate } = renderHook(() => useUserPreferencesApi(options));
      act(() => {
        result.current.commit({ allowFutureIdp: false, idpList });
      });
      // then
      await waitForNextUpdate();
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(options.API_ROUTE_USER_PREFERENCES, dataMock);
    });

    it('should resolve axios.post and return formValues', async () => {
      // given
      const checkedSymbol = Symbol('checked');
      const dataValueMock = {
        allowFutureIdp: false,
        idpList: [
          {
            active: false,
            image: 'any-image',
            isChecked: checkedSymbol,
            name: 'any-name-1',
            title: 'any-title',
            uid: 'any-uid-1',
          },
        ],
      };
      const parseFormDataMock = mocked(UserPreferencesService.parseFormData).mockImplementation(
        (v) => v as unknown as FormValues,
      );
      mocked(axios.post).mockResolvedValueOnce({ data: dataValueMock });
      /**
       * @todo review tests format and delimiters
       * (multiple // when, expects in when)
       */
      // when
      const { result, waitForNextUpdate } = renderHook(() => useUserPreferencesApi(options));
      // when
      act(() => {
        result.current.commit({ allowFutureIdp: false, idpList: expect.any(Object) });
      });
      // then
      await waitForNextUpdate();
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(UserPreferencesService.encodeFormData).toHaveBeenCalledTimes(1);
      expect(UserPreferencesService.encodeFormData).toHaveBeenCalledWith({
        allowFutureIdp: true,
        csrfToken: 'csrfTokenMockValue',
        idpList: expect.any(Object),
      });
      expect(UserPreferencesService.parseFormData).toHaveBeenCalledTimes(2);
      expect(UserPreferencesService.parseFormData).toHaveBeenNthCalledWith(2, dataValueMock);
      expect(result.current).toStrictEqual({
        commit: expect.any(Function),
        formValues: { ...dataValueMock, allowFutureIdp: !dataValueMock.allowFutureIdp },
        submitErrors: undefined,
        submitWithSuccess: true,
        userPreferences: { allowFutureIdp: false, idpList: expect.any(Object) },
      });
      // reset
      parseFormDataMock.mockReset();
    });

    it('should reject axios.post and return errored values', async () => {
      // given
      mocked(UserPreferencesService.parseFormData).mockReturnValueOnce({
        allowFutureIdp: true,
        idpList,
      });
      const errorMock = new Error('any-error');
      mocked(axios.post).mockRejectedValueOnce(errorMock);
      // when
      const { result, waitForNextUpdate } = renderHook(() => useUserPreferencesApi(options));
      // when
      act(() => {
        result.current.commit({ allowFutureIdp: false, idpList: expect.any(Object) });
      });
      // then
      await waitForNextUpdate();
      expect(result.current).toStrictEqual({
        commit: expect.any(Function),
        formValues: {
          allowFutureIdp: false,
          idpList,
        },
        submitErrors: errorMock,
        submitWithSuccess: false,
        userPreferences: { allowFutureIdp: false, idpList: expect.any(Object) },
      });
    });
  });
});
