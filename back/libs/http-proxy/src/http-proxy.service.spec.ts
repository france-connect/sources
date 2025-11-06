import * as globalAgent from 'global-agent';
import { GlobalThis } from 'type-fest';
import * as undici from 'undici';

import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { HttpProxyService } from './http-proxy.service';

jest.mock('global-agent');
jest.mock('undici');

const globalAgentMock = {
  HTTPS_PROXY: 'http://secure-proxy.example.com:8443',
  HTTP_PROXY: 'http://proxy.example.com:8080',
  NO_PROXY: 'localhost',
} as unknown as GlobalThis;

describe('HttpProxyService', () => {
  let service: HttpProxyService;

  const loggerMock = getLoggerMock();

  const httpMock = {
    axiosRef: {
      defaults: { proxy: 'shouldNotExist' },
    },
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpProxyService, LoggerService, HttpService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(HttpService)
      .useValue(httpMock)
      .compile();

    service = module.get<HttpProxyService>(HttpProxyService);

    globalAgent.bootstrap.mockImplementation(() => {
      globalThis['GLOBAL_AGENT'] = globalAgentMock;
    });

    httpMock.axiosRef.defaults.proxy = 'shouldNotExist';
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should call bootstrap from global-agent', () => {
      // When
      service.onModuleInit();

      // Then
      expect(globalAgent.bootstrap).toHaveBeenCalledTimes(1);
    });

    it('should call bootstrap from global-agent', () => {
      // When
      service.onModuleInit();

      // Then
      expect(globalAgent.bootstrap).toBeDefined();
    });

    it('should setup an EnvHttpProxyAgent for undici', () => {
      // Given
      const envHttpProxyAgentArgs = {
        httpsProxy: globalAgentMock.HTTPS_PROXY,
        httpProxy: globalAgentMock.HTTP_PROXY,
        noProxy: globalAgentMock.NO_PROXY,
      };

      // When
      service.onModuleInit();

      // Then
      expect(undici.EnvHttpProxyAgent).toHaveBeenCalledTimes(1);
      expect(undici.EnvHttpProxyAgent).toHaveBeenCalledWith(
        envHttpProxyAgentArgs,
      );
    });

    it('should set global dispatcher for undici', () => {
      // When
      service.onModuleInit();

      // Then
      expect(undici.setGlobalDispatcher).toHaveBeenCalledTimes(1);
      expect(undici.setGlobalDispatcher).toHaveBeenCalledWith(
        expect.any(undici.EnvHttpProxyAgent),
      );
    });

    it('should shutdown proxy for axios', () => {
      // When
      service.onModuleInit();

      // Then
      const {
        axiosRef: {
          defaults: { proxy },
        },
      } = httpMock;
      expect(proxy).toBe(false);
    });
  });
});
