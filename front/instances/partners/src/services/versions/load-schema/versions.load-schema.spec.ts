import { ConfigService } from '@fc/config';
import { PartnersService } from '@fc/core-partners';

import { loadSchema } from './versions.load-schema';

describe('loadSchema', () => {
  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({
      schemas: {
        versions: '/api-metadata-version-mock',
      },
    });
  });

  it('should call PartnersService.get with params', async () => {
    // Given
    jest.mocked(PartnersService.get).mockResolvedValueOnce('any-data-result');

    // When
    const result = await loadSchema();

    // Then
    expect(ConfigService.get).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledWith('Partners');
    expect(PartnersService.get).toHaveBeenCalledOnce();
    expect(PartnersService.get).toHaveBeenCalledWith('/api-metadata-version-mock');
    expect(result).toBe('any-data-result');
  });
});
