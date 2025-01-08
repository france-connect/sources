import { ConfigService } from '@fc/config';

import { AbstractService } from '../../abstract';
import { loadSchema } from './versions.load-schema';

jest.mock('../../abstract/abstract.service');

describe('loadSchema', () => {
  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({
      schemas: {
        versions: '/api-metadata-version-mock',
      },
    });
  });

  it('should call AbstractService.get with params', async () => {
    // Given
    jest.mocked(AbstractService.get).mockResolvedValueOnce('any-data-result');

    // When
    const result = await loadSchema();

    // Then
    expect(ConfigService.get).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledWith('Partners');
    expect(AbstractService.get).toHaveBeenCalledOnce();
    expect(AbstractService.get).toHaveBeenCalledWith('/api-metadata-version-mock');
    expect(result).toBe('any-data-result');
  });
});
