import { renderHook, waitFor } from '@testing-library/react';
import { useLocalStorage } from 'usehooks-ts';

import { post } from '@fc/http-client';

import type { FraudConfigInterface, FraudFormValuesInterface } from '../interfaces';
import { useFraudFormApi } from './use-fraud-form-api.hook';

describe('useFraudFormApi', () => {
  // Given
  const options = {
    apiRouteFraudForm: 'any-route',
  } as unknown as FraudConfigInterface;

  const formValuesMock: FraudFormValuesInterface = {
    authenticationEventId: 'mock-uuid',
    comment: 'mock-comment',
    contactEmail: 'mock@email.fr',
    fraudSurveyOrigin: 'mock-origin',
    idpEmail: 'email@idp.com',
    phoneNumber: 'mock-number',
  };

  it('should call useLocalStorage hook with surveyOriginQueryParam', () => {
    // When
    renderHook(() => useFraudFormApi(options));

    // Then
    expect(useLocalStorage).toHaveBeenCalledOnce();
    expect(useLocalStorage).toHaveBeenCalledWith(options.surveyOriginQueryParam, {
      createdAt: expect.any(Number),
      value: '',
    });
  });

  it('should call post when commit is called with params', async () => {
    // When
    const { result } = renderHook(() => useFraudFormApi(options));
    result.current.commit(formValuesMock);

    // Then
    await waitFor(() => {
      expect(post).toHaveBeenCalledOnce();
      expect(post).toHaveBeenCalledWith(options.apiRouteFraudForm, formValuesMock);
    });
  });

  it('should resolve post and remove the localStorage value', async () => {
    const removeLocalStorageMock = jest.fn();
    jest
      .mocked(useLocalStorage)
      .mockReturnValueOnce(['mock-value', jest.fn(), removeLocalStorageMock]);

    // When
    const { result } = renderHook(() => useFraudFormApi(options));
    result.current.commit(formValuesMock);

    // Then
    await waitFor(() => {
      expect(removeLocalStorageMock).toHaveBeenCalledOnce();
    });
  });

  it('should reject post and return errored values', async () => {
    // Given
    const errorMock = new Error('any-error');
    jest.mocked(post).mockRejectedValueOnce(errorMock);

    // hen
    const { result } = renderHook(() => useFraudFormApi(options));
    result.current.commit(formValuesMock);

    // Then
    await waitFor(() => {
      expect(result.current).toStrictEqual({
        commit: expect.any(Function),
        submitErrors: errorMock,
        submitWithSuccess: false,
      });
    });
  });
});
