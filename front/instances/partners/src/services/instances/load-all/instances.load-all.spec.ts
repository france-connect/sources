import { ConfigService } from '@fc/config';
import { Dto2FormService } from '@fc/dto2form';

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

  it('should call Dto2FormService.get with params', async () => {
    // Given
    jest.mocked(Dto2FormService.get).mockResolvedValueOnce('any-data-result');

    // When
    const result = await loadAll();

    // Then
    expect(ConfigService.get).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledWith('Partners');
    expect(Dto2FormService.get).toHaveBeenCalledOnce();
    expect(Dto2FormService.get).toHaveBeenCalledWith('/api-instances-mock');
    expect(result).toBe('any-data-result');
  });
});
