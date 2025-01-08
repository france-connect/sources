import { ConfigService } from '@fc/config';

import { AbstractService } from '../../abstract';
import { loadAll } from './instances.load-all';

jest.mock('../../abstract/abstract.service');

describe('loadAll', () => {
  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({
      endpoints: {
        instances: '/api-instances-mock',
      },
    });
  });

  it('should call AbstractService.get with params', async () => {
    // Given
    jest.mocked(AbstractService.get).mockResolvedValueOnce('any-data-result');

    // When
    const result = await loadAll();

    // Then
    expect(ConfigService.get).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledWith('Partners');
    expect(AbstractService.get).toHaveBeenCalledOnce();
    expect(AbstractService.get).toHaveBeenCalledWith('/api-instances-mock');
    expect(result).toBe('any-data-result');
  });
});
