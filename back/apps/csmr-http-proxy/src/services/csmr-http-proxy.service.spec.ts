import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { BridgePayload, BridgeResponse } from '@fc/hybridge-http-proxy';

import { CsmrHttpProxyService } from './csmr-http-proxy.service';

jest.mock('rxjs');

describe('CsmrHttpProxyService', () => {
  let service: CsmrHttpProxyService;

  const httpService = {
    get: jest.fn(),
    post: jest.fn(),
  };

  const lastValueMock = jest.mocked(lastValueFrom);

  const httpResponseMock = Symbol('httpResponseMock');

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpService, CsmrHttpProxyService],
    })
      .overrideProvider(HttpService)
      .useValue(httpService)
      .compile();

    service = module.get<CsmrHttpProxyService>(CsmrHttpProxyService);
  });

  it('should be defined', () => {
    // Given
    // When
    // Then
    expect(service).toBeDefined();
  });

  describe('forwardRequest()', () => {
    const baseResponseMock = Object.freeze({
      status: 200,
      statusText: 'statusTextValue',
      headers: {
        'content-type': 'text/html; charset=UTF-8',
      },
    });
    const resultMock: BridgeResponse = {
      headers: {
        'content-type': 'text/html; charset=UTF-8',
      },
      statusText: 'statusTextValue',
      status: 200,
      data: undefined,
    };

    const options: BridgePayload = Object.freeze({
      url: 'http://test.com/token?code=33EFGRGRG44556GH6J',
      method: 'get',
      headers: {
        hello: 'world',
      },
      data: null,
    });

    beforeEach(() => {
      httpService.get.mockResolvedValueOnce(httpResponseMock);
      httpService.post.mockResolvedValueOnce(httpResponseMock);
    });

    it('should resolve without data for given options', async () => {
      // Given

      const requestMock = [
        'http://test.com/token?code=33EFGRGRG44556GH6J',
        {
          headers: { hello: 'world' },
        },
      ];

      lastValueMock.mockResolvedValueOnce(baseResponseMock);
      // When
      const result = await service.forwardRequest(options);
      // Then
      expect(result).toStrictEqual(resultMock);
      expect(httpService.get).toHaveBeenCalledTimes(1);
      expect(httpService.get).toHaveBeenCalledWith(...requestMock);
    });

    it('should resolve with data for given options', async () => {
      // Given

      const mockResponse = {
        ...baseResponseMock,
        data: {
          hello: 'world',
        },
      };

      const mockOptions = {
        ...options,
        method: 'post',
        data: "{\nexemple: 'example value'\n}",
      };

      const requestMock = [
        'http://test.com/token?code=33EFGRGRG44556GH6J',
        "{\nexemple: 'example value'\n}",
        {
          headers: { hello: 'world' },
        },
      ];

      lastValueMock.mockResolvedValueOnce(mockResponse);
      // When
      const result = await service.forwardRequest(mockOptions);
      // Then
      expect(result).toStrictEqual(mockResponse);
      expect(httpService.post).toHaveBeenCalledTimes(1);
      expect(httpService.post).toHaveBeenCalledWith(...requestMock);
    });

    it('should call lastValueFrom when request is called', async () => {
      // Given
      httpService.get.mockReset().mockReturnValueOnce(httpResponseMock);
      lastValueMock.mockResolvedValueOnce(baseResponseMock);

      // When
      await service.forwardRequest(options);
      // Then
      expect(lastValueMock).toHaveBeenCalledTimes(1);
      expect(lastValueMock).toHaveBeenCalledWith(httpResponseMock);
    });

    it('should throw an error if request failed', async () => {
      // Given
      const errorMock = new Error('Unknown Error');

      lastValueMock.mockImplementationOnce(() => {
        throw errorMock;
      });

      await expect(
        // When
        service.forwardRequest(options),
        // Then
      ).rejects.toThrow(errorMock);
    });
  });
});
