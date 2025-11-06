import { ConfigService } from '@fc/config';

import { HttpClientOptions } from '../enums';
import type { HttpClientOptionsInterface } from '../interfaces';
import * as Module from './get-request-options';
import { slashifyPath } from './slashify-path';

jest.mock('./slashify-path');

describe('getTimeout', () => {
  it('should call ConfigService.get with HttpClient identifier from enums HttpClientOptions', () => {
    // When
    Module.getTimeout(expect.any(Object));

    // Then
    expect(ConfigService.get).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledWith('HttpClient');
  });

  it('should return a timeout from requestOptions', () => {
    // When
    const result = Module.getTimeout({ timeout: 3000 });

    // Then
    expect(result).toBe(3000);
  });

  it('should return a timeout from serviceConfig', () => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValueOnce({ timeout: 2000 });

    // When
    const result = Module.getTimeout(undefined as unknown as HttpClientOptionsInterface);

    // Then
    expect(result).toBe(2000);
  });

  it('should return a timeout from default values', () => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValueOnce({});

    // When
    const result = Module.getTimeout({});

    // Then
    expect(result).toStrictEqual(HttpClientOptions.TIMEOUT);
  });
});

describe('getBaseURL', () => {
  it('should call ConfigService.get with HttpClient identifier', () => {
    // When
    Module.getBaseURL(expect.any(Object));

    // Then
    expect(ConfigService.get).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledWith(HttpClientOptions.CONFIG_NAME);
  });

  it('should return a baseURL from requestOptions', () => {
    // When
    const result = Module.getBaseURL({
      baseURL: 'http://any-url.com',
    });

    // Then
    expect(result).toBe('http://any-url.com');
  });

  it('should return a baseURL from serviceConfig', () => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValueOnce({ baseURL: 'http://any-url.com' });
    // When
    const result = Module.getBaseURL(undefined as unknown as HttpClientOptionsInterface);

    // Then
    expect(result).toBe('http://any-url.com');
  });

  it('should return a baseURL from default values', () => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValueOnce({});
    // When
    const result = Module.getBaseURL({});

    // Then
    expect(result).toBeUndefined();
  });
});

describe('getRequestOptions', () => {
  beforeEach(() => {
    //
    jest.spyOn(Module, 'getTimeout');
    jest.spyOn(Module, 'getBaseURL');
  });

  it('should call slashifyPath with baseURL parameters from parameters', () => {
    // When
    Module.getRequestOptions(
      {
        data: { key: 'any-mock-value' },
        method: 'get',
        url: 'any-endpoint',
      },
      {
        baseURL: 'http://any-url.mock',
      },
    );

    // Then
    expect(slashifyPath).toHaveBeenCalledOnce();
    expect(slashifyPath).toHaveBeenCalledWith('any-endpoint', 'http://any-url.mock');
  });

  it('should call slashifyPath with baseURL parameters from getBaseURL', () => {
    // Given
    jest.mocked(Module.getBaseURL).mockReturnValueOnce('http://any-url-config.mock');

    // When
    Module.getRequestOptions({
      data: { key: 'any-mock-value' },
      method: 'get',
      url: 'any-endpoint',
    });

    // Then
    expect(slashifyPath).toHaveBeenCalledOnce();
    expect(slashifyPath).toHaveBeenCalledWith('any-endpoint', 'http://any-url-config.mock');
  });

  it('should return a merged request object', () => {
    // Given
    jest.mocked(slashifyPath).mockReturnValueOnce('http://any-url.mock/any-endpoint');
    const validateStatusMock = jest.fn();

    // When
    const result = Module.getRequestOptions(
      {
        data: { key: 'any-mock-value' },
        method: 'get',
        url: 'any-endpoint',
      },
      {
        baseURL: 'http://any-url.mock',
        validateStatus: validateStatusMock,
      },
    );

    // Then
    expect(result).toStrictEqual({
      data: { key: 'any-mock-value' },
      method: 'get',
      timeout: HttpClientOptions.TIMEOUT,
      url: 'http://any-url.mock/any-endpoint',
      validateStatus: validateStatusMock,
    });
  });

  it('should have call getBaseUrl', () => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValueOnce({});
    const targetRequest = {
      data: expect.any(Object),
      method: expect.any(String),
      url: expect.any(String),
    };
    jest.spyOn(Module, 'getBaseURL');

    // When
    Module.getRequestOptions(targetRequest);

    // Then
    expect(Module.getBaseURL).toHaveBeenCalledOnce();
  });

  it('should have call getTimeout', () => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValueOnce({});
    const targetRequest = {
      data: expect.any(Object),
      method: expect.any(String),
      url: expect.any(String),
    };
    jest.spyOn(Module, 'getTimeout');

    // When
    Module.getRequestOptions(targetRequest);

    // Then
    expect(Module.getTimeout).toHaveBeenCalledOnce();
  });
});
