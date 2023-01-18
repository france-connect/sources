import { act, renderHook } from '@testing-library/react';
import { AxiosResponse } from 'axios';
import React from 'react';

import { ConfigService } from '@fc/config';
import * as HttpClientService from '@fc/http-client';

import { useAddServiceProviderConfig } from './add-service-provider-config.hook';

jest.mock('@fc/http-client');

describe('useAddServiceProviderConfig', () => {
  const configServiceEndpoint = 'any-url';
  const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
  const dataMock = {
    meta: {
      total: 2,
      urls: {
        delete: 'any-delete-url',
        view: 'any-view-url',
      },
    },
    payload: {
      id: 'any-id',
      name: 'any-name',
    },
    type: 'any-type',
  };

  const responseMock = {
    config: expect.any(Object),
    data: dataMock,
    headers: expect.any(Object),
    status: expect.any(Object),
    statusText: expect.any(String),
  };

  const responseErrorMock = {
    data: undefined,
  } as unknown as AxiosResponse;

  const errorMock = {
    message: 'any-text-error',
    name: 'error-name',
  };

  const configAddedMock = {
    items: [dataMock.payload],
    total: 2,
  };

  const setConfigAddedMock = jest.fn();

  beforeEach(() => {
    // given
    jest
      .mocked(ConfigService.get)
      .mockReturnValueOnce({ endpoints: { serviceProvidersConfigs: configServiceEndpoint } });
    jest.spyOn(React, 'useState').mockImplementation(() => [configAddedMock, setConfigAddedMock]);
  });

  it('should return an object with configAdded', () => {
    // given
    jest.mocked(HttpClientService.post).mockResolvedValueOnce(responseMock);

    // when
    const { result } = renderHook(() => useAddServiceProviderConfig('any-id'));

    act(() => {
      result.current.onAddConfigSuccess(responseMock);
    });

    // then
    expect(result.current).toEqual(
      expect.objectContaining({
        configAdded: configAddedMock,
      }),
    );
  });

  it('should console an error and returned configAdded set at undefined, when promise is rejected,', () => {
    // given
    jest.mocked(HttpClientService.post).mockRejectedValueOnce(responseErrorMock);
    jest.spyOn(React, 'useState').mockImplementation(() => [undefined, setConfigAddedMock]);

    // when
    const { result } = renderHook(() => useAddServiceProviderConfig('any-id'));
    act(() => {
      result.current.onAddConfigError(errorMock);
    });

    // then
    expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    expect(result.current).toEqual(
      expect.objectContaining({
        configAdded: undefined,
      }),
    );
  });

  it('should call HttpClientService with parameters', () => {
    // given
    jest.mocked(HttpClientService.post).mockResolvedValueOnce(responseMock);

    // when
    const { result } = renderHook(() => useAddServiceProviderConfig('any-id'));
    act(() => {
      result.current.addConfig();
    });

    // then
    expect(HttpClientService.post).toHaveBeenCalledWith('any-url', {
      serviceProviderId: 'any-id',
    });
  });
});
