import { act, renderHook, waitFor } from '@testing-library/react';
import type { AxiosError, AxiosResponse } from 'axios';
import axios from 'axios';
import * as ReactRouter from 'react-router-dom';

import { useApiGet } from '@fc/common';
import type { GetCsrfTokenResponseInterface } from '@fc/http-client';

import type { FormValuesInterface } from '../interfaces';
import { UserPreferencesService } from '../services/user-preferences.service';
import { useUserPreferencesApi, validateHandlerCallback } from './use-user-preferences-api.hook';

// given
jest.mock('axios');
jest.mock('react-router-dom');
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
    uidMock1: false,
    uidMock2: true,
    uidMock3: false,
  };

  const csrfToken = 'csrfTokenMockValue';
  const formValuesMock = { allowFutureIdp: false, idpList };

  const getCsrfTokenResponseInterface = {
    data: {
      csrfToken,
    },
  } as unknown as AxiosResponse<GetCsrfTokenResponseInterface>;

  beforeEach(() => {
    // given
    jest.mocked(useApiGet).mockReturnValue(userPreferences);
  });

  describe('reading preferences', () => {
    beforeEach(() => {
      jest.mocked(useApiGet).mockReturnValue(userPreferences);
    });

    it('should return an object with default values at first render', () => {
      // given
      jest.mocked(useApiGet).mockReturnValue(undefined);

      // when
      const { result } = renderHook(() => useUserPreferencesApi(options));

      // then
      expect(result.current).toStrictEqual({
        commit: expect.any(Function),
        formValues: undefined,
        submitErrors: undefined,
        submitWithSuccess: false,
        userPreferences: undefined,
        validateHandler: expect.any(Function),
      });
    });
  });

  describe('updating preferences', () => {
    beforeEach(() => {
      jest.mocked(axios.get).mockResolvedValue(getCsrfTokenResponseInterface);
    });

    it('should call UserPreferencesService.parseFormData when userPreferences are defined but none formValues', () => {
      // given
      jest.mocked(UserPreferencesService.parseFormData).mockReturnValueOnce({
        allowFutureIdp: userPreferences.allowFutureIdp,
        idpList,
      });

      // when
      renderHook(() => useUserPreferencesApi(options));

      // then
      expect(UserPreferencesService.parseFormData).toHaveBeenCalledOnce();
      expect(UserPreferencesService.parseFormData).toHaveBeenCalledWith(userPreferences);
    });

    it('should return formValues when userPreferences are defined at first render', () => {
      // given
      jest.mocked(UserPreferencesService.parseFormData).mockReturnValueOnce({
        allowFutureIdp: true,
        idpList,
      });
      // when
      const { result } = renderHook(() => useUserPreferencesApi(options));

      // then
      expect(result.current).toStrictEqual({
        commit: expect.any(Function),
        formValues: {
          allowFutureIdp: true,
          idpList,
        },
        submitErrors: undefined,
        submitWithSuccess: false,
        userPreferences,
        validateHandler: expect.any(Function),
      });
    });

    it('should call UserPreferencesService.encodeFormData when commit is called with params', async () => {
      // given
      jest.mocked(UserPreferencesService.parseFormData).mockReturnValueOnce({
        allowFutureIdp: false,
        idpList,
      });

      // when
      const { result } = renderHook(() => useUserPreferencesApi(options));
      act(() => {
        result.current.commit({ allowFutureIdp: false, idpList });
      });

      // then
      await waitFor(() => {
        expect(UserPreferencesService.encodeFormData).toHaveBeenCalledOnce();
        expect(UserPreferencesService.encodeFormData).toHaveBeenCalledWith({
          allowFutureIdp: false,
          csrfToken,
          idpList,
        });
      });
    });

    it('should call axios.post when commit is called with params', async () => {
      // given
      jest.mocked(UserPreferencesService.parseFormData).mockReturnValueOnce({
        allowFutureIdp: true,
        idpList,
      });
      const dataMock = new URLSearchParams();
      dataMock.append('allowFutureIdp', 'true');
      dataMock.append('idpList', 'idplistmock');
      jest.mocked(UserPreferencesService.encodeFormData).mockReturnValueOnce(dataMock);

      // when
      const { result } = renderHook(() => useUserPreferencesApi(options));
      act(() => {
        result.current.commit({ allowFutureIdp: false, idpList });
      });

      // then
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledOnce();
        expect(axios.post).toHaveBeenCalledWith(options.API_ROUTE_USER_PREFERENCES, dataMock);
      });
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
      const parseFormDataMock = jest
        .mocked(UserPreferencesService.parseFormData)
        .mockImplementation((v) => v as unknown as FormValuesInterface);
      jest.mocked(axios.post).mockResolvedValueOnce({ data: dataValueMock });

      /**
       * @todo review tests format and delimiters
       * (multiple // when, expects in when)
       */
      // when
      const { result } = renderHook(() => useUserPreferencesApi(options));

      act(() => {
        result.current.commit({ allowFutureIdp: false, idpList: expect.any(Object) });
      });

      // then
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledOnce();
        expect(UserPreferencesService.encodeFormData).toHaveBeenCalledOnce();
        expect(UserPreferencesService.encodeFormData).toHaveBeenCalledWith({
          allowFutureIdp: false,
          csrfToken: 'csrfTokenMockValue',
          idpList: expect.any(Object),
        });
        expect(UserPreferencesService.parseFormData).toHaveBeenCalledTimes(2);
        expect(UserPreferencesService.parseFormData).toHaveBeenNthCalledWith(2, dataValueMock);
        expect(result.current).toStrictEqual({
          commit: expect.any(Function),
          formValues: { ...dataValueMock },
          submitErrors: undefined,
          submitWithSuccess: true,
          userPreferences: { allowFutureIdp: false, idpList: expect.any(Object) },
          validateHandler: expect.any(Function),
        });
      });
      // reset
      parseFormDataMock.mockReset();
    });

    it('should reject axios.post and return errored values', async () => {
      // given
      jest.mocked(UserPreferencesService.parseFormData).mockReturnValueOnce({
        allowFutureIdp: true,
        idpList,
      });
      const errorMock = new Error('any-error');
      jest.mocked(axios.post).mockRejectedValueOnce(errorMock);

      // when
      const { result } = renderHook(() => useUserPreferencesApi(options));

      act(() => {
        result.current.commit({ allowFutureIdp: false, idpList: expect.any(Object) });
      });

      // then
      await waitFor(() => {
        expect(result.current).toStrictEqual({
          commit: expect.any(Function),
          formValues: {
            allowFutureIdp: true,
            idpList,
          },
          submitErrors: errorMock,
          submitWithSuccess: false,
          userPreferences: { allowFutureIdp: false, idpList: expect.any(Object) },
          validateHandler: expect.any(Function),
        });
      });
    });

    it('should call react-router-dom navigate when axios.post returns 409', async () => {
      // given
      jest.mocked(UserPreferencesService.parseFormData).mockReturnValueOnce(formValuesMock);

      const axioErrorMock = { response: { status: 409 } } as AxiosError;
      jest.mocked(axios.post).mockRejectedValueOnce(axioErrorMock);

      const navigateMock = jest.fn();
      jest
        .mocked(ReactRouter.useNavigate)
        .mockReturnValueOnce(navigateMock)
        .mockReturnValueOnce(navigateMock);

      // // when
      const { result } = renderHook(() => useUserPreferencesApi(options));
      act(() => {
        result.current.commit(formValuesMock);
      });

      // then
      await waitFor(() => {
        expect(navigateMock).toHaveBeenCalledOnce();
        expect(navigateMock).toHaveBeenCalledWith('/error/409', { replace: true });
      });
    });

    it('should return errors if idpList is defined but every idp is unchecked', () => {
      // given
      const idpListAllUnchecked = {
        idpList: {
          uidMock1: false,
          uidMock2: false,
          uidMock3: false,
        },
      };
      const returnValueIfFormHasErrors = {
        idpList: 'error',
      };

      // when
      const result = validateHandlerCallback(idpListAllUnchecked);

      // then
      expect(result).toEqual(returnValueIfFormHasErrors);
    });

    it('should no errors if idpList has checked idps', () => {
      // when
      const result = validateHandlerCallback({ idpList: { ...idpList } });

      // then
      expect(result).toBeUndefined();
    });
  });
});
