import type { LoaderFunctionArgs } from 'react-router';

import { ConfigService } from '@fc/config';
import { PartnersService } from '@fc/core-partners';

import { read } from './instances.read';

describe('read', () => {
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
    const result = await read({ params: { instanceId: '123' } } as unknown as LoaderFunctionArgs);

    // Then
    expect(ConfigService.get).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledWith('Partners');
    expect(PartnersService.get).toHaveBeenCalledOnce();
    expect(PartnersService.get).toHaveBeenCalledWith('/api-instances-mock/123');
    expect(result).toBe('any-data-result');
  });
});
