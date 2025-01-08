import type { LoaderFunctionArgs } from 'react-router-dom';

import { ConfigService } from '@fc/config';

import { AbstractService } from '../../abstract';
import { read } from './instances.read';

jest.mock('../../abstract/abstract.service');

describe('read', () => {
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
    const result = await read({ params: { instanceId: '123' } } as unknown as LoaderFunctionArgs);

    // Then
    expect(ConfigService.get).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledWith('Partners');
    expect(AbstractService.get).toHaveBeenCalledOnce();
    expect(AbstractService.get).toHaveBeenCalledWith('/api-instances-mock/123');
    expect(result).toBe('any-data-result');
  });
});
