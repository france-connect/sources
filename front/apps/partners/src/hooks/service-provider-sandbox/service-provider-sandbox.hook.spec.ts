import { renderHook } from '@testing-library/react';
import React from 'react';

import { useAddServiceProviderConfig } from '../add-service-provider-config';
import { useGetServiceProviderConfigs } from '../get-service-provider-configs';
import { useServiceProviderSandbox } from './service-provider-sandbox.hook';

jest.mock('../add-service-provider-config');
jest.mock('../get-service-provider-configs');

describe('useServiceProviderSandbox', () => {
  // given
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

  const configsMock = fetchedConfigsMock;
  const setConfigsMock = jest.fn();

  jest.spyOn(React, 'useState').mockImplementationOnce(() => [configsMock, setConfigsMock]);
  const responseUseServiceProviderSandboxMock = {
    addConfig: jest.fn(),
    configAdded: {
      items: [
        {
          id: 'any-new-id',
          title: 'any-new-title',
        },
      ],
      total: 2,
    },
    onAddConfigError: jest.fn(),
    onAddConfigSuccess: jest.fn(),
  };

  beforeEach(() => {
    // given
    jest.mocked(useGetServiceProviderConfigs).mockReturnValueOnce({
      fetchedConfigs: fetchedConfigsMock,
      onFetchConfigsError: jest.fn(),
      onFetchConfigsSuccess: jest.fn(),
    });
    jest
      .mocked(useAddServiceProviderConfig)
      .mockReturnValueOnce(responseUseServiceProviderSandboxMock);
  });

  it('should return an object with configs object and addConfigs funnction', () => {
    // when
    const { result } = renderHook(() => useServiceProviderSandbox('any-id'));

    // then
    expect(result.current).toEqual(
      expect.objectContaining({
        addConfig: responseUseServiceProviderSandboxMock.addConfig,
        configs: fetchedConfigsMock,
      }),
    );
  });

  it('should return an object with configs set at undefined and addConfigs function', () => {
    // given
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [{ items: [], total: 0 }, setConfigsMock]);

    // when
    const { result } = renderHook(() => useServiceProviderSandbox('any-id'));

    // then
    expect(result.current).toEqual(
      expect.objectContaining({
        addConfig: responseUseServiceProviderSandboxMock.addConfig,
        configs: {
          items: [],
          total: 0,
        },
      }),
    );
  });
});
