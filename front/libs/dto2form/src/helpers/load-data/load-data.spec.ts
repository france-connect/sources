import { generatePath, type LoaderFunctionArgs } from 'react-router';

import { Dto2FormService } from '@fc/dto2form';

import { loadData } from './load-data';

describe('loadData', () => {
  const endpoint = '/test/:id';
  const params = { id: '123' } as unknown as LoaderFunctionArgs;
  const expectedUrl = '/test/123';

  it('should return a function', () => {
    // When
    const result = loadData(endpoint);

    // Then
    expect(typeof result).toBe('function');
  });

  it('should call Dto2FormService.get with the URL from generatePath', async () => {
    // Given
    jest.mocked(generatePath).mockReturnValueOnce('/test/123');
    const result = loadData(endpoint);

    // When
    result(params);

    // Then
    expect(Dto2FormService.get).toHaveBeenCalledWith(expectedUrl);
  });
});
