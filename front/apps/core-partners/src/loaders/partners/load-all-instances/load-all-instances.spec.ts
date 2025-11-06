import { ConfigService } from '@fc/config';
import { fetchWithAuthHandling } from '@fc/http-client';

import { loadAllInstances } from './load-all-instances';

describe('loadAllInstances', () => {
  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({
      endpoints: {
        instances: '/api-instances-mock',
      },
    });
  });

  it('should call Dto2FormService.get with params', async () => {
    // Given
    jest.mocked(fetchWithAuthHandling).mockResolvedValueOnce('any-data-result');

    // When
    const result = await loadAllInstances();

    // Then
    expect(ConfigService.get).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledWith('Partners');
    expect(fetchWithAuthHandling).toHaveBeenCalledOnce();
    expect(fetchWithAuthHandling).toHaveBeenCalledWith('/api-instances-mock');
    expect(result).toBe('any-data-result');
  });
});
