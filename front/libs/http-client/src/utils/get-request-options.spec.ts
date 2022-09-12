import { mocked } from 'jest-mock';

import { ConfigService } from '@fc/config';

import { Options } from '../enums';
import { HttpClientOptions } from '../interfaces';
import * as Module from './get-request-options';
import { slashifyPath } from './slashify-path';

jest.mock('@fc/config');
jest.mock('./slashify-path');

describe('getTimeout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call ConfigService.get with HttpClient identifier from enums Options', () => {
    // when
    Module.getTimeout(expect.any(Object));

    // then
    expect(ConfigService.get).toHaveBeenCalledTimes(1);
    expect(ConfigService.get).toHaveBeenCalledWith(Options.CONFIG_NAME);
  });

  it('should return a timeout from requestOptions', () => {
    // when
    const result = Module.getTimeout({ timeout: 3000 });

    // then
    expect(result).toStrictEqual(3000);
  });

  it('should return a timeout from serviceConfig', () => {
    // given
    mocked(ConfigService.get).mockReturnValueOnce({ timeout: 2000 });

    // when
    const result = Module.getTimeout(undefined as unknown as HttpClientOptions);

    // then
    expect(result).toStrictEqual(2000);
  });

  it('should return a timeout from default values', () => {
    // given
    mocked(ConfigService.get).mockReturnValueOnce({});

    // when
    const result = Module.getTimeout({});

    // then
    expect(result).toStrictEqual(Options.TIMEOUT);
  });
});

describe('getBaseURL', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call ConfigService.get with HttpClient identifier', () => {
    // when
    Module.getBaseURL(expect.any(Object));

    // then
    expect(ConfigService.get).toHaveBeenCalledTimes(1);
    expect(ConfigService.get).toHaveBeenCalledWith(Options.CONFIG_NAME);
  });

  it('should return a baseURL from requestOptions', () => {
    // when
    const result = Module.getBaseURL({
      baseURL: 'http://any-url.com',
    });

    // then
    expect(result).toStrictEqual('http://any-url.com');
  });

  it('should return a baseURL from serviceConfig', () => {
    // given
    mocked(ConfigService.get).mockReturnValueOnce({ baseURL: 'http://any-url.com' });
    // when
    const result = Module.getBaseURL(undefined as unknown as HttpClientOptions);

    // then
    expect(result).toStrictEqual('http://any-url.com');
  });

  it('should return a baseURL from default values', () => {
    // given
    mocked(ConfigService.get).mockReturnValueOnce({});
    // when
    const result = Module.getBaseURL({});

    // then
    expect(result).toBeUndefined();
  });
});

describe('getRequestOptions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    //
    jest.spyOn(Module, 'getTimeout');
    jest.spyOn(Module, 'getBaseURL');
  });

  it('should call slashifyPath with baseURL parameters from parameters', () => {
    // when
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

    // then
    expect(slashifyPath).toHaveBeenCalledTimes(1);
    expect(slashifyPath).toHaveBeenCalledWith('any-endpoint', 'http://any-url.mock');
  });

  it('should call slashifyPath with baseURL parameters from getBaseURL', () => {
    // given
    mocked(Module.getBaseURL).mockReturnValueOnce('http://any-url-config.mock');

    // when
    Module.getRequestOptions({
      data: { key: 'any-mock-value' },
      method: 'get',
      url: 'any-endpoint',
    });

    // then
    expect(slashifyPath).toHaveBeenCalledTimes(1);
    expect(slashifyPath).toHaveBeenCalledWith('any-endpoint', 'http://any-url-config.mock');
  });

  it('should return a merged request object', () => {
    // given
    mocked(slashifyPath).mockReturnValueOnce('http://any-url.mock/any-endpoint');
    const validateStatusMock = jest.fn();

    // when
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

    // then
    expect(result).toStrictEqual({
      data: { key: 'any-mock-value' },
      method: 'get',
      timeout: Options.TIMEOUT,
      url: 'http://any-url.mock/any-endpoint',
      validateStatus: validateStatusMock,
    });
  });

  it('should have call getBaseUrl', () => {
    // given
    mocked(ConfigService.get).mockReturnValueOnce({});
    const targetRequest = {
      data: expect.any(Object),
      method: expect.any(String),
      url: expect.any(String),
    };
    jest.spyOn(Module, 'getBaseURL');

    // when
    Module.getRequestOptions(targetRequest);

    // then
    expect(Module.getBaseURL).toHaveBeenCalledTimes(1);
  });

  it('should have call getTimeout', () => {
    // given
    mocked(ConfigService.get).mockReturnValueOnce({});
    const targetRequest = {
      data: expect.any(Object),
      method: expect.any(String),
      url: expect.any(String),
    };
    jest.spyOn(Module, 'getTimeout');

    // when
    Module.getRequestOptions(targetRequest);

    // then
    expect(Module.getTimeout).toHaveBeenCalledTimes(1);
  });
});
