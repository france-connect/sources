import { ConfigService } from '@fc/config';
import { PartnersService } from '@fc/core-partners';

import { loadAll } from './instances.load-all';

describe('loadAll', () => {
  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({
      endpoints: {
        instances: '/api-instances-mock',
      },
    });
  });

  it('should call PartnersService.get with params', async () => {
    // Given
    jest.mocked(PartnersService.get).mockResolvedValueOnce('any-data-result');

    // When
    const result = await loadAll();

    // Then
    expect(ConfigService.get).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledWith('Partners');
    expect(PartnersService.get).toHaveBeenCalledOnce();
    expect(PartnersService.get).toHaveBeenCalledWith('/api-instances-mock');
    expect(result).toBe('any-data-result');
  });
});
