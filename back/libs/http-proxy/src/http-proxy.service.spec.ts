import * as globalAgent from 'global-agent';

import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

import { HttpProxyService } from './http-proxy.service';

jest.mock('global-agent');

const globalAny: any = global;

describe('HttpProxyService', () => {
  let service: HttpProxyService;

  const loggerMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
  };

  const httpMock = {
    axiosRef: {
      defaults: { proxy: 'shouldNotExist' },
    },
  };

  const bootstrapMock = jest.spyOn(globalAgent, 'bootstrap');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpProxyService, LoggerService, HttpService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(HttpService)
      .useValue(httpMock)
      .compile();

    service = module.get<HttpProxyService>(HttpProxyService);

    jest.resetAllMocks();

    bootstrapMock.mockImplementation(() => {
      global['GLOBAL_AGENT'] = 'mockValue';
    });

    httpMock.axiosRef.defaults.proxy = 'shouldNotExist';
  });

  afterEach(() => {
    bootstrapMock.mockRestore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should call bootstrap from global-agent', () => {
      // When
      service.onModuleInit();
      // Then
      expect(bootstrapMock).toHaveBeenCalledTimes(1);
    });
    it('should call bootstrap from global-agent', () => {
      // When
      service.onModuleInit();
      // Then
      expect(globalAny.GLOBAL_AGENT).toBeDefined();
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
