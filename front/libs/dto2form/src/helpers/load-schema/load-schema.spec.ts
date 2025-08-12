import type { LoaderFunctionArgs } from 'react-router';

import { Dto2FormService } from '@fc/dto2form';

import { loadSchema } from './load-schema';

describe('loadSchema', () => {
  const endpoint = '/test/schema';

  it('should return a function', () => {
    // When
    const result = loadSchema(endpoint);

    // Then
    expect(typeof result).toBe('function');
  });

  it('should call Dto2FormService.get with the endpoint', async () => {
    // Given
    const args = {} as LoaderFunctionArgs;

    // When
    await loadSchema(endpoint)(args);

    // Then
    expect(Dto2FormService.get).toHaveBeenCalledWith(endpoint);
  });
});
