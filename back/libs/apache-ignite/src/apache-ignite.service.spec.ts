import { ObjectType, STATE } from 'apache-ignite-client';
import { mocked } from 'jest-mock';
import { operation, RetryOperation } from 'retry';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';

import { ApacheIgniteService } from './apache-ignite.service';
import { ApacheIgniteConfig } from './dto';
import { ApacheIgniteInvalidSocketException } from './exceptions';

jest.mock('retry', () => ({
  ...jest.requireActual('retry'),
  operation: jest.fn(),
}));

describe('ApacheIgniteService', () => {
  let service: ApacheIgniteService;

  const configServiceMock = {
    get: jest.fn(),
  };

  const loggerServiceMock = {
    debug: jest.fn(),
    error: jest.fn(),
    setContext: jest.fn(),
  };

  const igniteClientMock = {
    _socket: {
      _socket: {
        _socket: {
          setKeepAlive: jest.fn(),
        },
      },
    },
    connect: jest.fn(),
    disconnect: jest.fn(),
    getCache: jest.fn(),
    setKeyType: jest.fn(),
    setValueType: jest.fn(),
  };

  const retryOperationMock = {
    stop: jest.fn(),
    attempt: jest.fn(),
    retry: jest.fn(),
  } as unknown as RetryOperation;

  const configMock: ApacheIgniteConfig = {
    endpoint: 'apache-ignite:1644',
    socketKeepAlive: {
      enable: true,
      initialDelay: 150000,
    },
    tls: {
      key: 'key_file_content',
      cert: 'cert_file_content',
      ca: 'ca_file_content',
      useTls: true,
    },
    auth: {
      username: 'username',
      password: 'secret',
    },
    maxRetryTimeout: 300000,
  };

  const cacheObjectMock = {
    foo: 'bar',
  };

  const setConnectionOptionsMock = jest.fn();
  const setPasswordMock = jest.fn();
  const setUserNameMock = jest.fn();
  const connected = 'connected to apache ignite service';

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
    setConnectionOptionsMock.mockReturnValue(connected);
    setPasswordMock.mockReturnValue({
      setConnectionOptions: setConnectionOptionsMock,
    });
    setUserNameMock.mockReturnValue({
      setPassword: setPasswordMock,
    });
    ApacheIgniteService['IgniteClientConfigurationProxy'] = jest
      .fn()
      .mockReturnValue({
        setUserName: setUserNameMock,
      });

    const module: TestingModule = await Test.createTestingModule({
      providers: [ApacheIgniteService, ConfigService, LoggerService],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .compile();

    service = module.get<ApacheIgniteService>(ApacheIgniteService);

    configServiceMock.get.mockReturnValueOnce(configMock);
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
    let retryApacheIgniteMock;
    let triggerIgniteMock;
    const triggerFn = Symbol('triggerFn');

    beforeEach(() => {
      retryApacheIgniteMock = service['retryApacheIgnite'] = jest.fn();
      triggerIgniteMock = service['triggerIgnite'] = jest.fn();
      triggerIgniteMock.bind = jest.fn().mockReturnValueOnce(triggerFn);
    });

    it('should log on init module', () => {
      // when
      service['onModuleInit']();

      // then
      expect(loggerServiceMock.debug).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.debug).toHaveBeenCalledWith('onModuleInit');

      expect(retryApacheIgniteMock).toHaveBeenCalledTimes(1);
      expect(retryApacheIgniteMock).toHaveBeenCalledWith(triggerFn);

      expect(triggerIgniteMock.bind).toHaveBeenCalledTimes(1);
      expect(triggerIgniteMock.bind).toHaveBeenCalledWith(service);
    });
  });

  describe('triggerIgnite', () => {
    let connectIgniteMock;

    beforeEach(() => {
      connectIgniteMock = service['connectIgnite'] = jest.fn();
    });

    it('should log when ignite is triggered', async () => {
      // given
      const attemptMock = 3;

      // when
      await service['triggerIgnite'](attemptMock);

      // then
      expect(loggerServiceMock.debug).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.debug).toHaveBeenCalledWith(
        `Apache Ignite client, Connection attempt: ${attemptMock}`,
      );
    });

    it('should call connect ignite function', async () => {
      // given
      const attemptMock = 3;

      // when
      await service['triggerIgnite'](attemptMock);

      // then
      expect(connectIgniteMock).toHaveBeenCalledTimes(1);
    });

    it('should log an error when connect ignite failed', async () => {
      // given
      const attemptMock = 3;
      const errorMock = 'any error message';
      connectIgniteMock.mockRejectedValueOnce(errorMock);

      // when
      await service['triggerIgnite'](attemptMock);

      // then
      expect(connectIgniteMock).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.error).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.error).toHaveBeenCalledWith(errorMock);
    });
  });

  describe('retryApacheIgnite', () => {
    const optionsRetryOperationMock = {
      forever: true,
      maxTimeout: 300000,
    };

    describe('without operation', () => {
      let functionMock;

      beforeEach(() => {
        functionMock = jest.fn();
        mocked(operation).mockReturnValueOnce(retryOperationMock);
        service['retryOperation'] = null;
      });

      it('should log create retry process', () => {
        // when
        service['retryApacheIgnite'](functionMock);

        // then
        expect(loggerServiceMock.debug).toHaveBeenCalledTimes(1);
        expect(loggerServiceMock.debug).toHaveBeenCalledWith(
          'Apache ignite client failed to connect, create retry process',
        );
      });

      it('should retrieve the max retry timeout from the config', () => {
        // when
        service['retryApacheIgnite'](functionMock);

        // then
        expect(configServiceMock.get).toHaveBeenCalledTimes(1);
        expect(configServiceMock.get).toHaveBeenCalledWith('ApacheIgnite');
      });

      it('should setup retryOperation with options', () => {
        // given
        const functionMock = Symbol('Function') as unknown as () => void;

        // when
        service['retryApacheIgnite'](functionMock);

        //then
        expect(operation).toHaveBeenCalledTimes(1);
        expect(operation).toHaveBeenCalledWith(optionsRetryOperationMock);
      });

      it('should call retryOperation attempt', () => {
        // given
        const functionMock = Symbol('Function') as unknown as () => void;

        // when
        service['retryApacheIgnite'](functionMock);

        // then
        expect(retryOperationMock.attempt).toHaveBeenCalledTimes(1);
        expect(retryOperationMock.attempt).toHaveBeenCalledWith(functionMock);
      });
    });

    describe('with operation', () => {
      let functionMock;

      beforeEach(() => {
        functionMock = jest.fn();
        service['retryOperation'] = retryOperationMock;
      });

      it('should log retryOperation attempt', () => {
        // when
        service['retryApacheIgnite'](functionMock);

        // then
        expect(loggerServiceMock.debug).toHaveBeenCalledTimes(1);
        expect(loggerServiceMock.debug).toHaveBeenCalledWith(
          'Apache ignite client failed to connect, retry new attempt...',
        );
      });

      // require pass error to retry attempt
      it('should call retryOperation with error', () => {
        // given
        const errorMock = 'error message' as unknown as Error;

        // when
        service['retryApacheIgnite'](functionMock, errorMock);

        // then
        expect(retryOperationMock.retry).toHaveBeenCalledTimes(1);
        expect(retryOperationMock.retry).toHaveBeenCalledWith(errorMock);
      });
    });
  });

  describe('clearRetryApacheIgnite', () => {
    beforeEach(() => {
      service['retryOperation'] = retryOperationMock;
    });

    it('should stop retryOperation operation if operation exist', () => {
      // when
      service['clearRetryApacheIgnite']();

      // then
      expect(retryOperationMock.stop).toHaveBeenCalledTimes(1);
      expect(service['retryOperation']).toBeNull();
    });
  });

  describe('connectIgnite', () => {
    it('should retrieve the ignite endpoint from the config', async () => {
      // when
      await service['connectIgnite']();

      // then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('ApacheIgnite');
    });

    it('should initialize the client ignite with an event callback', async () => {
      // when
      await service['connectIgnite']();

      // then
      expect(ApacheIgniteService['IgniteClientProxy']).toHaveBeenCalledTimes(1);
      expect(ApacheIgniteService['IgniteClientProxy']).toHaveBeenCalledWith(
        expect.any(Function),
      );
    });

    it('should initialize the client ignite configuration with the endpoint', async () => {
      // when
      await service['connectIgnite']();

      // then
      expect(
        ApacheIgniteService['IgniteClientConfigurationProxy'],
      ).toHaveBeenCalledTimes(1);
      expect(
        ApacheIgniteService['IgniteClientConfigurationProxy'],
      ).toHaveBeenCalledWith(configMock.endpoint);
    });

    it('should set the username to connect to apache-ignite', async () => {
      // when
      await service['connectIgnite']();

      // then
      expect(setUserNameMock).toHaveBeenCalledTimes(1);
      expect(setUserNameMock).toHaveBeenCalledWith(configMock.auth.username);
    });

    it('should set the password to connect to apache-ignite', async () => {
      // when
      await service['connectIgnite']();

      // then
      expect(setPasswordMock).toHaveBeenCalledTimes(1);
      expect(setPasswordMock).toHaveBeenCalledWith(configMock.auth.password);
    });

    it('should set connection options to connect to apache-ignite', async () => {
      // when
      await service['connectIgnite']();

      // then
      expect(setConnectionOptionsMock).toHaveBeenCalledTimes(1);
      expect(setConnectionOptionsMock).toHaveBeenCalledWith(
        configMock.tls.useTls,
        {
          ca: configMock.tls.ca,
          cert: configMock.tls.cert,
          key: configMock.tls.key,
        },
        true,
      );
    });

    it('should connect to ignite with the configuration built', async () => {
      // when
      await service['connectIgnite']();

      // then
      expect(igniteClientMock.connect).toHaveBeenCalledTimes(1);
      expect(igniteClientMock.connect).toHaveBeenCalledWith(
        'connected to apache ignite service',
      );
    });

    it('should set the keep alive of the socket', async () => {
      // setup
      service['setSocketKeepAlive'] = jest.fn();

      // when
      await service['connectIgnite']();

      // then
      expect(service['setSocketKeepAlive']).toHaveBeenCalledTimes(1);
      expect(service['setSocketKeepAlive']).toHaveBeenCalledWith(
        configMock.socketKeepAlive.enable,
        configMock.socketKeepAlive.initialDelay,
      );
    });
  });

  describe('onStateChanged', () => {
    let retryApacheIgniteMock;
    let triggerIgniteMock;
    const triggerFn = Symbol('triggerFn');

    beforeEach(() => {
      retryApacheIgniteMock = service['retryApacheIgnite'] = jest.fn();
      triggerIgniteMock = service['triggerIgnite'] = jest.fn();
      triggerIgniteMock.bind = jest.fn().mockReturnValueOnce(triggerFn);
    });

    it('should log when a connection event occurs', () => {
      // given
      service['clearRetryApacheIgnite'] = jest.fn();

      // when
      service['onStateChanged'](STATE.CONNECTED);

      // then
      expect(loggerServiceMock.debug).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.debug).toHaveBeenCalledWith(
        'Apache ignite client is connected',
      );

      expect(service['clearRetryApacheIgnite']).toHaveBeenCalledTimes(1);
    });

    it('should log the reason when a disconnection event occurs with string', () => {
      // given
      const reason = 'Why do we always need a reason ?';
      const errorMock = new Error(reason);

      // when
      service['onStateChanged'](STATE.DISCONNECTED, reason);

      expect(triggerIgniteMock.bind).toHaveBeenCalledTimes(1);
      expect(triggerIgniteMock.bind).toHaveBeenCalledWith(service);
      expect(retryApacheIgniteMock).toHaveBeenCalledTimes(1);
      expect(retryApacheIgniteMock).toHaveBeenCalledWith(triggerFn, errorMock);
    });

    it('should log the reason when a disconnection event occurs  with an error', () => {
      // given
      const reason = 'Why do we always need a reason ?';
      const errorMock = new Error(reason);

      // when
      service['onStateChanged'](STATE.DISCONNECTED, errorMock);

      expect(triggerIgniteMock.bind).toHaveBeenCalledTimes(1);
      expect(triggerIgniteMock.bind).toHaveBeenCalledWith(service);
      expect(retryApacheIgniteMock).toHaveBeenCalledTimes(1);
      expect(retryApacheIgniteMock).toHaveBeenCalledWith(triggerFn, errorMock);
    });

    it('should not log anything if the state is not CONNECTED or DISCONNECTED', () => {
      // setup
      const STATE_UNKNOWWN_MOCK = 42;

      // when
      service['onStateChanged'](STATE_UNKNOWWN_MOCK);

      // then
      expect(loggerServiceMock.debug).toHaveBeenCalledTimes(0);
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect the ignite client on module destroy', async () => {
      // when
      await service['onModuleDestroy']();

      // then
      expect(igniteClientMock.disconnect).toHaveBeenCalledTimes(1);
      expect(igniteClientMock.disconnect).toHaveBeenCalledWith();
    });
  });

  describe('getCache', () => {
    const cache = 'mycache';

    it('should call igniteClient.getCache with the cache name', async () => {
      // when
      await service['getCache'](cache);

      // then
      expect(igniteClientMock.getCache).toHaveBeenCalledTimes(1);
      expect(igniteClientMock.getCache).toHaveBeenCalledWith(cache);
    });

    it('should call the cache setKeyType with the primitive string type if no key type is provided', async () => {
      // when
      await service['getCache'](cache);

      // then
      expect(igniteClientMock.setKeyType).toHaveBeenCalledTimes(1);
      expect(igniteClientMock.setKeyType).toHaveBeenCalledWith(
        ObjectType.PRIMITIVE_TYPE.STRING,
      );
    });

    it('should call the cache setValueType with the primitive string type if no value type is provided', async () => {
      // when
      await service['getCache'](cache);

      // then
      expect(igniteClientMock.setValueType).toHaveBeenCalledTimes(1);
      expect(igniteClientMock.setValueType).toHaveBeenCalledWith(
        ObjectType.PRIMITIVE_TYPE.STRING,
      );
    });

    it('should call the cache setKeyType with the primitive string type if no key type is provided', async () => {
      // when
      await service['getCache'](cache, ObjectType.PRIMITIVE_TYPE.INTEGER);

      // then
      expect(igniteClientMock.setKeyType).toHaveBeenCalledTimes(1);
      expect(igniteClientMock.setKeyType).toHaveBeenCalledWith(
        ObjectType.PRIMITIVE_TYPE.INTEGER,
      );
    });

    it('should call the cache setValueType with the primitive string type if no value type is provided', async () => {
      // when
      await service['getCache'](
        cache,
        ObjectType.PRIMITIVE_TYPE.STRING,
        ObjectType.PRIMITIVE_TYPE.INTEGER,
      );

      // then
      expect(igniteClientMock.setValueType).toHaveBeenCalledTimes(1);
      expect(igniteClientMock.setValueType).toHaveBeenCalledWith(
        ObjectType.PRIMITIVE_TYPE.INTEGER,
      );
    });

    it('should return the cache', async () => {
      // when
      const result = await service['getCache'](
        cache,
        ObjectType.PRIMITIVE_TYPE.STRING,
        ObjectType.PRIMITIVE_TYPE.INTEGER,
      );

      // then
      expect(result).toStrictEqual(cacheObjectMock);
    });
  });

  describe('setSocketKeepAlive', () => {
    it('should set the keep alive of the low level NodeJs socket instance', () => {
      // setup
      const socketKeepAliveConfig = {
        enable: true,
        initialDelay: 150000,
      };

      // when
      service['setSocketKeepAlive'](
        socketKeepAliveConfig.enable,
        socketKeepAliveConfig.initialDelay,
      );

      // then
      expect(
        igniteClientMock._socket._socket._socket.setKeepAlive,
      ).toHaveBeenCalledTimes(1);
      expect(
        igniteClientMock._socket._socket._socket.setKeepAlive,
      ).toHaveBeenCalledWith(
        socketKeepAliveConfig.enable,
        socketKeepAliveConfig.initialDelay,
      );
    });

    it('should throw an ApacheIgniteInvalidSocketException id there is no socket', () => {
      // setup
      service['igniteClient'] = { _socket: undefined };
      const socketKeepAliveConfig = {
        enable: true,
        initialDelay: 150000,
      };

      // when
      expect(() =>
        service['setSocketKeepAlive'](
          socketKeepAliveConfig.enable,
          socketKeepAliveConfig.initialDelay,
        ),
      ).toThrow(ApacheIgniteInvalidSocketException);
    });
  });
});
