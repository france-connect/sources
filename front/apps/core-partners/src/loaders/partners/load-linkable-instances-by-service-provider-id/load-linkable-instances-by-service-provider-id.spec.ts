import type { LoaderFunctionArgs } from 'react-router';
import { generatePath } from 'react-router';

import { ConfigService } from '@fc/config';
import { fetchWithAuthHandling } from '@fc/http-client';

import { loadLinkableInstancesByServiceProviderId } from './load-linkable-instances-by-service-provider-id';

describe('loadLinkableInstancesByServiceProviderId', () => {
  const paramsMock = {
    params: { serviceProviderId: 'service-provider-id-1' },
  } as unknown as LoaderFunctionArgs;

  beforeEach(() => {
    jest.mocked(ConfigService.get).mockReturnValue({
      endpoints: {
        linkableInstancesByServiceProviderId: '/api/linkable-instances/:serviceProviderId',
      },
    } as never);
    jest.mocked(generatePath).mockReturnValue('/api/linkable-instances/service-provider-id-1');
  });

  it('should call the linkable instances endpoint with the service provider ID', async () => {
    // Given
    jest.mocked(fetchWithAuthHandling).mockResolvedValueOnce({
      payload: {
        instances: [],
        serviceProvider: {
          datapassRequestId: 'DP-1234',
          id: 'service-provider-id-1',
          name: 'Service Provider 1',
        },
      },
      type: 'INSTANCE',
    } as never);

    // When
    await loadLinkableInstancesByServiceProviderId(paramsMock);

    // Then
    expect(ConfigService.get).toHaveBeenCalledExactlyOnceWith('Partners');
    expect(generatePath).toHaveBeenCalledExactlyOnceWith(
      '/api/linkable-instances/:serviceProviderId',
      { serviceProviderId: 'service-provider-id-1' },
    );
    expect(fetchWithAuthHandling).toHaveBeenCalledExactlyOnceWith(
      '/api/linkable-instances/service-provider-id-1',
    );
  });

  it('should map API response to linkable instances payload using serviceProvider info', async () => {
    // Given
    const instancesMock = [
      { currentVersion: { data: { name: 'Instance 1' } }, id: 'instance-id-1' },
      { currentVersion: { data: { name: 'Instance 2' } }, id: 'instance-id-2' },
    ];
    jest.mocked(fetchWithAuthHandling).mockResolvedValueOnce({
      payload: {
        instances: instancesMock,
        serviceProvider: {
          datapassRequestId: 'DP-1234',
          id: 'service-provider-id-1',
          name: 'Service Provider 1',
        },
      },
      type: 'INSTANCE',
    } as never);

    // When
    const result = await loadLinkableInstancesByServiceProviderId(paramsMock);

    // Then
    expect(result).toStrictEqual({
      payload: {
        datapassRequestId: 'DP-1234',
        linkableInstances: instancesMock,
        serviceProviderId: 'service-provider-id-1',
        serviceProviderName: 'Service Provider 1',
      },
      type: 'INSTANCE',
    });
  });

  it('should return empty linkable instances when API returns null', async () => {
    // Given
    jest.mocked(fetchWithAuthHandling).mockResolvedValueOnce(null as never);

    // When
    const result = await loadLinkableInstancesByServiceProviderId(paramsMock);

    // Then
    expect(result).toStrictEqual({
      payload: {
        datapassRequestId: '',
        linkableInstances: [],
        serviceProviderId: 'service-provider-id-1',
        serviceProviderName: '',
      },
      type: 'loadLinkableInstancesByServiceProviderId',
    });
  });

  it('should throw when route param serviceProviderId is missing', async () => {
    // Given
    const missingParamMock = { params: {} } as unknown as LoaderFunctionArgs;

    // When / Then
    await expect(loadLinkableInstancesByServiceProviderId(missingParamMock)).rejects.toThrow(
      '[Partners] Missing "serviceProviderId" route parameter.',
    );
  });

  it('should rethrow API errors from endpoint', async () => {
    // Given
    const errorMock = { status: 500 };
    jest.mocked(fetchWithAuthHandling).mockRejectedValueOnce(errorMock);

    // When / Then
    await expect(loadLinkableInstancesByServiceProviderId(paramsMock)).rejects.toBe(errorMock);
  });
});
