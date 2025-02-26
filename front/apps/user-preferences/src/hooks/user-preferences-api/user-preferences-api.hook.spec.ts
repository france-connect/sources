import { renderHook, waitFor } from '@testing-library/react';
import type { AxiosResponse } from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ConfigService } from '@fc/config';
import { get, post } from '@fc/http-client';

import type { UserPreferencesDataInterface } from '../../interfaces';
import { UserPreferencesService } from '../../services';
import { useUserPreferencesApi } from './user-preferences-api.hook';

// Given
jest.mock('../../services/user-preferences.service');

describe('useUserPreferencesApi', () => {
  // Given
  const encodedIdpListMock = ['any-uid-2-mock', 'any-uid-4-mock'];
  const allowFutureIdpMock = Symbol('allow-future-idp-mock') as unknown as boolean;
  const idpListMock = {
    anyUid1Mock: false,
    anyUid2Mock: true,
    anyUid3Mock: false,
    anyUid4Mock: true,
  };

  const formValuesMock = {
    allowFutureIdp: allowFutureIdpMock,
    idpList: idpListMock,
  };

  const responseMock = {
    data: {
      allowFutureIdp: allowFutureIdpMock,
      idpList: [
        {
          isChecked: false,
          uid: 'any-uid-1-mock',
        },
        {
          isChecked: true,
          uid: 'any-uid-2-mock',
        },
        {
          isChecked: false,
          uid: 'any-uid-3-mock',
        },
        {
          isChecked: true,
          uid: 'any-uid-4-mock',
        },
      ],
    },
  } as unknown as AxiosResponse<UserPreferencesDataInterface>;

  beforeEach(() => {
    // Given
    jest.mocked(get).mockResolvedValue(responseMock);
    jest.mocked(post).mockResolvedValue(responseMock);
    jest.mocked(UserPreferencesService.parseFormData).mockReturnValue(formValuesMock);
    jest.mocked(UserPreferencesService.encodeFormData).mockReturnValue({
      allowFutureIdp: allowFutureIdpMock,
      idpList: encodedIdpListMock,
    });
    jest.mocked(ConfigService.get).mockReturnValue({
      endpoints: {
        userPreferences: 'any-user-preferences-route-mock',
      },
    });
  });

  it('should return default values at first render', async () => {
    // Given
    // @NOTE mocking useEffect
    // Cause:
    // - the useEffect is called at the first render
    // - and make the api call
    // - that will call internals useState effect
    const useEffectSpy = jest.spyOn(React, 'useEffect');
    useEffectSpy.mockImplementationOnce(jest.fn());

    // When
    const { result } = renderHook(() => useUserPreferencesApi());

    // Then
    expect(useEffectSpy).toHaveBeenCalledWith(expect.any(Function), []);
    expect(result.current).toStrictEqual({
      commit: expect.any(Function),
      formValues: undefined,
      submitErrors: undefined,
      submitWithSuccess: false,
      userPreferences: undefined,
      validateHandler: expect.any(Function),
    });
  });

  describe('fetch', () => {
    it('should fetch user preferences only once', async () => {
      // When
      const { rerender, result } = renderHook(() => useUserPreferencesApi());
      // @NOTE force multiple rerenders
      rerender();
      rerender();
      rerender();
      rerender();

      await waitFor(() => {
        // Then
        expect(get).toHaveBeenCalledOnce();
        expect(get).toHaveBeenCalledWith('any-user-preferences-route-mock');
        expect(result.current).toStrictEqual({
          commit: expect.any(Function),
          formValues: formValuesMock,
          submitErrors: undefined,
          submitWithSuccess: false,
          userPreferences: responseMock.data,
          validateHandler: expect.any(Function),
        });
      });
    });

    it('should navigate to home page when fetch user preferences failed', async () => {
      // Given
      const navigateMock = jest.fn();

      jest.mocked(useNavigate).mockReturnValueOnce(navigateMock);
      jest.mocked(get).mockRejectedValueOnce({
        response: { status: 'any-status-code' },
      });

      // When
      renderHook(() => useUserPreferencesApi());

      await waitFor(() => {
        // Then
        expect(get).toHaveBeenCalledOnce();
        expect(get).toHaveBeenCalledWith('any-user-preferences-route-mock');
        expect(navigateMock).toHaveBeenCalledOnce();
        expect(navigateMock).toHaveBeenCalledWith('/', { replace: true });
      });
    });
  });

  describe('commit', () => {
    it('should update values when form submission successed', async () => {
      // When
      const { result } = renderHook(() => useUserPreferencesApi());
      result.current.commit({
        allowFutureIdp: allowFutureIdpMock,
        idpList: idpListMock,
      });

      await waitFor(() => {
        // Then
        expect(result.current).toStrictEqual({
          commit: expect.any(Function),
          formValues: formValuesMock,
          submitErrors: undefined,
          submitWithSuccess: true,
          userPreferences: responseMock.data,
          validateHandler: expect.any(Function),
        });
      });
    });

    it('should not update values when form submission failed', async () => {
      // Given
      jest.mocked(post).mockRejectedValueOnce(new Error('any-error-mock'));

      // When
      const { result } = renderHook(() => useUserPreferencesApi());
      result.current.commit({
        allowFutureIdp: allowFutureIdpMock,
        idpList: idpListMock,
      });

      await waitFor(() => {
        // Then
        expect(result.current).toStrictEqual({
          commit: expect.any(Function),
          formValues: formValuesMock,
          submitErrors: new Error('any-error-mock'),
          submitWithSuccess: false,
          userPreferences: responseMock.data,
          validateHandler: expect.any(Function),
        });
      });
    });

    it('should navigate to error page when form submission failed with status 409', async () => {
      // Given
      const navigateMock = jest.fn();

      jest.mocked(useNavigate).mockReturnValueOnce(navigateMock);
      jest.mocked(post).mockRejectedValueOnce({
        status: 409,
      });

      // When
      const { result } = renderHook(() => useUserPreferencesApi());
      result.current.commit({
        allowFutureIdp: allowFutureIdpMock,
        idpList: idpListMock,
      });

      await waitFor(() => {
        // Then
        expect(navigateMock).toHaveBeenCalledOnce();
        expect(navigateMock).toHaveBeenCalledWith('/error/409', { replace: true });
        expect(result.current).toStrictEqual({
          commit: expect.any(Function),
          formValues: formValuesMock,
          submitErrors: undefined,
          submitWithSuccess: false,
          userPreferences: responseMock.data,
          validateHandler: expect.any(Function),
        });
      });
    });
  });

  describe('validateHandler', () => {
    it('should return a form error if no idp is selected', async () => {
      // When
      const { result } = renderHook(() => useUserPreferencesApi());
      const validation = result.current.validateHandler({
        idpList: {
          anyUid1Mock: false,
          anyUid2Mock: false,
          anyUid3Mock: false,
          anyUid4Mock: false,
        },
      });

      await waitFor(() => {
        // Then
        expect(validation).toStrictEqual({
          idpList: 'error',
        });
      });
    });

    it('should return undefined if some idp are selected', async () => {
      // When
      const { result } = renderHook(() => useUserPreferencesApi());
      const validation = result.current.validateHandler({
        idpList: {
          anyUid1Mock: false,
          anyUid2Mock: false,
          anyUid3Mock: true,
          anyUid4Mock: false,
        },
      });

      await waitFor(() => {
        // Then
        expect(validation).toBeUndefined();
      });
    });
  });
});
