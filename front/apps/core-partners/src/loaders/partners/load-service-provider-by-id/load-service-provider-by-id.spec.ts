import { generatePath, type LoaderFunctionArgs } from 'react-router';

import { ConfigService } from '@fc/config';
import { fetchWithAuthHandling } from '@fc/http-client';

import { loadServiceProviderById } from './load-service-provider-by-id';

describe('loadServiceProviderById', () => {
  // Given
  const dataMock = Symbol('any-data-mock');
  const paramsMock = {
    params: { serviceProviderId: '1234' },
  } as unknown as LoaderFunctionArgs;

  beforeEach(() => {
    // Given
    jest.mocked(generatePath).mockReturnValue('any-endpoints-uri-mock/1234');
    jest.mocked(fetchWithAuthHandling).mockResolvedValue(dataMock);
    jest.mocked(ConfigService.get).mockReturnValue({
      endpoints: {
        serviceProvider: 'any-endpoints-uri-mock/:id',
      },
    });
  });

  it('should call ConfigService.get with params', async () => {
    // When
    await loadServiceProviderById(paramsMock);

    // Then
    expect(ConfigService.get).toHaveBeenCalledExactlyOnceWith('Partners');
  });

  it('should call generatePath with parameters', async () => {
    // When
    await loadServiceProviderById(paramsMock);

    // Then
    expect(generatePath).toHaveBeenCalledExactlyOnceWith('any-endpoints-uri-mock/:id', {
      id: '1234',
    });
  });

  it('should call fetchWithAuthHandling with params', async () => {
    // Given
    const uri = 'any-endpoints-uri-mock/1234';
    jest.mocked(generatePath).mockReturnValueOnce(uri);

    // When
    await loadServiceProviderById(paramsMock);

    // Then
    expect(fetchWithAuthHandling).toHaveBeenCalledExactlyOnceWith(uri);
  });

  it('should return the hook results', async () => {
    // When
    const result = await loadServiceProviderById(paramsMock);

    // Then
    expect(result).toStrictEqual(dataMock);
  });
});
