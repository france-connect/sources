import { AxiosError } from 'axios';

import { ChecktokenHttpStatusException } from './checktoken-http-status.exception';

describe('CheckTokenHttpStatusException', () => {
  it('should construct a log property', () => {
    const error = {
      response: {
        status: 500,
        data: {
          error: 'error',
          error_description: 'error_description',
        },
      },
    } as AxiosError<{ error: string; error_description: string }>;
    const exception = new ChecktokenHttpStatusException(error);
    expect(exception.log).toBe(
      'status: 500, error: error, error_description: error_description',
    );
  });

  it('should not alter log property if error or error_description are not present', () => {
    const error = {
      response: {
        status: 500,
        data: {},
      },
    } as AxiosError<{ error: string; error_description: string }>;
    const exception = new ChecktokenHttpStatusException(error);
    expect(exception.log).not.toBeDefined();
  });

  it('should not alter log property if error has no response property', () => {
    const error = {} as AxiosError<{
      error: string;
      error_description: string;
    }>;
    const exception = new ChecktokenHttpStatusException(error);
    expect(exception.log).not.toBeDefined();
  });
});
