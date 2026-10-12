import { type AxiosResponse } from 'axios';
import { redirect } from 'react-router';

import { del } from '../../services';
import { deleteWithAuthHandling } from './delete-with-auth-handling.helper';

jest.mock('../../services/http-client.service');

describe('deleteWithAuthHandling', () => {
  it('should call del with the url and the data', async () => {
    // Given
    const response = { data: 'any-mock-value' } as unknown as AxiosResponse;
    jest.mocked(del).mockResolvedValueOnce(response);

    // When
    await deleteWithAuthHandling('any-url-mock', { any: 'any-data-mock' });

    // Then
    expect(del).toHaveBeenCalledExactlyOnceWith('any-url-mock', { any: 'any-data-mock' });
  });

  it('should return data when the request is successful', async () => {
    // Given
    const response = { data: 'any-mock-value' } as unknown as AxiosResponse;
    jest.mocked(del).mockResolvedValueOnce(response);

    // When
    const result = await deleteWithAuthHandling('any-url-mock');

    // Then
    expect(result).toBe('any-mock-value');
  });

  it('should redirect to login and return null when the response status is 401 (UNAUTHORIZED)', async () => {
    // Given
    jest.mocked(del).mockRejectedValueOnce({
      status: 401,
    });

    // When
    const result = await deleteWithAuthHandling('any-url-mock');

    // Then
    expect(redirect).toHaveBeenCalledExactlyOnceWith('/login', 401);
    expect(result).toBeNull();
  });

  it('should throw an error for other HTTP status codes', async () => {
    // Given
    jest.mocked(del).mockRejectedValueOnce({
      status: 403,
    });

    // When / Then
    await expect(deleteWithAuthHandling('any-url-mock')).rejects.toEqual({
      status: 403,
    });
  });
});
