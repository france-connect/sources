import { ConfigService } from '@fc/config';
import { fetchWithAuthHandling } from '@fc/http-client';

import { loadAllServiceProviders } from './load-all-service-providers';

describe('loadAllServiceProviders', () => {
  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({
      endpoints: {
        serviceProviders: '/api-serviceProviders-mock',
      },
    });
  });

  it('should call Dto2FormService.get with params', async () => {
    // Given
    jest.mocked(fetchWithAuthHandling).mockResolvedValueOnce('any-data-result');

    // When
    const result = await loadAllServiceProviders();

    // Then
    expect(ConfigService.get).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledWith('Partners');
    expect(fetchWithAuthHandling).toHaveBeenCalledOnce();
    expect(fetchWithAuthHandling).toHaveBeenCalledWith('/api-serviceProviders-mock');
    expect(result).toBe('any-data-result');
  });
});
