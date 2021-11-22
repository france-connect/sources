import { ObjectType, STATE } from 'apache-ignite-client';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { ApacheIgniteService } from './apache-ignite.service';

describe('ApacheIgniteService', () => {
  let service: ApacheIgniteService;

  const configServiceMock = {
    get: jest.fn(),
  };

  const loggerServiceMock = {
    debug: jest.fn(),
    setContext: jest.fn(),
  };

  const igniteClientMock = {
    connect: jest.fn(),
    disconnect: jest.fn(),
    getCache: jest.fn(),
    setKeyType: jest.fn(),
    setValueType: jest.fn(),
  };

  const cacheObjectMock = {
    foo: 'bar',
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();

    igniteClientMock.getCache.mockReturnValueOnce(igniteClientMock);
    igniteClientMock.setKeyType.mockReturnValueOnce(igniteClientMock);
    igniteClientMock.setValueType.mockReturnValueOnce(cacheObjectMock);

    ApacheIgniteService['IgniteClientProxy'] = jest
      .fn()
      .mockReturnValueOnce(igniteClientMock);
    ApacheIgniteService['IgniteClientConfigurationProxy'] = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ApacheIgniteService, ConfigService, LoggerService],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .compile();

    service = module.get<ApacheIgniteService>(ApacheIgniteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set the logger context with the service name', () => {
    expect(loggerServiceMock.setContext).toHaveBeenCalledTimes(1);
    expect(loggerServiceMock.setContext).toHaveBeenCalledWith(
      'ApacheIgniteService',
    );
  });

  describe('onModuleInit', () => {
    const configMock = {
      endpoint: 'apache-ignite:1644',
    };

    beforeEach(() => {
      configServiceMock.get.mockReturnValueOnce(configMock);
    });

    it('should retrieve the ignite endpoint from the config', async () => {
      // action
      await service['onModuleInit']();

      // expect
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('ApacheIgnite');
    });

    it('should initialize the client ignite with an event callback', async () => {
      // action
      await service['onModuleInit']();

      // expect
      expect(ApacheIgniteService['IgniteClientProxy']).toHaveBeenCalledTimes(1);
      expect(ApacheIgniteService['IgniteClientProxy']).toHaveBeenCalledWith(
        expect.any(Function),
      );
    });

    it('should initialize the client ignite configuration with the endpoint', async () => {
      // action
      await service['onModuleInit']();

      // expect
      expect(
        ApacheIgniteService['IgniteClientConfigurationProxy'],
      ).toHaveBeenCalledTimes(1);
      expect(
        ApacheIgniteService['IgniteClientConfigurationProxy'],
      ).toHaveBeenCalledWith(configMock.endpoint);
    });

    it('should connect to ignite with the configuration built', async () => {
      // setup
      ApacheIgniteService['IgniteClientConfigurationProxy'].mockReturnValueOnce(
        configMock,
      );

      // action
      await service['onModuleInit']();

      // expect
      expect(igniteClientMock.connect).toHaveBeenCalledTimes(1);
      expect(igniteClientMock.connect).toHaveBeenCalledWith(configMock);
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect the ignite client on module destroy', async () => {
      // action
      await service['onModuleDestroy']();

      // expect
      expect(igniteClientMock.disconnect).toHaveBeenCalledTimes(1);
      expect(igniteClientMock.disconnect).toHaveBeenCalledWith();
    });
  });

  describe('getCache', () => {
    const cache = 'mycache';

    it('should call igniteClient.getCache with the cache name', async () => {
      // action
      await service['getCache'](cache);

      // expect
      expect(igniteClientMock.getCache).toHaveBeenCalledTimes(1);
      expect(igniteClientMock.getCache).toHaveBeenCalledWith(cache);
    });

    it('should call the cache setKeyType with the primitive string type if no key type is provided', async () => {
      // action
      await service['getCache'](cache);

      // expect
      expect(igniteClientMock.setKeyType).toHaveBeenCalledTimes(1);
      expect(igniteClientMock.setKeyType).toHaveBeenCalledWith(
        ObjectType.PRIMITIVE_TYPE.STRING,
      );
    });

    it('should call the cache setValueType with the primitive string type if no value type is provided', async () => {
      // action
      await service['getCache'](cache);

      // expect
      expect(igniteClientMock.setValueType).toHaveBeenCalledTimes(1);
      expect(igniteClientMock.setValueType).toHaveBeenCalledWith(
        ObjectType.PRIMITIVE_TYPE.STRING,
      );
    });

    it('should call the cache setKeyType with the primitive string type if no key type is provided', async () => {
      // action
      await service['getCache'](cache, ObjectType.PRIMITIVE_TYPE.INTEGER);

      // expect
      expect(igniteClientMock.setKeyType).toHaveBeenCalledTimes(1);
      expect(igniteClientMock.setKeyType).toHaveBeenCalledWith(
        ObjectType.PRIMITIVE_TYPE.INTEGER,
      );
    });

    it('should call the cache setValueType with the primitive string type if no value type is provided', async () => {
      // action
      await service['getCache'](
        cache,
        ObjectType.PRIMITIVE_TYPE.STRING,
        ObjectType.PRIMITIVE_TYPE.INTEGER,
      );

      // expect
      expect(igniteClientMock.setValueType).toHaveBeenCalledTimes(1);
      expect(igniteClientMock.setValueType).toHaveBeenCalledWith(
        ObjectType.PRIMITIVE_TYPE.INTEGER,
      );
    });

    it('should return the cache', async () => {
      // action
      const result = await service['getCache'](
        cache,
        ObjectType.PRIMITIVE_TYPE.STRING,
        ObjectType.PRIMITIVE_TYPE.INTEGER,
      );

      // expect
      expect(result).toStrictEqual(cacheObjectMock);
    });
  });

  describe('onStateChanged', () => {
    it('should log when a connection event occurs', () => {
      // action
      service['onStateChanged'](STATE.CONNECTED);

      // expect
      expect(loggerServiceMock.debug).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.debug).toHaveBeenCalledWith(
        'Apache ignite client is connected',
      );
    });

    it('should log when a disconnection event occurs', () => {
      // action
      service['onStateChanged'](STATE.DISCONNECTED);

      // expect
      expect(loggerServiceMock.debug).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.debug).toHaveBeenCalledWith(
        'Apache ignite client disconnected',
      );
    });

    it('should log the reason when a disconnection event occurs if provided', () => {
      // setup
      const reason = 'Why do we always need a reason ?';

      // action
      service['onStateChanged'](STATE.DISCONNECTED, reason);

      // expect
      expect(loggerServiceMock.debug).toHaveBeenCalledTimes(2);
      expect(loggerServiceMock.debug).toHaveBeenCalledWith(
        'Apache ignite client disconnected',
      );
      expect(loggerServiceMock.debug).toHaveBeenCalledWith(reason);
    });

    it('should not log anything if the state is not CONNECTED or DISCONNECTED', () => {
      // setup
      const STATE_UNKNOWWN_MOCK = 42;

      // action
      service['onStateChanged'](STATE_UNKNOWWN_MOCK);

      // expect
      expect(loggerServiceMock.debug).toHaveBeenCalledTimes(0);
    });
  });
});
