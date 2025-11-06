import { type AxiosResponse } from 'axios';
import { redirect } from 'react-router';

import { get } from '../services';
import { fetchWithAuthHandling } from './fetch-with-auth-handling.helper';

jest.mock('../services/http-client.service');

describe('fetchWithAuthHandling', () => {
  it('should return data when the request is successful', async () => {
    // Given
    const response = { data: 'any-mock-value' } as unknown as AxiosResponse;
    jest.mocked(get).mockResolvedValueOnce(response);

    // When
    const result = await fetchWithAuthHandling('any-url-mock');

    // Then
    expect(get).toHaveBeenCalledWith('any-url-mock');
    expect(result).toBe('any-mock-value');
  });

  it('should return null when the response status is 403 (FORBIDDEN)', async () => {
    // Given
    jest.mocked(get).mockRejectedValueOnce({
      status: 403,
    });

    // When
    const result = await fetchWithAuthHandling('any-url-mock');

    // Then
    expect(result).toBeNull();
  });

  it('should redirect to login and return null when the response status is 401 (UNAUTHORIZED)', async () => {
    // Given
    jest.mocked(get).mockRejectedValueOnce({
      status: 401,
    });

    // When
    const result = await fetchWithAuthHandling('any-url-mock');

    // Then
    expect(redirect).toHaveBeenCalledWith('/login', 401);
    expect(result).toBeNull();
  });

  it('should throw an error for other HTTP status codes', async () => {
    // Given
    jest.mocked(get).mockRejectedValueOnce({
      status: 500,
    });

    // Then
    await expect(() =>
      // When
      fetchWithAuthHandling('any-url-mock'),
    ).rejects.toEqual({
      status: 500,
    });
  });
});
