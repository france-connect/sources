import type { AxiosResponse } from 'axios';

import { ConfigService } from '@fc/config';
import { get } from '@fc/http-client';

import { loadStatus } from './status.loader';

describe('loadStatus', () => {
  // Given
  const responseMock = { data: { status: 'any-status-mock' } } as unknown as AxiosResponse;

  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({
      apiRouteStatus: 'acme-status-route-mock',
    });
    jest.mocked(get).mockResolvedValue(responseMock);
  });

  it('should retrieve the nexus config', async () => {
    // When
    await loadStatus();

    // Then
    expect(ConfigService.get).toHaveBeenCalledExactlyOnceWith('Nexus');
  });

  it('should fetch the status', async () => {
    // When
    await loadStatus();

    // Then
    expect(get).toHaveBeenCalledExactlyOnceWith('acme-status-route-mock');
  });

  it('should return the response', async () => {
    // When
    const result = await loadStatus();

    // Then
    expect(result).toBe(responseMock);
  });

  it('should throw an error if the request fails', async () => {
    // Given
    const errorMock = new Error('Error fetching status');
    jest.mocked(get).mockRejectedValueOnce(errorMock);

    // When / Then
    await expect(loadStatus()).rejects.toEqual(errorMock);
  });
});
