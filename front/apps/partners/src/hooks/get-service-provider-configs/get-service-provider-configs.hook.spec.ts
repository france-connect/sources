import { act, renderHook } from '@testing-library/react';
import React from 'react';

import { ConfigService } from '@fc/config';
import * as HttpClientService from '@fc/http-client';

import { useGetServiceProviderConfigs } from './get-service-provider-configs.hook';

jest.mock('@fc/http-client');

describe('useGetServiceProviderConfigs', () => {
  const configServiceEndpoint = 'any-url';
  const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
  const fetchedConfigsMock = {
    items: [
      {
        id: 'any-config-id-1',
        title: 'Configuration de test N°1',
      },
      {
        id: 'any-config-id-2',
        title: 'Configuration de test N°2',
      },
    ],
    total: 2,
  };

  const setFetchedConfigsMock = jest.fn();

  const dataMock = {
    meta: {
      total: 2,
    },
    payload: [
      {
        payload: {
          id: 'any-config-id-1',
          name: 'Configuration de test N°1',
        },
        type: 'SERVICE_PROVIDER_CONFIGURATION_ITEM',
      },
    ],
  };
  const responseMock = {
    config: expect.any(Object),
    data: dataMock,
    headers: expect.any(Object),
    status: expect.any(Object),
    statusText: expect.any(String),
  };
  const errorMock = {
    message: 'any-text-error',
    name: 'error-name',
  };

  beforeEach(() => {
    // given
    jest
      .mocked(ConfigService.get)
      .mockReturnValueOnce({ endpoints: { serviceProvidersConfigs: configServiceEndpoint } });
  });

  it('should return an object with fetchedConfigs', () => {
    // given
    jest.mocked(HttpClientService.get).mockResolvedValueOnce(responseMock);
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [fetchedConfigsMock, setFetchedConfigsMock]);

    // when
    const { result } = renderHook(() => useGetServiceProviderConfigs('any-id'));
    act(() => {
      result.current.onFetchConfigsSuccess(responseMock);
    });

    // then
    expect(result.current).toEqual(
      expect.objectContaining({
        fetchedConfigs: fetchedConfigsMock,
      }),
    );
  });

  it('should console an error and returned configs set at undefined, when promise is rejected,', () => {
    // given
    jest.mocked(HttpClientService.get).mockRejectedValueOnce(errorMock);
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [undefined, setFetchedConfigsMock]);

    // when
    const { result } = renderHook(() => useGetServiceProviderConfigs('any-id'));
    act(() => {
      result.current.onFetchConfigsError(errorMock);
    });

    // then
    expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    expect(result.current).toEqual(
      expect.objectContaining({
        fetchedConfigs: undefined,
      }),
    );
  });

  it('should call HttpClientService with parameters', () => {
    // given
    jest.mocked(HttpClientService.get).mockResolvedValueOnce(responseMock);

    // when
    renderHook(() => useGetServiceProviderConfigs('any-id'));

    // then
    expect(HttpClientService.get).toHaveBeenCalledWith(
      'any-url',
      {},
      {
        params: {
          serviceProviderId: 'any-id',
        },
      },
    );
  });
});
