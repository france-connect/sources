import { type AxiosResponse } from 'axios';
import { redirect } from 'react-router-dom';

import { get as httpClientGet } from '@fc/http-client';

import { get } from './partners.get';

describe('PartnersService.get', () => {
  it('should return data when the request is successful', async () => {
    // Given
    const response = { data: 'any-mock-value' } as unknown as AxiosResponse;
    jest.mocked(httpClientGet).mockResolvedValueOnce(response);

    // When
    const result = await get('any-url-mock');

    // Then
    expect(httpClientGet).toHaveBeenCalledWith('any-url-mock');
    expect(result).toBe('any-mock-value');
  });

  it('should return null when the response status is 403 (FORBIDDEN)', async () => {
    // Given
    jest.mocked(httpClientGet).mockRejectedValueOnce({
      status: 403,
    });

    // When
    const result = await get('any-url-mock');

    // Then
    expect(result).toBeNull();
  });

  it('should redirect to login and return null when the response status is 401 (UNAUTHORIZED)', async () => {
    // Given
    jest.mocked(httpClientGet).mockRejectedValueOnce({
      status: 401,
    });

    // When
    const result = await get('any-url-mock');

    // Then
    expect(redirect).toHaveBeenCalledWith('/login', 401);
    expect(result).toBeNull();
  });

  it('should throw an error for other HTTP status codes', async () => {
    // Given
    jest.mocked(httpClientGet).mockRejectedValueOnce({
      status: 500,
    });

    // Then
    await expect(() =>
      // When
      get('any-url-mock'),
    ).rejects.toEqual({
      status: 500,
    });
  });
});
