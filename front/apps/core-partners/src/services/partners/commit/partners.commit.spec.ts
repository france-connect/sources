import type { AxiosResponse } from 'axios';

import { type HttpMethods } from '@fc/common';
import { getCSRF, makeRequest } from '@fc/http-client';

import { commit } from './partners.commit';

describe('PartnersService.commit', () => {
  it('should call http-client.getCSRF', async () => {
    // Given
    const methodMock = 'any-method-mock' as unknown as HttpMethods.POST;

    // When
    await commit(methodMock, 'any-url-mock', { data: 'any-data-mock' });

    // Then
    expect(getCSRF).toHaveBeenCalledOnce();
  });

  it('should call http-client.makeRequest and return undefined if successed', async () => {
    // Given
    const methodMock = 'any-method-mock' as unknown as HttpMethods.POST;
    const responseMock = Symbol('any-response-mock') as unknown as AxiosResponse;

    jest.mocked(makeRequest).mockResolvedValueOnce(responseMock);
    jest.mocked(getCSRF).mockResolvedValueOnce({ csrfToken: 'any-csrfToken-mock' });

    // When
    const result = await commit(methodMock, 'any-url-mock', { data: 'any-data-mock' });

    // Then
    expect(result).toBeUndefined();
    expect(makeRequest).toHaveBeenCalledOnce();
    expect(makeRequest).toHaveBeenCalledWith(
      methodMock,
      'any-url-mock',
      { data: 'any-data-mock' },
      {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'Content-Type': 'application/x-www-form-urlencoded',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'x-csrf-token': 'any-csrfToken-mock',
        },
      },
    );
  });

  it('should return a global form error if makeRequest fail and status is not 422', async () => {
    // Given
    const methodMock = 'any-method-mock' as unknown as HttpMethods.POST;
    const response = { response: { data: { payload: 'any-response-mock' }, status: 500 } };

    jest.mocked(getCSRF).mockResolvedValueOnce({ csrfToken: 'any-csrfToken-mock' });
    jest.mocked(makeRequest).mockRejectedValueOnce(response);

    // When
    const result = await commit(methodMock, 'any-url-mock', { data: 'any-data-mock' });

    // Then
    expect(makeRequest).toHaveBeenCalledOnce();
    expect(makeRequest).toHaveBeenCalledWith(
      methodMock,
      'any-url-mock',
      { data: 'any-data-mock' },
      {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'Content-Type': 'application/x-www-form-urlencoded',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'x-csrf-token': 'any-csrfToken-mock',
        },
      },
    );
    // eslint-disable-next-line @typescript-eslint/naming-convention
    expect(result).toStrictEqual({ 'FINAL_FORM/form-error': 'Form.FORM_ERROR' });
  });

  it('should return form submission errors if makeRequest fail and status is 422', async () => {
    // Given
    const methodMock = 'any-method-mock' as unknown as HttpMethods.POST;
    const response = {
      response: {
        data: {
          payload: {
            anyFieldName1: ['any-error-mock'],
            anyFieldName2: 'any-error-mock',
            anyFieldName3: 'any-error-mock',
          },
        },
        status: 422,
      },
    };

    jest.mocked(getCSRF).mockResolvedValueOnce({ csrfToken: 'any-csrfToken-mock' });
    jest.mocked(makeRequest).mockRejectedValueOnce(response);

    // When
    const result = await commit(methodMock, 'any-url-mock', { data: 'any-data-mock' });

    // Then
    expect(makeRequest).toHaveBeenCalledOnce();
    expect(makeRequest).toHaveBeenCalledWith(
      methodMock,
      'any-url-mock',
      { data: 'any-data-mock' },
      {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'Content-Type': 'application/x-www-form-urlencoded',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'x-csrf-token': 'any-csrfToken-mock',
        },
      },
    );

    expect(result).toStrictEqual({
      anyFieldName1: ['any-error-mock'],
      anyFieldName2: 'any-error-mock',
      anyFieldName3: 'any-error-mock',
    });
  });
});
