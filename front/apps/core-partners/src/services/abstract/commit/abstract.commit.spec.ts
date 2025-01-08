import type { AxiosResponse } from 'axios';

import { type HttpMethods } from '@fc/common';
import { getCSRF, makeRequest } from '@fc/http-client';

import { commit } from './abstract.commit';

describe('AbstractService.commit', () => {
  it('should call http-client.getCSRF', async () => {
    // Given
    const dataMock = { data: 'any-data-mock' };
    const methodMock = 'any-method-mock' as unknown as HttpMethods.POST;

    // When
    await commit(methodMock, 'any-url-mock', dataMock);

    // Then
    expect(getCSRF).toHaveBeenCalledOnce();
  });

  it('should call http-client.makeRequest with params', async () => {
    // Given
    const dataMock = { data: 'any-data-mock' };
    const methodMock = 'any-method-mock' as unknown as HttpMethods.POST;
    const responseMock = Symbol('any-response-mock') as unknown as AxiosResponse;

    jest.mocked(makeRequest).mockResolvedValueOnce(responseMock);
    jest.mocked(getCSRF).mockResolvedValueOnce({ csrfToken: 'any-csrfToken-mock' });

    // When
    const result = await commit(methodMock, 'any-url-mock', dataMock);

    // Then
    expect(result).toBe(responseMock);
    expect(makeRequest).toHaveBeenCalledOnce();
    expect(makeRequest).toHaveBeenCalledWith(
      methodMock,
      'any-url-mock',
      {
        ...dataMock,
        csrfToken: 'any-csrfToken-mock',
      },
      {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
  });

  it('should return a global form error if makeRequest fail', async () => {
    // Given
    const methodMock = 'any-method-mock' as unknown as HttpMethods.POST;
    const dataMock = { data: 'any-data-mock' };
    const response = { data: 'any-response-mock' } as unknown as AxiosResponse;

    jest.mocked(getCSRF).mockResolvedValueOnce({ csrfToken: 'any-csrfToken-mock' });
    jest.mocked(makeRequest).mockRejectedValueOnce(response);

    // When
    const result = await commit(methodMock, 'any-url-mock', dataMock);

    // Then
    expect(makeRequest).toHaveBeenCalledOnce();
    expect(makeRequest).toHaveBeenCalledWith(
      methodMock,
      'any-url-mock',
      {
        ...dataMock,
        csrfToken: 'any-csrfToken-mock',
      },
      {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    // eslint-disable-next-line @typescript-eslint/naming-convention
    expect(result).toStrictEqual({ 'FINAL_FORM/form-error': 'Form.FORM_ERROR' });
  });
});
